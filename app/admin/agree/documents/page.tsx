"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  deleteAgreeDocument,
  fetchAgreeApps,
  fetchAgreeDocuments,
} from "@/lib/services/agree-admin-service";

type AppItem = {
  _id: string;
  name: string;
};

type DocumentItem = {
  _id: string;
  title: string;
  slug: string;
  appId: string;
  type: string;
  isActive?: boolean;
};

export default function AgreeDocumentsPage() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const loadItems = useCallback(async () => {
    try {
      const [appData, documentData] = await Promise.all([
        fetchAgreeApps(),
        fetchAgreeDocuments(),
      ]);
      setApps((appData.items as AppItem[]) ?? []);
      setItems((documentData.items as DocumentItem[]) ?? []);
    } catch (error) {
      console.error(error);
      setMessage("Gagal memuat document");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const appMap = useMemo(() => new Map(apps.map((app) => [app._id, app.name])), [apps]);

  async function handleDelete(item: DocumentItem) {
    if (!confirm(`Hapus document "${item.title}"?`)) return;

    try {
      await deleteAgreeDocument(item._id);
      setMessage("Document berhasil dihapus");
      await loadItems();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Gagal menghapus document");
    }
  }

  const filtered = items.filter((item) =>
    `${item.title} ${item.slug} ${item.type} ${appMap.get(item.appId) ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  if (loading) return null;

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Document Agree</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Kelola terms, privacy, dan guideline per app.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/agree" className="btn-secondary">
              Kembali
            </Link>
            <Link href="/admin/agree/documents/new" className="btn-primary">
              + Tambah Document
            </Link>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <div className="glass-panel mb-6">
          <label className="form-label">Cari Document</label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="form-input"
            placeholder="Cari berdasarkan judul, slug, type, atau app..."
          />
        </div>

        <div className="glass-panel overflow-hidden p-0">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Judul</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">App</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filtered.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{item.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {appMap.get(item.appId) ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">{item.type}</td>
                    <td className="px-4 py-3 text-sm">{item.isActive ? "Active" : "Inactive"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/agree/documents/${item._id}`} className="btn-secondary">
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
        </div>
      </div>
    </div>
  );
}
