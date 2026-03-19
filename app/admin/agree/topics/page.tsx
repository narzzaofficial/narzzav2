"use client";

import Link from "next/link";
import { SafeBackButton } from "@/components/frontend/SafeBackButton";
import { useCallback, useEffect, useState } from "react";

import { deleteAgreeTopic, fetchAgreeTopics } from "@/lib/services/agree-admin-service";

type TopicListItem = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
};

export default function AgreeTopicsPage() {
  const [items, setItems] = useState<TopicListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const loadItems = useCallback(async () => {
    try {
      const data = await fetchAgreeTopics();
      setItems((data.items as TopicListItem[]) ?? []);
    } catch (error) {
      console.error(error);
      setMessage("Gagal memuat topic");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function handleDelete(item: TopicListItem) {
    if (!confirm(`Hapus topic "${item.name}"?`)) return;

    try {
      await deleteAgreeTopic(item._id);
      setMessage("Topic berhasil dihapus");
      await loadItems();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Gagal menghapus topic");
    }
  }

  const filtered = items.filter((item) =>
    `${item.name} ${item.slug}`.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return null;

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Topic Agree</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Kelola kategori utama untuk Setelah Klik Agree.
            </p>
          </div>
          <div className="flex gap-2">
            <SafeBackButton fallbackHref="/admin/agree" className="btn-secondary">
              Kembali
            </SafeBackButton>
            <Link href="/admin/agree/topics/new" className="btn-primary">
              + Tambah Topic
            </Link>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <div className="glass-panel mb-6">
          <label className="form-label">Cari Topic</label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="form-input"
            placeholder="Cari berdasarkan nama atau slug..."
          />
        </div>

        <div className="glass-panel overflow-hidden p-0">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filtered.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="mt-1 text-xs text-slate-500">{item.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{item.slug}</td>
                    <td className="px-4 py-3 text-sm">{item.isActive ? "Active" : "Inactive"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/agree/topics/${item._id}`} className="btn-secondary">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item)}
                          className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
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
              <div key={item._id} className="p-4">
                <div className="font-semibold">{item.name}</div>
                <div className="mt-1 text-xs text-slate-500">{item.slug}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {item.isActive ? "Active" : "Inactive"}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href={`/admin/agree/topics/${item._id}`} className="btn-secondary flex-1 text-center">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
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
