import { ReadDetail } from "@/components/reads/read-detail";
import { getAllFeeds, getFeedBySlug } from "@/lib/feeds";
import { getCommentsByFeedId } from "@/lib/comments";

export const dynamic = "force-static";

type FeedPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const feeds = await getAllFeeds();
  return feeds.filter((feed) => Boolean(feed.slug)).map((feed) => ({ slug: feed.slug }));
}

export default async function FeedDetailPage({ params }: FeedPageProps) {
  const { slug } = await params;
  const feed = await getFeedBySlug(slug);

  if (!feed) {
    return <div>Content not found</div>;
  }

  const comments = await getCommentsByFeedId(feed.id);

  return <ReadDetail feed={feed} comments={comments} />;
}
