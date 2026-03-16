import { FeedPage } from "@/components/frontend/FeedPage";
import { getLatestByCategory } from "@/lib/data/feed";
import type { Metadata } from "next";

// export const metadata: Metadata = createPageMeta({
//   title: "Berita, Tutorial & Riset",
//   description:
//     "Platform media digital yang menyajikan informasi dari berbagai bidang dalam format interaktif dan mudah dipahami. Baca topik panjang jadi santai.",
//   path: "/",
// });

export default async function HomePage() {
  // Fetch 10 latest from each category
  const [berita, tutorial, riset] = await Promise.all([
    getLatestByCategory("Berita", 10),
    getLatestByCategory("Tutorial", 10),
    getLatestByCategory("Riset", 10),
  ]);

  // Combine and sort by createdAt (newest first)
  const allFeeds = [...berita, ...tutorial, ...riset].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  return (
    <FeedPage
      activePath="/"
      badge="Narzza Media Digital"
      title="Berita, tutorial, dan eksperimen dalam format chat"
      description="Baca topik panjang jadi lebih santai: pertanyaan singkat, jawaban padat, dan inti cepat per konten."
      initialFeeds={allFeeds}
    />
  );
}
