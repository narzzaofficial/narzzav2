"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { SafeBackButton } from "@/components/frontend/SafeBackButton";
import { RelativeTime } from "@/components/frontend/RelativeTime";
import type { HukumCategory, LawDoc } from "@/types/content";

type HukumCategoryBrowserProps = {
  category: HukumCategory;
  items: LawDoc[];
  truncated: boolean;
};

const PAGE_SIZE = 10;

function formatLawNumber(number: string, year: number) {
  const text = number.trim();
  const match = text.match(/^(.+?)\s+(\d+[A-Za-z-]*)$/);
  if (!match) return `No. ${text} Tahun ${year}`;
  const code = match[1].trim();
  const serial = match[2].trim();
  return `${code} No. ${serial} Tahun ${year}`;
}

export function HukumCategoryBrowser({
  category,
  items,
  truncated,
}: HukumCategoryBrowserProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter((item) => {
      const haystack = [
        item.title,
        item.summary,
        item.number,
        String(item.year),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleItems = filteredItems.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <SafeBackButton
          fallbackHref="/hukum-indonesia"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-300/70 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-600/70 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-slate-500"
        >
          Kembali
        </SafeBackButton>

        <label className="relative block w-full flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder={`Cari di kategori ${category}...`}
            className="w-full rounded-lg border border-slate-300/70 bg-white/90 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 dark:border-slate-600/70 dark:bg-slate-800/70 dark:text-slate-100 dark:focus:border-cyan-400"
          />
        </label>
      </div>

      {truncated ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Menampilkan 300 dokumen terbaru agar tetap ringan.
        </p>
      ) : null}

      <div className="space-y-3">
        {visibleItems.length === 0 ? (
          <div className="rounded-xl border border-slate-300/70 bg-white/85 p-4 text-sm text-slate-600 dark:border-slate-700/60 dark:bg-slate-900/65 dark:text-slate-300">
            Tidak ada dokumen yang cocok dengan kata kunci.
          </div>
        ) : (
          visibleItems.map((item) => (
            <Link
              key={item.id}
              href={`/hukum/${item.slug}`}
              className="block rounded-xl border border-slate-300/70 bg-white/85 p-4 transition hover:border-sky-400 dark:border-slate-700/60 dark:bg-slate-900/65 dark:hover:border-cyan-400/60"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {formatLawNumber(item.number, item.year)}
                </span>{" "}
                -{" "}
                <RelativeTime timestamp={item.promulgatedAt} />
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                {item.summary}
              </p>
            </Link>
          ))
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setPage((value) => Math.max(1, Math.min(totalPages, value - 1)))
          }
          disabled={currentPage <= 1}
          className={`btn-secondary ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
        >
          Sebelumnya
        </button>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Halaman {currentPage} dari {totalPages}
        </p>
        <button
          type="button"
          onClick={() =>
            setPage((value) => Math.max(1, Math.min(totalPages, value + 1)))
          }
          disabled={currentPage >= totalPages}
          className={`btn-secondary ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
        >
          Berikutnya
        </button>
      </div>
    </>
  );
}
