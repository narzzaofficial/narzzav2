import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import { computeLineFields, revalidateFeedCachesBySlug } from "@/lib/api/feed-helpers";
import { slugify } from "@/lib/slugify";
import { getNextSequence } from "@/lib/sequence";
import type { IChatLine } from "@/lib/models/Feed";

export interface FeedPayload {
  title: string;
  category: "Berita" | "Tutorial" | "Riset";
  image: string;
  lines: IChatLine[];
  takeaway: string;
  sourceTitle: string;
  sourceUrl: string;
}

export async function createFeedDirectly(payload: FeedPayload): Promise<number> {
  await connectDB();

  const maxFeed = await FeedModel.findOne({}).sort({ id: -1 }).select("id").lean();
  const nextId = await getNextSequence("feedId", maxFeed?.id ?? 0);
  const slug = slugify(payload.title, nextId);

  await FeedModel.create({
    id: nextId,
    slug,
    title: payload.title,
    category: payload.category,
    image: payload.image,
    lines: payload.lines,
    ...computeLineFields(payload.lines),
    takeaway: payload.takeaway,
    author: "Narzza AI",
    source: { title: payload.sourceTitle, url: payload.sourceUrl },
    storyId: null,
    createdAt: Date.now(),
  });

  revalidateFeedCachesBySlug(slug);

  return nextId;
}
