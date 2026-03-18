"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { HUKUM_CATEGORIES } from "@/lib/law-categories";
import { deleteLaw, fetchLaws } from "@/lib/services/law-service";
import type { LawDoc } from "@/types/content";

export default function LawListPage() {
  const [items, setItems] = useState<LawDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [message, setMessage] = useState("");

  const loadLaws = useCallback(async () => {
    try {
      const collections = await Promise.all(
        HUKUM_CATEGORIES.map(async (category) => {
          const merged: LawDoc[] = [];
          let page = 1;
          let hasMore = true;

          while (hasMore) {
            const result = await fetchLaws({ category, page, limit: 100 });
            merged.push(...result.items);
            hasMore = result.pagination.hasMore;
            page += 1;
          }

          return { items: merged };
        })
      );
      const merged = collections.flatMap((collection) => collection.items);
      setItems(merged.sort((a, b) => b.id - a.id));
    } catch (error) {
      flash("Gagal memuat data hukum");
      console.error(error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Hapus dokumen "${title}"?`)) return;

    try {
      await deleteLaw(id);
      flash("Dokumen hukum berhasil dihapus");
      await loadLaws();
    } catch (error) {
      flash("Gagal menghapus dokumen hukum");
      console.error(error);
    }
  }

  const filtered = items.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    void loadLaws();
  }, [loadLaws]);

  if (loading) return null;

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Daftar Hukum Indonesia</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Kelola dokumen hukum dengan cache & ISR seperti feeds.
            </p>
          </div>
          <Link href="/admin/laws/new" className="btn-primary">
            + Tambah Dokumen
          </Link>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <div className="glass-panel mb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <label className="form-label">Cari Dokumen</label>
              <input
                className="form-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari judul dokumen..."
              />
            </div>

            <div>
              <label className="form-label">Kategori</label>
              <select
                className="form-input"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="all">Semua Kategori</option>
                {HUKUM_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="glass-panel overflow-hidden p-0">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Judul
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Nomor/Tahun
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-4 py-3 text-sm font-mono text-slate-600 dark:text-slate-400">
                      #{item.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-md">
                        <div className="truncate font-medium">{item.title}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          Status: {item.status}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {item.number}/{item.year}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/laws/${item.id}`}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700 md:hidden">
            {filtered.map((item) => (
              <div key={item.id} className="p-4">
                <div className="mb-2 text-xs text-slate-500">#{item.id}</div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {item.category} - {item.number}/{item.year}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/admin/laws/${item.id}`}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="flex-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
