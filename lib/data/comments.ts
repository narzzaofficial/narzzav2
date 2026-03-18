import { unstable_cache } from "next/cache";

import { connectDB } from "@/lib/mongodb";
import { FeedCommentModel, type IFeedComment } from "@/lib/models/FeedComment";
import type { FeedComment } from "@/types/content";

function normalizeComment(doc: IFeedComment & { _id: unknown }): FeedComment {
  return {
    id: String(doc._id),
    feedId: doc.feedId,
    feedSlug: doc.feedSlug,
    name: doc.name,
    message: doc.message,
    createdAt: doc.createdAt,
  };
}

export const getCommentsByFeedId = unstable_cache(
  async (feedId: number): Promise<FeedComment[]> => {
    const conn = await connectDB();
    if (!conn) return [];

    const comments = await FeedCommentModel.find({ feedId })
      .sort({ createdAt: -1 })
      .limit(80)
      .lean();

    return comments.map((item) => normalizeComment(item as IFeedComment & { _id: unknown }));
  },
  ["comments-by-feed-id"],
  { revalidate: 120, tags: ["comments"] }
);
