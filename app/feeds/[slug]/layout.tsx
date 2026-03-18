import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { ReactNode } from "react";

import { RelativeTime } from "@/components/frontend/RelativeTime";
import { getFeedBySlug, getFeedsByCategory } from "@/lib/feeds";

type FeedDetailLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

type RecommendationItem = {
  slug: string;
  title: string;
  createdAt: number;
  category: "Berita" | "Tutorial" | "Riset";
  image: string;
};

function RecommendationColumn({
  title,
  items,
}: {
  title: string;
  items: RecommendationItem[];
}) {
  if (items.length === 0) return null;

  return (
    <aside className="sticky top-3 hidden w-72 shrink-0 self-start xl:block">
      <div className="rounded-3xl border border-slate-300/65 bg-white/88 p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
        <h2 className="mb-3 px-1 text-[15px] font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h2>

        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={`${title}-${item.slug}`}
              href={`/feeds/${item.slug}`}
              className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-slate-100/85 dark:hover:bg-slate-800/70"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="56px"
                />
              </div>

              <div className="min-w-0">
                <p className="break-words text-[13px] font-semibold leading-snug text-slate-800 dark:text-slate-100">
                  {item.title}
                </p>
                <p className="mt-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                  <RelativeTime timestamp={item.createdAt} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default async function FeedDetailLayout({
  children,
  params,
}: FeedDetailLayoutProps) {
  const { slug } = await params;
  const currentFeed = await getFeedBySlug(slug);

  if (!currentFeed) {
    notFound();
  }

  const related = await getFeedsByCategory(currentFeed.category, 1, 12);
  const recommendations = related.feeds
    .filter((item) => item.slug !== currentFeed.slug)
    .slice(0, 8)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      createdAt: item.createdAt,
      category: item.category,
      image: item.image,
    }));

  const leftItems = recommendations.slice(0, 4);
  const rightItems = recommendations.slice(4, 8);

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="relative flex items-start gap-3 xl:gap-5">
        <RecommendationColumn
          title="Rekomendasi"
          items={leftItems}
        />

        <main className="min-w-0 flex-1">{children}</main>

        <RecommendationColumn
          title="Baca Juga"
          items={rightItems}
        />
      </div>
    </div>
  );
}
