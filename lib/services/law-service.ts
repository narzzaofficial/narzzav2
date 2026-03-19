import type { CreateLawInput } from "@/types/api";
import type { HukumCategory, LawDoc, PaginatedLawDocs } from "@/types/content";

export type LawFormInput = CreateLawInput;

export async function fetchLaws(params: {
  category?: HukumCategory;
  page?: number;
  limit?: number;
}): Promise<PaginatedLawDocs> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const res = await fetch(`/api/laws?${query}`);
  if (!res.ok) throw new Error("Failed to fetch laws");
  return res.json();
}

export async function fetchLawById(id: number): Promise<LawDoc> {
  const res = await fetch(`/api/laws/${id}`);
  if (!res.ok) throw new Error("Law document not found");
  return res.json();
}

export async function createLaw(data: LawFormInput): Promise<LawDoc> {
  const res = await fetch("/api/laws", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create law document");
  }
  return res.json();
}

export async function updateLaw(id: number, data: LawFormInput): Promise<LawDoc> {
  const res = await fetch(`/api/laws/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update law document");
  }
  return res.json();
}

export async function deleteLaw(id: number): Promise<void> {
  const res = await fetch(`/api/laws/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete law document");
  }
}
