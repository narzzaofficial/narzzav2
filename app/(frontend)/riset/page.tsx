import { FeedPage } from "@/components/frontend/FeedPage";
import { getLatestByCategory, searchLatestByCategory } from "@/lib/feeds";

type PageProps = {
  searchParams?: { q?: string | string[] } | Promise<{ q?: string | string[] }>;
};

export default async function RisetPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const query = q.trim();

  const feeds = query
    ? await searchLatestByCategory("Riset", query, 20)
    : await getLatestByCategory("Riset", 20);

  return (
    <FeedPage
      key={`riset:${query}`}
      activePath="/riset"
      badge="Riset"
      title="Riset, Eksperimen, dan Temuan"
      description="Dokumentasi eksperimen, insight teknis, dan temuan dari proses riset."
      category="Riset"
      initialFeeds={feeds}
      initialQuery={query}
    />
  );
}
