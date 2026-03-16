"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import type { Feed } from "@/types/content";
import { FeedFormData, FeedForm } from "@/components/admin/FeedForm";

export default function EditFeedPage() {
  const router = useRouter();
  const params = useParams();
  const feedId = Number(params.id);

  const [formData, setFormData] = useState<FeedFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await fetch(`/api/feeds/${feedId}`);

        if (!res.ok) {
          throw new Error("Feed not found");
        }

        const feed: Feed = await res.json();

        setFormData({
          title: feed.title,
          category: feed.category,
          image: feed.image,
          takeaway: feed.takeaway,
          lines: [...feed.lines],
          source: feed.source ? { ...feed.source } : undefined,
          storyId: feed.storyId ?? null,
        });
      } catch (error) {
        console.error("Load feed error:", error);
        flash("❌ Gagal memuat data feed");
      } finally {
        setLoading(false);
      }
    }

    if (feedId) {
      loadFeed();
    }
  }, [feedId]);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleSubmit(data: FeedFormData) {
    try {
      const res = await fetch(`/api/feeds/${feedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");

      flash("✅ Feed berhasil diupdate");
      setTimeout(() => router.push("/admin/feeds"), 1000);
    } catch (error) {
      console.error("Submit error:", error);
      flash("❌ Gagal menyimpan feed");
      throw new Error("Failed to save");
    }
  }

  function handleCancel() {
    router.push("/admin/feeds");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-500 dark:text-slate-400">Memuat...</div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-slate-500 dark:text-slate-400">
            Feed tidak ditemukan
          </div>
          <Link
            href="/admin/feeds"
            className="text-blue-600 hover:underline dark:text-cyan-400"
          >
            ← Kembali ke Daftar Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Edit Feed #{feedId}</h1>
          <Link href="/admin/feeds" className="btn-secondary">
            ← Kembali
          </Link>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <FeedForm
          initialData={formData}
          onSubmit={handleSubmit}
          submitButtonText="Update Feed"
          onCancel={handleCancel}
          showJsonImport={false}
        />
      </div>
    </div>
  );
}
