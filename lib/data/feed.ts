// lib/data/feeds.ts

import { unstable_cache } from "next/cache";
import type { Feed, PaginatedFeeds, Category } from "@/types/content";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ─── HOMEPAGE: Latest 10 feeds per category ──────────────────────────────────
export const getLatestByCategory = unstable_cache(
  async (category: Category, limit = 10): Promise<Feed[]> => {
    const res = await fetch(
      `${API_URL}/api/feeds?category=${category}&limit=${limit}&page=1`,
      { next: { revalidate: 3600, tags: ["feeds"] } }
    );
    if (!res.ok) throw new Error("Failed to fetch feeds");
    const data: PaginatedFeeds = await res.json();
    return data.feeds;
  },
  ["feeds-latest-by-category"],
  { revalidate: 3600, tags: ["feeds"] }
);

// ─── CATEGORY PAGE: Paginated feeds (page 1 - SSR) ───────────────────────────
export const getFeedsByCategory = unstable_cache(
  async (
    category: Category,
    page = 1,
    limit = 20
  ): Promise<PaginatedFeeds> => {
    const res = await fetch(
      `${API_URL}/api/feeds?category=${category}&page=${page}&limit=${limit}`,
      { next: { revalidate: page === 1 ? 3600 : 300, tags: ["feeds"] } }
    );
    if (!res.ok) throw new Error("Failed to fetch feeds");
    return res.json();
  },
  ["feeds-by-category-paginated"],
  { revalidate: 3600, tags: ["feeds"] }
);

// ─── READ PAGE: By slug ───────────────────────────────────────────────────────
export const getFeedBySlug = unstable_cache(
  async (slug: string): Promise<Feed | null> => {
    const res = await fetch(`${API_URL}/api/feeds?slug=${slug}`, {
      next: { revalidate: 3600, tags: ["feeds"] },
    });
    if (!res.ok) return null;
    return res.json();
  },
  ["feed-by-slug"],
  { revalidate: 3600, tags: ["feeds"] }
);

// ─── ADMIN: By ID (no cache) ──────────────────────────────────────────────────
export async function getFeedById(id: number): Promise<Feed | null> {
  const res = await fetch(`${API_URL}/api/feeds/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}