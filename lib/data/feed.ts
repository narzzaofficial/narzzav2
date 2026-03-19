import { cache } from "react";
import { unstable_cache } from "next/cache";

import { feedToJson } from "@/lib/api/feed-helpers";
import { connectDB } from "@/lib/mongodb";
import { FeedModel, type IFeed } from "@/lib/models/Feed";
import type { Category, Feed, PaginatedFeeds } from "@/types/content";

const FEED_TAG = "feeds";
const MAX_SEARCH_LEN = 80;

function normalizeSearchQuery(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  return trimmed.slice(0, MAX_SEARCH_LEN);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function fetchFeedsByCategory(
  category: Category,
  page: number,
  limit: number
): Promise<PaginatedFeeds> {
  const conn = await connectDB();
  if (!conn) {
    return {
      feeds: [],
      pagination: { page, limit, total: 0, totalPages: 0, hasMore: false },
    };
  }

  const skip = (page - 1) * limit;
  const filter = { category };

  const [feeds, total] = await Promise.all([
    FeedModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("id slug title category createdAt image lineCount takeaway storyId")
      .lean(),
    FeedModel.countDocuments(filter),
  ]);

  return {
    feeds: feeds.map((item) => feedToJson(item as IFeed)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + feeds.length < total,
    },
  };
}

const getLatestByCategoryCached = unstable_cache(
  async (category: Category, limit = 10): Promise<Feed[]> => {
    const data = await fetchFeedsByCategory(category, 1, limit);
    return data.feeds;
  },
  ["feeds-latest-by-category"],
  { revalidate: 3600, tags: [FEED_TAG] }
);

const searchLatestByCategoryCached = unstable_cache(
  async (category: Category, query: string, limit = 20): Promise<Feed[]> => {
    const normalized = normalizeSearchQuery(query);
    if (!normalized) {
      const data = await fetchFeedsByCategory(category, 1, limit);
      return data.feeds;
    }

    const conn = await connectDB();
    if (!conn) return [];

    // Title-only search (case-insensitive).
    const pattern = escapeRegex(normalized);
    const docs = await FeedModel.find({
      category,
      title: { $regex: pattern, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("id slug title category createdAt image lineCount takeaway storyId")
      .lean();

    return docs.map((item) => feedToJson(item as IFeed));
  },
  ["feeds-search-latest-by-category"],
  // Search query bisa banyak variannya, jadi cache-nya lebih pendek.
  { revalidate: 300, tags: [FEED_TAG] }
);

const getFeedsByCategoryCached = unstable_cache(
  async (category: Category, page = 1, limit = 20): Promise<PaginatedFeeds> =>
    fetchFeedsByCategory(category, page, limit),
  ["feeds-by-category-paginated"],
  { revalidate: 3600, tags: [FEED_TAG] }
);

const getFeedBySlugCached = unstable_cache(
  async (slug: string): Promise<Feed | null> => {
    const conn = await connectDB();
    if (!conn) return null;

    const normalizedSlug = slug.trim();
    if (!normalizedSlug) return null;

    const doc = await FeedModel.findOne({ slug: normalizedSlug }).lean();
    return doc ? feedToJson(doc as IFeed) : null;
  },
  ["feed-by-slug"],
  { revalidate: 3600, tags: [FEED_TAG] }
);

export const getLatestByCategory = cache(getLatestByCategoryCached);
export const searchLatestByCategory = cache(searchLatestByCategoryCached);
export const getFeedsByCategory = cache(getFeedsByCategoryCached);
export const getFeedBySlug = cache(getFeedBySlugCached);

export async function getFeedById(id: number): Promise<Feed | null> {
  const conn = await connectDB();
  if (!conn) return null;

  const doc = await FeedModel.findOne({ id }).lean();
  return doc ? feedToJson(doc as IFeed) : null;
}

export const getAllFeeds = cache(async (): Promise<Feed[]> => {
  const categories: Category[] = ["Berita", "Tutorial", "Riset"];
  const perCategory = await Promise.all(
    categories.map(async (category) => {
      const all: Feed[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const result = await getFeedsByCategory(category, page, 100);
        all.push(...result.feeds);
        hasMore = result.pagination.hasMore;
        page += 1;
      }

      return all;
    })
  );

  return perCategory.flat();
});
