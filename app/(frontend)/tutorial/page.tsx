import { FeedPage } from "@/components/frontend/FeedPage";
import { getLatestByCategory } from "@/lib/feeds";

export default async function TutorialPage() {
  const feeds = await getLatestByCategory("Tutorial", 20);

  return (
    <FeedPage
      activePath="/tutorial"
      badge="Tutorial"
      title="Panduan Praktis & Step-by-Step"
      description="Kumpulan tutorial ringkas untuk belajar dan langsung praktik."
      category="Tutorial"
      initialFeeds={feeds}
    />
  );
}
