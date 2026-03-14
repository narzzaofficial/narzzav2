// types/api.ts

import type { ChatLine, Category } from "./content";

export interface CreateFeedInput {
  title: string;
  category: Category;
  image: string;
  lines: ChatLine[];
  takeaway: string;
  author?: string;
  source?: { title: string; url: string };
  storyId?: number | null;
}

export interface UpdateFeedInput {
  title?: string;
  category?: Category;
  image?: string;
  lines?: ChatLine[];
  takeaway?: string;
  author?: string;
  source?: { title: string; url: string };
  storyId?: number | null;
}