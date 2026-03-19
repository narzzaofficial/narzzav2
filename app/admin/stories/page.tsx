"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { deleteStory, fetchStories } from "@/lib/services/story-service";
import type { Story } from "@/types/content";

export default function StoryListPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");

  const loadStories = useCallback(async () => {
    try {
      const merged: Story[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const data = await fetchStories({ page, limit: 100 });
        merged.push(...data.items);
        hasMore = data.pagination.hasMore;
        page += 1;
      }

      setStories(merged);
    } catch (error) {
      console.error(error);
      flash("Gagal memuat story");
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStories();
  }, [loadStories]);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Hapus story "${name}"?`)) return;

    try {
      await deleteStory(id);
      flash("Story berhasil dihapus");
      await loadStories();
    } catch (error) {
      console.error(error);
      flash("Gagal menghapus story");
    }
  }

  const filtered = stories.filter((story) => {
    const keyword = searchQuery.toLowerCase();
    return (
      story.name.toLowerCase().includes(keyword) ||
      story.type.toLowerCase().includes(keyword) ||
      story.label.toLowerCase().includes(keyword)
    );
  });

  if (loading) return null;

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Daftar Story</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Kelola status viral yang bisa dipakai di feeds dan hukum indonesia.
            </p>
          </div>
          <Link href="/admin/stories/new" className="btn-primary">
            + Tambah Story
          </Link>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <div className="glass-panel mb-6">
          <label className="form-label">Cari Story</label>
          <input
            className="form-input"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Cari berdasarkan nama, label, atau tipe..."
          />
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
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Tipe
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Label
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Viral
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filtered.map((story) => (
                  <tr
                    key={story.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-4 py-3 text-sm font-mono text-slate-600 dark:text-slate-400">
                      #{story.id}
                    </td>
                    <td className="px-4 py-3 font-medium">{story.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {story.type}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {story.label}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {story.viral ? "Ya" : "Tidak"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/stories/${story.id}`}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(story.id, story.name)}
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
            {filtered.map((story) => (
              <div key={story.id} className="p-4">
                <div className="mb-2 text-xs text-slate-500">#{story.id}</div>
                <h3 className="font-semibold">{story.name}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {story.type} • {story.label} • {story.viral ? "Viral" : "Normal"}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/admin/stories/${story.id}`}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(story.id, story.name)}
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
