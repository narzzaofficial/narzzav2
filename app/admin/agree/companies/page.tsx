"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { SafeBackButton } from "@/components/frontend/SafeBackButton";
import {
  deleteAgreeCompany,
  fetchAgreeCompanies,
  fetchAgreeTopics,
} from "@/lib/services/agree-admin-service";

type TopicItem = {
  _id: string;
  name: string;
};

type CompanyItem = {
  _id: string;
  name: string;
  slug: string;
  topicId: string;
  description?: string;
  isActive?: boolean;
};

export default function AgreeCompaniesPage() {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [items, setItems] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const loadItems = useCallback(async () => {
    try {
      const [topicData, companyData] = await Promise.all([
        fetchAgreeTopics(),
        fetchAgreeCompanies(),
      ]);
      setTopics((topicData.items as TopicItem[]) ?? []);
      setItems((companyData.items as CompanyItem[]) ?? []);
    } catch (error) {
      console.error(error);
      setMessage("Gagal memuat company");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const topicMap = useMemo(
    () => new Map(topics.map((topic) => [topic._id, topic.name])),
    [topics]
  );

  async function handleDelete(item: CompanyItem) {
    if (!confirm(`Hapus company "${item.name}"?`)) return;

    try {
      await deleteAgreeCompany(item._id);
      setMessage("Company berhasil dihapus");
      await loadItems();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Gagal menghapus company");
    }
  }

  const filtered = items.filter((item) =>
    `${item.name} ${item.slug} ${topicMap.get(item.topicId) ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  if (loading) return null;

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Company Agree</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Kelola company yang terhubung ke topic.
            </p>
          </div>
          <div className="flex gap-2">
            <SafeBackButton fallbackHref="/admin/agree" className="btn-secondary">
              Kembali
            </SafeBackButton>
            <Link href="/admin/agree/companies/new" className="btn-primary">
              + Tambah Company
            </Link>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <div className="glass-panel mb-6">
          <label className="form-label">Cari Company</label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="form-input"
            placeholder="Cari berdasarkan nama, slug, atau topic..."
          />
        </div>

        <div className="glass-panel overflow-hidden p-0">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Topic</th>
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
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {topicMap.get(item.topicId) ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{item.slug}</td>
                    <td className="px-4 py-3 text-sm">{item.isActive ? "Active" : "Inactive"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/agree/companies/${item._id}`} className="btn-secondary">
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
