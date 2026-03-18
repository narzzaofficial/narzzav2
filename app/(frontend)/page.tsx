import { FeedPage } from "@/components/frontend/FeedPage";
import {
  StatusViralSection,
  type StatusFeedItem,
  type StatusStory,
} from "@/components/status-bubble";
import { getLatestByCategory } from "@/lib/feeds";
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

  const paletteByCategory: Record<string, string> = {
    Berita: "from-sky-500 to-cyan-500",
    Tutorial: "from-emerald-500 to-teal-500",
    Riset: "from-indigo-500 to-violet-500",
  };

  const statusFeeds: StatusFeedItem[] = allFeeds
    .filter((feed) => feed.storyId !== null)
    .map((feed) => ({
      id: feed.id,
      slug: feed.slug,
      title: feed.title,
      image: feed.image,
      takeaway: feed.takeaway,
      category: feed.category,
      storyId: feed.storyId,
    }));

  const grouped = new Map<number, StatusFeedItem[]>();
  for (const feed of statusFeeds) {
    if (feed.storyId === null) continue;
    const list = grouped.get(feed.storyId) ?? [];
    list.push(feed);
    grouped.set(feed.storyId, list);
  }

  const stories: StatusStory[] = Array.from(grouped.entries())
    .map(([storyId, items], index) => {
      const top = items[0];
      return {
        id: storyId,
        name: `Story ${storyId}`,
        label: `S${storyId}`,
        type: top.category,
        palette:
          paletteByCategory[top.category] || "from-sky-500 to-cyan-500",
        image: top.image,
        viral: index < 3,
      };
    })
    .sort((a, b) => a.id - b.id);

  // Fallback sementara kalau belum ada feed yang di-assign storyId
  const fallbackFeeds: StatusFeedItem[] = allFeeds.slice(0, 6).map((feed) => ({
    id: feed.id,
    slug: feed.slug,
    title: feed.title,
    image: feed.image,
    takeaway: feed.takeaway,
    category: feed.category,
    storyId: feed.id,
  }));

  const fallbackStories: StatusStory[] = fallbackFeeds.map((feed, index) => {

    const baseName = feed.title.trim();
    const shortName =
      baseName.length > 16 ? `${baseName.slice(0, 16).trim()}...` : baseName;
    const label = baseName.slice(0, 2).toUpperCase();

    return {
      id: feed.storyId ?? feed.id,
      name: shortName,
      label: label || feed.category.slice(0, 2).toUpperCase(),
      type: feed.category,
      palette: paletteByCategory[feed.category] || "from-sky-500 to-cyan-500",
      image: feed.image,
      viral: index < 3,
    };
  });

  const displayStories = stories.length > 0 ? stories : fallbackStories;
  const displayFeeds = stories.length > 0 ? statusFeeds : fallbackFeeds;

  return (
    <>
      <section className="glass-panel -mx-2 rounded-xl p-2 sm:mx-0 sm:rounded-2xl sm:p-5">
        <StatusViralSection stories={displayStories} feeds={displayFeeds} standalone />
      </section>

      <div className="mt-6">
        <FeedPage
          activePath="/"
          showHeader={false}
          badge="Narzza Media Digital"
          title="Berita, tutorial, dan eksperimen dalam format chat"
          description="Baca topik panjang jadi lebih santai: pertanyaan singkat, jawaban padat, dan inti cepat per konten."
          initialFeeds={allFeeds}
        />
      </div>
    </>
  );
}
