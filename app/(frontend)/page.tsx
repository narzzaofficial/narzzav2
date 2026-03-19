import { FeedPage } from "@/components/frontend/FeedPage";
import {
  StatusViralSection,
  type StatusFeedItem,
  type StatusStory,
} from "@/components/status-bubble";
import { getLatestByCategory } from "@/lib/feeds";
import { getAllLaws } from "@/lib/laws";
import { getAllStories } from "@/lib/stories";

export default async function HomePage() {
  const [berita, tutorial, riset, laws, storyRecords] = await Promise.all([
    getLatestByCategory("Berita", 10),
    getLatestByCategory("Tutorial", 10),
    getLatestByCategory("Riset", 10),
    getAllLaws(),
    getAllStories(),
  ]);

  const allFeeds = [...berita, ...tutorial, ...riset].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  const paletteByCategory: Record<string, string> = {
    Berita: "from-sky-500 to-cyan-500",
    Tutorial: "from-emerald-500 to-teal-500",
    Riset: "from-indigo-500 to-violet-500",
  };

  const feedStatusItems: StatusFeedItem[] = allFeeds
    .filter((feed) => feed.storyId !== null)
    .map((feed) => ({
      id: feed.id,
      slug: feed.slug,
      title: feed.title,
      image: feed.image,
      takeaway: feed.takeaway,
      category: feed.category,
      storyId: feed.storyId,
      href: `/feeds/${feed.slug}`,
      ctaLabel: "Baca Artikel",
      sourceType: "feed",
    }));

  const lawStatusItems: StatusFeedItem[] = laws
    .filter((law) => law.storyId !== null)
    .map((law) => ({
      id: law.id,
      slug: law.slug,
      title: law.title,
      image: "",
      takeaway: law.summary || `${law.number}/${law.year}`,
      category: `Hukum Indonesia - ${law.category}`,
      storyId: law.storyId,
      href: `/hukum/${law.slug}`,
      ctaLabel: "Buka Dokumen",
      sourceType: "law",
    }));

  const statusItems = [...feedStatusItems, ...lawStatusItems].sort(
    (a, b) => b.id - a.id
  );

  const grouped = new Map<number, StatusFeedItem[]>();
  for (const item of statusItems) {
    if (item.storyId === null) continue;
    const list = grouped.get(item.storyId) ?? [];
    list.push(item);
    grouped.set(item.storyId, list);
  }

  const stories: StatusStory[] = storyRecords
    .filter((story) => grouped.has(story.id))
    .map((story) => ({
      id: story.id,
      name: story.name,
      label: story.label,
      type: story.type,
      palette:
        story.palette ||
        paletteByCategory[story.type] ||
        "from-sky-500 to-cyan-500",
      image: story.image,
      viral: story.viral,
    }))
    .sort((a, b) => a.id - b.id);

  const fallbackFeeds: StatusFeedItem[] = allFeeds.slice(0, 6).map((feed) => ({
    id: feed.id,
    slug: feed.slug,
    title: feed.title,
    image: feed.image,
    takeaway: feed.takeaway,
    category: feed.category,
    storyId: feed.id,
    href: `/feeds/${feed.slug}`,
    ctaLabel: "Baca Artikel",
    sourceType: "feed",
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
  const displayFeeds = stories.length > 0 ? statusItems : fallbackFeeds;

  return (
    <>
      <section className="glass-panel -mx-2 rounded-xl p-2 sm:mx-0 sm:rounded-2xl sm:p-5">
        <StatusViralSection
          stories={displayStories}
          feeds={displayFeeds}
          standalone
        />
      </section>

      <div className="mt-6">
        <FeedPage
          activePath="/"
          showHeader={false}
          badge=""
          title=""
          description=""
          initialFeeds={allFeeds}
        />
      </div>
    </>
  );
}
