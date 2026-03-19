import { cache } from "react";
import { unstable_cache } from "next/cache";

import { storyToJson } from "@/lib/api/story-helpers";
import { connectDB } from "@/lib/mongodb";
import { StoryModel, type IStory } from "@/lib/models/Story";
import type { Story } from "@/types/content";

const STORY_TAG = "stories";

const getAllStoriesCached = unstable_cache(
  async (): Promise<Story[]> => {
    const conn = await connectDB();
    if (!conn) return [];

    const docs = await StoryModel.find({})
      .sort({ viral: -1, createdAt: -1, id: -1 })
      .lean();

    return docs.map((doc) => storyToJson(doc as IStory));
  },
  ["stories-all"],
  { revalidate: 3600, tags: [STORY_TAG] }
);

const getStoryByIdCached = unstable_cache(
  async (id: number): Promise<Story | null> => {
    const conn = await connectDB();
    if (!conn) return null;

    const doc = await StoryModel.findOne({ id }).lean();
    return doc ? storyToJson(doc as IStory) : null;
  },
  ["story-by-id"],
  { revalidate: 3600, tags: [STORY_TAG] }
);

export const getAllStories = cache(getAllStoriesCached);
export const getStoryById = cache(getStoryByIdCached);
