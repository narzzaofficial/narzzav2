"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FeedFormData, FeedForm } from "@/components/admin/FeedForm";
import { createFeed } from "@/lib/services/feed-service";

const emptyForm: FeedFormData = {
  title: "",
  category: "Berita",
  image: "",
  takeaway: "",
  lines: [
    { role: "q", text: "" },
    { role: "a", text: "" },
  ],
  storyId: null,
};

export default function NewFeedPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleSubmit(formData: FeedFormData) {
    try {
      await createFeed(formData);

      flash("Feed berhasil dibuat");
      setTimeout(() => router.push("/admin/feeds"), 1000);
    } catch {
      flash("Gagal menyimpan feed");
      throw new Error("Failed to save");
    }
  }

  function handleCancel() {
    router.push("/admin/feeds");
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Feed Baru</h1>
          <Link href="/admin/feeds" className="btn-secondary">
            Kembali
          </Link>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <FeedForm
          initialData={emptyForm}
          onSubmit={handleSubmit}
          submitButtonText="Simpan"
          onCancel={handleCancel}
          showJsonImport={true}
        />
      </div>
    </div>
  );
}
