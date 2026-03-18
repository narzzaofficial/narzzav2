"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { fetchFeeds, deleteFeed } from "@/lib/services/feed-service";
import type { Feed } from "@/types/content";

export default function FeedListPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [message, setMessage] = useState("");

  const loadFeeds = useCallback(async () => {
    try {
      const merged: Feed[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const data = await fetchFeeds({ page, limit: 100 });
        merged.push(...data.feeds);
        hasMore = data.pagination.hasMore;
        page += 1;
      }

      setFeeds(merged.sort((a, b) => b.id - a.id));
    } catch (error) {
      flash("❌ Gagal memuat data feeds");
      console.error(error);
      setFeeds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeeds();
  }, [loadFeeds]);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Hapus feed "${title}"?\n\nTindakan ini tidak bisa dibatalkan.`)) {
      return;
    }

    try {
      await deleteFeed(id);
      flash("✅ Feed berhasil dihapus");
      await loadFeeds();
    } catch (error) {
      flash("❌ Gagal menghapus feed");
      console.error(error);
    }
  }

  // Filter feeds berdasarkan search dan category
  const filteredFeeds = feeds.filter((feed) => {
    const matchesSearch = feed.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || feed.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  function getCategoryColor(category: string) {
    const colors = {
      Berita: "bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700",
      Tutorial: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
      Riset: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 dark:border-fuchsia-700",
    };
    return colors[category as keyof typeof colors] || "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
  }

  if (loading) {
    return (
      <div className="min-h-screen px-3 py-6 md:px-5">
        <div className="mx-auto max-w-7xl flex min-h-100 items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-lg font-medium">Memuat data...</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Mohon tunggu sebentar</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Daftar Feed</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Kelola semua konten berita, tutorial, dan riset
            </p>
          </div>
          <Link href="/admin/feeds/new" className="btn-primary">
            + Tambah Feed Baru
          </Link>
        </div>

        {/* Flash Message */}
        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        {/* Filters */}
        <div className="glass-panel mb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="form-label">Cari Feed</label>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan judul..."
                className="form-input"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="form-label">Kategori</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="form-input"
              >
                <option value="all">Semua Kategori</option>
                <option value="Berita">Berita</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Riset">Riset</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
            <div className="text-slate-600 dark:text-slate-400">
              Menampilkan <span className="font-semibold">{filteredFeeds.length}</span> dari{" "}
              <span className="font-semibold">{feeds.length}</span> feed
            </div>
          </div>
        </div>

        {/* Feed List */}
        {filteredFeeds.length === 0 ? (
          <div className="glass-panel text-center py-12">
            <div className="mb-4 text-5xl">📭</div>
            <h3 className="mb-2 text-lg font-semibold">
              {searchQuery || categoryFilter !== "all" ? "Tidak ada feed yang cocok" : "Belum ada feed"}
            </h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              {searchQuery || categoryFilter !== "all"
                ? "Coba ubah filter atau kata kunci pencarian"
                : "Mulai dengan menambahkan feed baru"}
            </p>
            {!searchQuery && categoryFilter === "all" && (
              <Link href="/admin/feeds/new" className="btn-primary">
                + Tambah Feed Pertama
              </Link>
            )}
          </div>
        ) : (
          <div className="glass-panel overflow-hidden p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Judul</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Kategori</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Lines</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Story</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredFeeds.map((feed) => (
                    <tr key={feed.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-sm font-mono text-slate-600 dark:text-slate-400">#{feed.id}</td>
                      <td className="px-4 py-3">
                        <div className="max-w-md">
                          <div className="truncate font-medium">{feed.title}</div>
                          {feed.source && (
                            <div className="mt-1 text-xs text-slate-500">Sumber: {feed.source.title}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getCategoryColor(feed.category)}`}>
                          {feed.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {feed.lineCount || feed.lines?.length || 0} baris
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {feed.storyId ? `Story #${feed.storyId}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/feeds/${feed.id}`}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(feed.id, feed.title)}
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

            {/* Mobile Cards - sama seperti sebelumnya */}
            <div className="divide-y divide-slate-200 dark:divide-slate-700 md:hidden">
              {filteredFeeds.map((feed) => (
                <div key={feed.id} className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">#{feed.id}</span>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getCategoryColor(feed.category)}`}>
                          {feed.category}
                        </span>
                      </div>
                      <h3 className="font-semibold leading-tight">{feed.title}</h3>
                      {feed.source && (
                        <p className="mt-1 text-xs text-slate-500">Sumber: {feed.source.title}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-3 flex gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <div>{feed.lineCount || feed.lines?.length || 0} baris</div>
                    {feed.storyId && <div>Story #{feed.storyId}</div>}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/feeds/${feed.id}`}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(feed.id, feed.title)}
                      className="flex-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

