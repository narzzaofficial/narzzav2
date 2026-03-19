"use client";

import type { ChatLine } from "@/types/content";

export function linesToTextarea(lines: ChatLine[] = []): string {
  return lines
    .map((line) => `${line.role.toUpperCase()}: ${line.text}`.trim())
    .join("\n");
}

export function textareaToList(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function listToTextarea(items: string[] = []): string {
  return items.join("\n");
}

export function qaTextareaToLines(value: string): ChatLine[] {
  const rows = value.split("\n").map((line) => line.trim());
  const lines: ChatLine[] = [];

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (!row) continue;

    const match = row.match(/^([qa])\s*:\s*(.+)$/i);
    if (!match) {
      throw new Error(`Format Q&A tidak valid pada baris ${index + 1}. Gunakan "Q: ..." atau "A: ...".`);
    }

    lines.push({
      role: match[1].toLowerCase() as "q" | "a",
      text: match[2].trim(),
    });
  }

  return lines;
}
