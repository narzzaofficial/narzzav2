import { FeedPage } from "@/components/frontend/FeedPage";
import { getLatestByCategory, searchLatestByCategory } from "@/lib/feeds";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riset",
  description:
    "Dokumentasi eksperimen, insight, dan temuan riset dalam format yang lebih mudah dicerna.",
  alternates: {
    canonical: "/riset",
  },
  openGraph: {
    title: "Riset",
    description:
      "Dokumentasi eksperimen, insight, dan temuan riset dalam format yang lebih mudah dicerna.",
    url: "/riset",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riset",
    description:
      "Dokumentasi eksperimen, insight, dan temuan riset dalam format yang lebih mudah dicerna.",
  },
};

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
