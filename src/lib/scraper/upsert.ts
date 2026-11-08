import type { Prisma, PrismaClient } from "@prisma/client";
import { PORTAL_SLUG, type RawExhibitorRecord } from "@/lib/scraper/mmiconnect";

type Tx = PrismaClient | Prisma.TransactionClient;

function normalizedKey(companyName: string, country: string) {
  return `${companyName.trim().toUpperCase()}|${country.trim().toUpperCase()}`;
}

/** Memoized per scrape run — at most a handful of distinct exhibitions. */
export function createExhibitionCache() {
  return new Map<string, string>(); // exhibitionName -> Exhibition.id
}

async function getOrCreateExhibitionId(
  prisma: Tx,
  cache: Map<string, string>,
  exhibitionName: string,
): Promise<string> {
  const cached = cache.get(exhibitionName);
  if (cached) return cached;

  const exhibition = await prisma.exhibition.upsert({
    where: { portalSlug_name: { portalSlug: PORTAL_SLUG, name: exhibitionName } },
    create: { portalSlug: PORTAL_SLUG, name: exhibitionName },
    update: {},
  });
  cache.set(exhibitionName, exhibition.id);
  return exhibition.id;
}

export async function upsertExhibitorRecord(
  prisma: Tx,
  cache: Map<string, string>,
  record: RawExhibitorRecord,
) {
  const exhibitionId = await getOrCreateExhibitionId(prisma, cache, record.exhibitionName);
  const key = normalizedKey(record.companyName, record.country);

  const exhibitor = await prisma.exhibitor.upsert({
    where: { mmiExhibitorId: record.mmiExhibitorId },
    create: {
      mmiExhibitorId: record.mmiExhibitorId,
      normalizedKey: key,
      companyName: record.companyName,
      country: record.country,
      logoUrl: record.logoUrl,
    },
    update: {
      normalizedKey: key,
      companyName: record.companyName,
      country: record.country,
      logoUrl: record.logoUrl,
    },
  });

  if (record.boothNo) {
    await prisma.exhibitorBooth.upsert({
      where: { exhibitionId_boothNo: { exhibitionId, boothNo: record.boothNo } },
      create: {
        exhibitorId: exhibitor.id,
        exhibitionId,
        hallNo: record.hallNo,
        boothNo: record.boothNo,
      },
      update: {
        exhibitorId: exhibitor.id,
        hallNo: record.hallNo,
      },
    });
  }
}
