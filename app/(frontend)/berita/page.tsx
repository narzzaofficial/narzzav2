import { FeedPage } from "@/components/frontend/FeedPage";
import { getLatestByCategory } from "@/lib/feeds";
import type { Metadata } from "next";

// export const metadata: Metadata = createPageMeta({
//   title: "Berita Teknologi",
//   description:
//     "Berita terbaru seputar teknologi, startup, dan inovasi digital dalam format chat interaktif.",
//   path: "/berita",
// });

export default async function BeritaPage() {
  const feeds = await getLatestByCategory("Berita", 20);

  return (
    <FeedPage
      activePath="/berita"
      badge="📰 Berita"
      title="Update Teknologi Terkini"
      description="Berita terbaru seputar teknologi, startup, dan inovasi digital."
      category="Berita"
      initialFeeds={feeds}
    />
  );
}
