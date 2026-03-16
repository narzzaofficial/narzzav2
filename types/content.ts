// types/content.ts

export type Category = "Berita" | "Tutorial" | "Riset";

export interface ChatLine {
  role: "q" | "a";
  text: string;
  image?: string;
}

export type Source = {
  title: string;
  url: string;
};

export type Story = {
  id: number;
  name: string;
  type: string;
};

// ─── 1. TIPE DATABASE FINAL (The Single Source of Truth) ───
// Ini sama persis dengan apa yang ada di Mongoose Model kamu
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
  source?: Source;
  storyId: number | null;
}

// ─── 2. TIPE FORM INPUT (Untuk Frontend) ───
// Menggunakan 'Omit' untuk mengambil SEMUA properti dari 'Feed',
// KECUALI id, slug, createdAt, lineCount, dan previewLines (karena ini tugas server).
export type FeedFormInput = Omit<
  Feed,
  "id" | "slug" | "createdAt" | "lineCount" | "previewLines"
>;

// ─── 3. TIPE API RESPONSE (Pagination) ───
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
