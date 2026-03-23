// lib/services/feed-service.ts

import { CreateFeedInput, UpdateFeedInput } from "@/types/api";
import type {
  Feed,
  PaginatedFeeds,
  Category,
} from "@/types/content";

// ─── FETCH FEEDS (dengan pagination) ─────────────────────────────────────────
export async function fetchFeeds(params: {
  category?: Category;
  page?: number;
  limit?: number;
  fresh?: boolean;
}): Promise<PaginatedFeeds> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.fresh) query.set("fresh", "1");

  const res = await fetch(`/api/feeds?${query}`, {
    cache: params.fresh ? "no-store" : "default",
  });
  if (!res.ok) throw new Error("Failed to fetch feeds");
  return res.json();
}

// ─── FETCH FEED BY ID ─────────────────────────────────────────────────────────
export async function fetchFeedById(id: number): Promise<Feed> {
  const res = await fetch(`/api/feeds/${id}`);
  if (!res.ok) throw new Error("Feed not found");
  return res.json();
}

// ─── CREATE FEED ──────────────────────────────────────────────────────────────
export async function createFeed(data: CreateFeedInput): Promise<Feed> {
  const res = await fetch("/api/feeds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create feed");
  }
  return res.json();
}

// ─── UPDATE FEED ──────────────────────────────────────────────────────────────
export async function updateFeed(
  id: number,
  data: UpdateFeedInput
): Promise<Feed> {
  const res = await fetch(`/api/feeds/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update feed");
  }
  return res.json();
}

// ─── DELETE FEED ──────────────────────────────────────────────────────────────
export async function deleteFeed(id: number): Promise<void> {
  const res = await fetch(`/api/feeds/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete feed");
  }
}
