"use client";

import { Feed } from "@/types/content";
import { useState } from "react";
import { HomeCategory, CategoryTabs } from "./CategoryTabs";
import { FeedTitleCard } from "./FeedTitleCard";
import { TutorialCard } from "./TutorialCard";

type FeedPageProps = {
  activePath: "/" | "/berita" | "/tutorial" | "/riset";
  badge: string;
  title: string;
  description: string;
  category?: Feed["category"];
  initialFeeds: Feed[];
  // NOTE: Commented out untuk nanti
  // initialStories: Story[];
  // initialBooks: Book[];
  // initialRoadmaps: Roadmap[];
  // initialProducts: Product[];
};

export function FeedPage({
  activePath,
  badge,
  title,
  description,
  category,
  initialFeeds = [],
}: FeedPageProps) {
  const isHome = activePath === "/";

  // Default category: Semua untuk home, Berita untuk lainnya
  const [activeCategory, setActiveCategory] = useState<HomeCategory>(
    isHome ? "Semua" : "Berita"
  );

  // Filter feeds based on active category
  const getFilteredFeeds = (): Feed[] => {
    if (!isHome) {
      // Category page: filter by category prop
      return category
        ? initialFeeds.filter((f) => f.category === category)
        : initialFeeds;
    }

    // Home page: filter by active tab
    if (activeCategory === "Semua") {
      return initialFeeds;
    }

    if (activeCategory === "Buku") {
      return []; // NOTE: Nanti implement books
    }

    return initialFeeds.filter((f) => f.category === activeCategory);
  };

  const filteredFeeds = getFilteredFeeds();
  const isTutorialCategory =
    activeCategory === "Tutorial" || category === "Tutorial";

  return (
    <>
      {/* Page Header */}
      <section className="page-hero">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300 dark:text-cyan-300">
            {badge}
          </p>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">{title}</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>

        {/* NOTE: Status Viral Section - implement nanti */}
        {/* {isHome && showStories && initialStories.length > 0 && (
          <div className="hidden lg:block mt-4">
            <StatusViralSection stories={initialStories} feeds={initialFeeds} />
          </div>
        )} */}
      </section>

      {/* NOTE: Mobile Status + Global Search - implement nanti */}
      {/* {isHome && (
        <div className="mt-4 flex flex-col gap-4">
          <GlobalSearchForm />
        </div>
      )} */}

      {/* Category Tabs - Only on Home */}
      {isHome && (
        <CategoryTabs
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
      )}

      {/* Feed List */}
      <FeedList
        feeds={filteredFeeds}
        isTutorialLayout={isTutorialCategory}
        emptyMessage={
          activeCategory === "Buku"
            ? "Belum ada buku."
            : "Belum ada konten untuk kategori ini."
        }
      />
    </>
  );
}

// ─── Feed List Component ──────────────────────────────────────────
type FeedListProps = {
  feeds: Feed[];
  isTutorialLayout: boolean;
  emptyMessage: string;
};

function FeedList({ feeds, isTutorialLayout, emptyMessage }: FeedListProps) {
  if (feeds.length === 0) {
    return <div className="empty-state mt-4">{emptyMessage}</div>;
  }

  return (
    <section
      className={`mt-4 grid ${
        isTutorialLayout ? "gap-4" : "grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-4"
      }`}
    >
      {feeds.map((feed, index) =>
        isTutorialLayout ? (
          <TutorialCard key={feed.id} feed={feed} index={index} />
        ) : (
          <FeedTitleCard key={feed.id} feed={feed} index={index} />
        )
      )}
    </section>
  );
}
