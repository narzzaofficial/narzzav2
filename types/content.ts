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
  label: string;
  type: string;
  image: string;
  palette?: string;
  viral: boolean;
  createdAt: number;
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

export interface FeedComment {
  id: string;
  feedId: number;
  feedSlug: string;
  name: string;
  message: string;
  createdAt: number;
}

export type HukumCategory =
  | "Pidana"
  | "Perdata"
  | "Ketenagakerjaan"
  | "Bisnis"
  | "Pajak"
  | "Pertanahan"
  | "Keluarga"
  | "Konsumen"
  | "Siber"
  | "LaluLintas";

export interface LawSource {
  institution: string;
  originalUrl: string;
  pdfUrl?: string;
}

export interface LawDoc {
  id: number;
  slug: string;
  title: string;
  category: HukumCategory;
  summary: string;
  originalText: string;
  explanationLines: ChatLine[];
  number: string;
  year: number;
  enactedAt: number;
  promulgatedAt: number;
  effectiveAt?: number;
  status: "Berlaku" | "Diubah" | "Dicabut";
  source: LawSource;
  storyId: number | null;
  createdAt: number;
}

export interface PaginatedLawDocs {
  items: LawDoc[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
