// lib/hooks/use-feed-mutations.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFeed, updateFeed, deleteFeed } from "@/lib/services/feed-service";
import type { CreateFeedInput, UpdateFeedInput } from "@/types/api";

// ─── CREATE ───────────────────────────────────────────────────────────────────
export function useCreateFeed() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const create = async (data: CreateFeedInput) => {
    setLoading(true);
    setError(null);
    try {
      const newFeed = await createFeed(data);
      router.push("/admin/feeds");
      router.refresh();
      return newFeed;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create feed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export function useUpdateFeed() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const update = async (id: number, data: UpdateFeedInput) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateFeed(id, data);
      router.push("/admin/feeds");
      router.refresh();
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update feed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export function useDeleteFeed() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const remove = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteFeed(id);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete feed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}
