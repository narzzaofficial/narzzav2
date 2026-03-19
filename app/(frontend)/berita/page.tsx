import { FeedPage } from "@/components/frontend/FeedPage";
import { getLatestByCategory, searchLatestByCategory } from "@/lib/feeds";

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
