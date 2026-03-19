import { FeedPage } from "@/components/frontend/FeedPage";
import { getLatestByCategory, searchLatestByCategory } from "@/lib/feeds";

type PageProps = {
  searchParams?: { q?: string | string[] } | Promise<{ q?: string | string[] }>;
};

export default async function TutorialPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const query = q.trim();

  const feeds = query
    ? await searchLatestByCategory("Tutorial", query, 20)
    : await getLatestByCategory("Tutorial", 20);

  return (
    <FeedPage
      key={`tutorial:${query}`}
      activePath="/tutorial"
      badge="Tutorial"
      title="Panduan Praktis & Step-by-Step"
      description="Kumpulan tutorial ringkas untuk belajar dan langsung praktik."
      category="Tutorial"
      initialFeeds={feeds}
      initialQuery={query}
    />
  );
}
