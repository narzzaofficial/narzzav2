import { cache } from "react";
import { unstable_cache } from "next/cache";

import { lawToJson } from "@/lib/api/law-helpers";
import { HUKUM_CATEGORIES } from "@/lib/law-categories";
import { connectDB } from "@/lib/mongodb";
import { LawDocModel, type ILawDoc } from "@/lib/models/LawDoc";
import type { HukumCategory, LawDoc, PaginatedLawDocs } from "@/types/content";

const LAW_TAG = "laws";

async function fetchLawsByCategory(
  category: HukumCategory,
  page: number,
  limit: number
): Promise<PaginatedLawDocs> {
  const conn = await connectDB();
  if (!conn) {
    return {
      items: [],
      pagination: { page, limit, total: 0, totalPages: 0, hasMore: false },
    };
  }

  const skip = (page - 1) * limit;
  const filter = { category };

  const [items, total] = await Promise.all([
    LawDocModel.find(filter)
      .sort({ promulgatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-originalText")
      .lean(),
    LawDocModel.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => lawToJson(item as ILawDoc)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + items.length < total,
    },
  };
}

const getLatestLawsByCategoryCached = unstable_cache(
  async (category: HukumCategory, limit = 10): Promise<LawDoc[]> => {
    const data = await fetchLawsByCategory(category, 1, limit);
    return data.items;
  },
  ["laws-latest-by-category"],
  { revalidate: 3600, tags: [LAW_TAG] }
);

const getLawsByCategoryCached = unstable_cache(
  async (
    category: HukumCategory,
    page = 1,
    limit = 20
  ): Promise<PaginatedLawDocs> => fetchLawsByCategory(category, page, limit),
  ["laws-by-category-paginated"],
  { revalidate: 3600, tags: [LAW_TAG] }
);

const getLawBySlugCached = unstable_cache(
  async (slug: string): Promise<LawDoc | null> => {
    const conn = await connectDB();
    if (!conn) return null;

    const normalizedSlug = slug.trim();
    if (!normalizedSlug) return null;

    const doc = await LawDocModel.findOne({ slug: normalizedSlug }).lean();
    return doc ? lawToJson(doc as ILawDoc) : null;
  },
  ["law-by-slug"],
  { revalidate: 3600, tags: [LAW_TAG] }
);

export const getLatestLawsByCategory = cache(getLatestLawsByCategoryCached);
export const getLawsByCategory = cache(getLawsByCategoryCached);
export const getLawBySlug = cache(getLawBySlugCached);

export async function getLawById(id: number): Promise<LawDoc | null> {
  const conn = await connectDB();
  if (!conn) return null;

  const doc = await LawDocModel.findOne({ id }).lean();
  return doc ? lawToJson(doc as ILawDoc) : null;
}

export const getAllLaws = cache(async (): Promise<LawDoc[]> => {
  const perCategory = await Promise.all(
    HUKUM_CATEGORIES.map(async (category) => {
      const all: LawDoc[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const result = await getLawsByCategory(category, page, 100);
        all.push(...result.items);
        hasMore = result.pagination.hasMore;
        page += 1;
      }

      return all;
    })
  );

  return perCategory.flat();
});
