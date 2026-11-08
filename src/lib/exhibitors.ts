import { prisma } from "@/lib/prisma";

export async function getExhibitorSummary() {
  return prisma.exhibitor.count();
}

export async function getFooterExhibitors(limit = 20) {
  return prisma.exhibitor.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: { companyName: true, country: true },
  });
}
