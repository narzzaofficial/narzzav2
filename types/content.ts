// types/content.ts

export type Category = "Berita" | "Tutorial" | "Riset";

export interface ChatLine {
  role: "q" | "a";
  text: string;
  image?: string;
}

export interface Feed {
  id: number;
  slug: string;
  title: string;
  category: Category;
  createdAt: number;
  image: string;
  lines: ChatLine[];
  lineCount: number;
  previewLines: ChatLine[];
  takeaway: string;
  author: string;
  source?: { title: string; url: string };
  storyId: number | null;
}

export interface PaginatedFeeds {
  feeds: Feed[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}