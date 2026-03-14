// lib/hooks/use-infinite-feeds.ts

"use client";

import { useState } from "react";
import { fetchFeeds } from "@/lib/services/feed-service";
import type { Feed, Category } from "@/types/content";

export function useInfiniteFeeds(category: Category, initialFeeds: Feed[]) {
  const [feeds, setFeeds] = useState(initialFeeds);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await fetchFeeds({ category, page: page + 1, limit: 20 });
      setFeeds((prev) => [...prev, ...data.feeds]);
      setPage(data.pagination.page);
      setHasMore(data.pagination.hasMore);
    } catch (error) {
      console.error("Failed to load more feeds:", error);
    } finally {
      setLoading(false);
    }
  };

  return { feeds, loading, hasMore, loadMore };
}