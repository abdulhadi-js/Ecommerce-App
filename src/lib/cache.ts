import { prisma } from "./db";
import { unstable_cache } from "next/cache";

export const getCachedCategories = unstable_cache(
  async () => {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  },
  ["categories"],
  { revalidate: 3600, tags: ["categories"] }
);

export const getCachedLatestProducts = unstable_cache(
  async (limit: number = 4) => {
    return prisma.product.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      where: { inventory: { gt: 0 } },
    });
  },
  ["latest-products"],
  { revalidate: 3600, tags: ["products"] }
);

export const getCachedLatestReviews = unstable_cache(
  async (limit: number = 9) => {
    return prisma.review.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
  },
  ["latest-reviews"],
  { revalidate: 3600, tags: ["reviews"] }
);
