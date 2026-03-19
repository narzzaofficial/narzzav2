import type { CreateStoryInput, UpdateStoryInput } from "@/types/api";
import type { Story } from "@/types/content";

export type PaginatedStories = {
  items: Story[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export async function fetchStories(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedStories> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const url = query.size ? `/api/stories?${query}` : "/api/stories";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch stories");
  return res.json();
}

export async function fetchStoryById(id: number): Promise<Story> {
  const res = await fetch(`/api/stories/${id}`);
  if (!res.ok) throw new Error("Story not found");
  return res.json();
}

export async function createStory(data: CreateStoryInput): Promise<Story> {
  const res = await fetch("/api/stories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create story");
  }
  return res.json();
}

export async function updateStory(
  id: number,
  data: UpdateStoryInput
): Promise<Story> {
  const res = await fetch(`/api/stories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update story");
  }
  return res.json();
}

export async function deleteStory(id: number): Promise<void> {
  const res = await fetch(`/api/stories/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete story");
  }
}
