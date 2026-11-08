import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCandidateSlots } from "@/lib/slots";

export async function GET() {
  const candidates = generateCandidateSlots();
  if (candidates.length === 0) {
    return NextResponse.json({ slots: [] });
  }

  const starts = candidates.map((slot) => new Date(slot.start));
  const taken = await prisma.booking.findMany({
    where: { slotStart: { in: starts } },
    select: { slotStart: true },
  });
  const takenSet = new Set(taken.map((booking) => booking.slotStart.toISOString()));

  const slots = candidates.filter((slot) => !takenSet.has(slot.start));

  return NextResponse.json({ slots });
}
