import { prisma } from "../database/prisma.js";

export async function searchSuggestions(query: string) {
  return prisma.suggestion.findMany({
    where: {
      label: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: 10,
  });
}

export async function addSuggestion(label: string) {
  return prisma.suggestion.create({
    data: { label },
  });
}
