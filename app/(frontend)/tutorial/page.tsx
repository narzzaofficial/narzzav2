import { FeedPage } from "@/components/frontend/FeedPage";
import { getLatestByCategory, searchLatestByCategory } from "@/lib/feeds";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutorial",
  description:
    "Kumpulan tutorial ringkas dan step-by-step untuk belajar, mencoba, dan langsung praktik.",
  alternates: {
    canonical: "/tutorial",
  },
  openGraph: {
    title: "Tutorial",
    description:
      "Kumpulan tutorial ringkas dan step-by-step untuk belajar, mencoba, dan langsung praktik.",
    url: "/tutorial",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tutorial",
    description:
      "Kumpulan tutorial ringkas dan step-by-step untuk belajar, mencoba, dan langsung praktik.",
  },
};

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
