"use client";

import { Feed } from "@/types/content";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HomeCategory, CategoryTabs } from "./CategoryTabs";
import { FeedTitleCard } from "./FeedTitleCard";
import { TutorialCard } from "./TutorialCard";

type FeedPageProps = {
  activePath: "/" | "/berita" | "/tutorial" | "/riset";
  badge: string;
  title: string;
  description: string;
  showHeader?: boolean;
  category?: Feed["category"];
  initialFeeds: Feed[];
  initialQuery?: string;
};

export function FeedPage({
  activePath,
  badge,
  title,
  description,
  showHeader = true,
  category,
  initialFeeds = [],
  initialQuery = "",
}: FeedPageProps) {
  const router = useRouter();
  const isHome = activePath === "/";
  const shouldShowHeader = showHeader && !isHome;
  const [searchValue, setSearchValue] = useState(initialQuery);

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

    if (activeCategory === "Hukum Indonesia") {
      return [];
    }

    return initialFeeds.filter((f) => f.category === activeCategory);
  };

  const filteredFeeds = getFilteredFeeds();
  const isTutorialCategory =
    activeCategory === "Tutorial" || category === "Tutorial";

  return (
    <>
      {/* Page Header */}
      {shouldShowHeader && (
        <section className="glass-panel mb-6 p-6">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-[0.24em] text-sky-400 dark:text-sky-300">
              {badge}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
        </section>
      )}

      {/* Search - Only on Category Pages */}
      {!isHome && (
        <form
          className="glass-panel mb-6 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            const next = searchValue.trim();
            const params = new URLSearchParams();
            if (next) params.set("q", next);
            const url = params.size ? `${activePath}?${params}` : activePath;
            router.replace(url);
          }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="search"
              value={searchValue}
              onChange={(event) => {
                const next = event.target.value;
                setSearchValue(next);

                // Auto-reset when query is cleared (avoids extra clicks, only 1 navigation).
                if (initialQuery && next.trim() === "") {
                  router.replace(activePath);
                }
              }}
              placeholder={`Cari ${category ?? "konten"}...`}
              className="form-input flex-1"
            />
            <button type="submit" className="btn-primary sm:self-stretch">
              Cari
            </button>
          </div>
        </form>
      )}

      {/* Category Tabs - Only on Home */}
      {isHome && (
        <CategoryTabs
          activeCategory={activeCategory}
          onChange={(nextCategory) => {
            if (nextCategory === "Hukum Indonesia") {
              router.push("/hukum-indonesia");
              return;
            }

            setActiveCategory(nextCategory);
          }}
        />
      )}

      {/* Feed List */}
      <FeedList
        feeds={filteredFeeds}
        isTutorialLayout={isTutorialCategory}
        emptyMessage={
          activeCategory === "Hukum Indonesia"
            ? "Mengarahkan ke Hukum Indonesia..."
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
        isTutorialLayout
          ? "grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
          : "grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-4"
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
