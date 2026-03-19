import type { Metadata } from "next";

import { ReadDetail } from "@/components/reads/read-detail";
import { getAllFeeds, getFeedBySlug } from "@/lib/feeds";
import { getCommentsByFeedId } from "@/lib/comments";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

type FeedPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const feeds = await getAllFeeds();
  return feeds.filter((feed) => Boolean(feed.slug)).map((feed) => ({ slug: feed.slug }));
}

export async function generateMetadata({
  params,
}: FeedPageProps): Promise<Metadata> {
  const { slug } = await params;
  const feed = await getFeedBySlug(slug);

  if (!feed) {
    return {
      title: "Konten Tidak Ditemukan",
      description: "Konten yang kamu cari tidak ditemukan.",
    };
  }

  return {
    title: feed.title,
    description: feed.takeaway || feed.title,
    alternates: {
      canonical: `/feeds/${feed.slug}`,
    },
    openGraph: {
      title: feed.title,
      description: feed.takeaway || feed.title,
      url: `/feeds/${feed.slug}`,
      type: "article",
      images: feed.image
        ? [
            {
              url: feed.image,
              alt: feed.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: feed.title,
      description: feed.takeaway || feed.title,
      images: feed.image ? [feed.image] : undefined,
    },
  };
}

export default async function FeedDetailPage({ params }: FeedPageProps) {
  const { slug } = await params;
  const feed = await getFeedBySlug(slug);

  if (!feed) {
    return <div>Content not found</div>;
  }

  const comments = await getCommentsByFeedId(feed.id);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: feed.title,
    description: feed.takeaway || feed.title,
    image: feed.image ? [feed.image] : undefined,
    datePublished: new Date(feed.createdAt).toISOString(),
    dateModified: new Date(feed.createdAt).toISOString(),
    author: {
      "@type": "Organization",
      name: feed.author || "Narzza Media Digital",
    },
    publisher: {
      "@type": "Organization",
      name: "Narzza Media Digital",
    },
    mainEntityOfPage: absoluteUrl(`/feeds/${feed.slug}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <ReadDetail feed={feed} comments={comments} />
    </>
  );
}
