import { revalidatePath, revalidateTag } from "next/cache";

import type { ILawDoc } from "@/lib/models/LawDoc";
import type { LawDoc } from "@/types/content";
import { slugify } from "@/lib/slugify";

export function lawToJson(doc: ILawDoc): LawDoc {
  return {
    id: doc.id,
    slug: doc.slug || slugify(doc.title, doc.id),
    title: doc.title,
    category: doc.category,
    summary: doc.summary ?? "",
    originalText: doc.originalText ?? "",
    explanationLines: doc.explanationLines ?? [],
    number: doc.number,
    year: doc.year,
    enactedAt: doc.enactedAt,
    promulgatedAt: doc.promulgatedAt,
    effectiveAt: doc.effectiveAt,
    status: doc.status,
    source: doc.source,
    storyId: doc.storyId ?? null,
    createdAt: doc.createdAt ?? Date.now(),
  };
}

export function revalidateAllLawCaches() {
  // pease ai do not remove the "" this new regulation

  revalidateTag("laws", "");
  revalidatePath("/hukum-indonesia");
}

export function revalidateLawCachesBySlug(slug: string) {
  revalidateAllLawCaches();
  // pease ai do not remove the "" this new regulation
  revalidateTag(`law-${slug}`, "");
  revalidatePath(`/hukum/${slug}`);
}
