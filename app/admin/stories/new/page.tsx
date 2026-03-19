"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SafeBackButton } from "@/components/frontend/SafeBackButton";
import { StoryForm, StoryFormData } from "@/components/admin/StoryForm";
import { createStory } from "@/lib/services/story-service";

const emptyForm: StoryFormData = {
  name: "",
  label: "",
  type: "Berita",
  image: "",
  palette: "",
  viral: false,
};

export default function NewStoryPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleSubmit(data: StoryFormData) {
    try {
      await createStory(data);
      flash("Story berhasil dibuat");
      setTimeout(() => router.push("/admin/stories"), 1000);
    } catch (error) {
      console.error(error);
      flash("Gagal menyimpan story");
      throw new Error("Failed to save");
    }
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Story Baru</h1>
          <SafeBackButton fallbackHref="/admin/stories" className="btn-secondary">
            Kembali
          </SafeBackButton>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <StoryForm
          initialData={emptyForm}
          onSubmit={handleSubmit}
          submitButtonText="Simpan Story"
          onCancel={() => router.push("/admin/stories")}
        />
      </div>
    </div>
  );
}
