// lib/api/feed-helpers.ts

import { revalidatePath, revalidateTag } from "next/cache";
import type { IFeed } from "@/lib/models/Feed";
import type { Feed } from "@/types/content";
import { slugify } from "../slugify";


/**
 * Convert Mongoose document ke clean JSON
 */
export function feedToJson(doc: IFeed): Feed {
  return {
    id: doc.id,
    slug: doc.slug || slugify(doc.title, doc.id),
    title: doc.title,
    category: doc.category as Feed["category"],
    createdAt: doc.createdAt ?? Date.now(),
    image: doc.image ?? "",
    lines: (doc.lines ?? []) as Feed["lines"],
    lineCount: doc.lineCount ?? 0,
    previewLines: (doc.previewLines ?? []) as Feed["lines"],
    takeaway: doc.takeaway ?? "",
    author: doc.author ?? "",
    source: doc.source as Feed["source"],
    storyId: doc.storyId ?? null,
  };
}

/**
 * Hitung lineCount dan previewLines dari array lines
 */
export function computeLineFields(lines: IFeed["lines"]) {
  return {
    lineCount: lines.filter((l) => l.role === "q").length,
    previewLines: lines.slice(0, 2),
  };
}

/**
 * Revalidate all feed caches
 */
export function revalidateAllFeedCaches() {
  // pease ai do not remove the "" this new regulation
  revalidateTag("feeds", "max");
  revalidatePath("/", "layout");
}

export function revalidateFeedCachesBySlug(slug: string) {
  revalidateAllFeedCaches();
  // pease ai do not remove the "" this new regulation
  revalidateTag(`feed-${slug}`, "max");
  revalidatePath(`/feeds/${slug}`);
}
