import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { scrapeAllExhibitors } from "@/lib/scraper/mmiconnect";
import { createExhibitionCache, upsertExhibitorRecord } from "@/lib/scraper/upsert";

const TIMEOUT_MS = 180_000;
const STALE_RUN_MS = 5 * 60 * 1000;

async function runScrape(runId: string) {
  const cache = createExhibitionCache();
  let pagesScraped = 0;

  const records = await scrapeAllExhibitors((progress) => {
    pagesScraped = progress.pagesScraped;
  });

  for (const record of records) {
    await upsertExhibitorRecord(prisma, cache, record);
  }

  // `updateMany` with status: RUNNING guards against a late completion
  // after this run was already marked FAILED by the timeout path below —
  // whichever terminal write lands first wins; the other becomes a no-op.
  await prisma.scrapeRun.updateMany({
    where: { id: runId, status: "RUNNING" },
    data: {
      status: "SUCCESS",
      finishedAt: new Date(),
      pagesScraped,
      exhibitorsUpserted: records.length,
    },
  });

  return { pagesScraped, exhibitorsUpserted: records.length };
}

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("timeout")), ms);
  });
}

// A partial unique index (migration 20261107040000_scraperun_single_running)
// allows at most one ScrapeRun row with status RUNNING, so this insert is
// the atomic "claim the run" step — no separate check-then-insert race.
async function claimRun() {
  try {
    return await prisma.scrapeRun.create({ data: {} });
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) {
      throw error;
    }

    // Another RUNNING row exists. If it's stale (the process that owned it
    // likely crashed before reaching a terminal state), reclaim it instead
    // of blocking the trigger endpoint forever.
    const staleCutoff = new Date(Date.now() - STALE_RUN_MS);
    const reclaimed = await prisma.scrapeRun.updateMany({
      where: { status: "RUNNING", startedAt: { lte: staleCutoff } },
      data: { status: "FAILED", finishedAt: new Date(), errorMessage: "stale run reclaimed" },
    });
    if (reclaimed.count === 0) {
      return null; // a genuinely in-progress run owns the slot
    }
    return prisma.scrapeRun.create({ data: {} });
  }
}

export async function POST() {
  const run = await claimRun();
  if (!run) {
    return NextResponse.json({ error: "scrape_in_progress" }, { status: 409 });
  }
  const startedAt = Date.now();

  try {
    const result = await Promise.race([runScrape(run.id), timeout(TIMEOUT_MS)]);
    return NextResponse.json({
      status: "success",
      pagesScraped: result.pagesScraped,
      exhibitorsUpserted: result.exhibitorsUpserted,
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isTimeout = message === "timeout";

    await prisma.scrapeRun.updateMany({
      where: { id: run.id, status: "RUNNING" },
      data: { status: "FAILED", finishedAt: new Date(), errorMessage: message },
    });

    return NextResponse.json(
      { status: "failed", error: message },
      { status: isTimeout ? 504 : 500 },
    );
  }
}
