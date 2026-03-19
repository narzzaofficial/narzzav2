import { FeedPage } from "@/components/frontend/FeedPage";
import { getLatestByCategory, searchLatestByCategory } from "@/lib/feeds";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita Teknologi",
  description:
    "Berita terbaru seputar teknologi, startup, dan inovasi digital dalam format yang lebih ringkas dan mudah dipahami.",
  alternates: {
    canonical: "/berita",
  },
  openGraph: {
    title: "Berita Teknologi",
    description:
      "Berita terbaru seputar teknologi, startup, dan inovasi digital dalam format yang lebih ringkas dan mudah dipahami.",
    url: "/berita",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Berita Teknologi",
    description:
      "Berita terbaru seputar teknologi, startup, dan inovasi digital dalam format yang lebih ringkas dan mudah dipahami.",
  },
};

type PageProps = {
  searchParams?: { q?: string | string[] } | Promise<{ q?: string | string[] }>;
};

export default async function BeritaPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const query = q.trim();

  const feeds = query
    ? await searchLatestByCategory("Berita", query, 20)
    : await getLatestByCategory("Berita", 20);

  return (
    <FeedPage
      key={`berita:${query}`}
      activePath="/berita"
      badge="Berita"
      title="Update Teknologi Terkini"
      description="Berita terbaru seputar teknologi, startup, dan inovasi digital."
      category="Berita"
      initialFeeds={feeds}
      initialQuery={query}
    />
  );
}
