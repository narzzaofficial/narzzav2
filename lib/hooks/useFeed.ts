// lib/hooks/use-feed.ts

"use client";

import { useState, useEffect } from "react";
import { fetchFeedById } from "@/lib/services/feed-service";
import type { Feed } from "@/types/content";

export function useFeed(id: number | null) {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const data = await fetchFeedById(id);
        setFeed(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load feed");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return { feed, loading, error };
}