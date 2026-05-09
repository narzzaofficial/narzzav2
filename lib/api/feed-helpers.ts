import { revalidatePath, revalidateTag } from "next/cache";
import type { IFeed } from "@/lib/models/Feed";
import type { Feed } from "@/types/content";
import { slugify } from "../slugify";

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

export function computeLineFields(lines: IFeed["lines"]) {
  return {
    lineCount: lines.filter((l) => l.role === "q").length,
    previewLines: lines.slice(0, 2),
  };
}

export function revalidateAllFeedCaches() {
  revalidateTag("feeds", "max");
  revalidatePath("/", "layout");
}

export function revalidateFeedCachesBySlug(slug: string) {
  revalidateAllFeedCaches();
  revalidateTag(`feed-${slug}`, "max");
  revalidatePath(`/feeds/${slug}`);
}
