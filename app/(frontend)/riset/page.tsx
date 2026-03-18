import { FeedPage } from "@/components/frontend/FeedPage";
import { getLatestByCategory } from "@/lib/feeds";

export default async function RisetPage() {
  const feeds = await getLatestByCategory("Riset", 20);

  return (
    <FeedPage
      activePath="/riset"
      badge="Riset"
      title="Riset, Eksperimen, dan Temuan"
      description="Dokumentasi eksperimen, insight teknis, dan temuan dari proses riset."
      category="Riset"
      initialFeeds={feeds}
    />
  );
}
