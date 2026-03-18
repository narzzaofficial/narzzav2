import type { HukumCategory } from "@/types/content";

export const HUKUM_CATEGORIES: HukumCategory[] = [
  "Pidana",
  "Perdata",
  "Ketenagakerjaan",
  "Bisnis",
  "Pajak",
  "Pertanahan",
  "Keluarga",
  "Konsumen",
  "Siber",
  "LaluLintas",
];

export function isHukumCategory(value: string): value is HukumCategory {
  return HUKUM_CATEGORIES.includes(value as HukumCategory);
}

