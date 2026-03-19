"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SafeBackButton } from "@/components/frontend/SafeBackButton";
import { StoryForm, StoryFormData } from "@/components/admin/StoryForm";
import { fetchStoryById, updateStory } from "@/lib/services/story-service";

export default function EditStoryPage() {
  const router = useRouter();
  const params = useParams();
  const storyId = Number(params.id);
  const isValidStoryId = Number.isFinite(storyId) && storyId > 0;

  const [formData, setFormData] = useState<StoryFormData | null | undefined>(
    undefined
  );
  const [message, setMessage] = useState("");

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  useEffect(() => {
    if (!isValidStoryId) return;

    async function loadStory() {
      try {
        const story = await fetchStoryById(storyId);
        setFormData({
          name: story.name,
          label: story.label,
          type: story.type,
          image: story.image,
          palette: story.palette ?? "",
          viral: story.viral,
        });
      } catch (error) {
        console.error(error);
        flash("Gagal memuat story");
        setFormData(null);
      }
    }

    void loadStory();
  }, [isValidStoryId, storyId]);

  async function handleSubmit(data: StoryFormData) {
    try {
      await updateStory(storyId, data);
      flash("Story berhasil diupdate");
      setTimeout(() => router.push("/admin/stories"), 1000);
    } catch (error) {
      console.error(error);
      flash("Gagal menyimpan story");
      throw new Error("Failed to save");
    }
  }

  if (!isValidStoryId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-slate-500 dark:text-slate-400">
            Story tidak ditemukan
          </div>
          <SafeBackButton
            fallbackHref="/admin/stories"
            showIcon={false}
            className="text-blue-600 hover:underline dark:text-cyan-400"
          >
            Kembali ke Daftar Story
          </SafeBackButton>
        </div>
      </div>
    );
  }

  if (formData === undefined) return null;

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-slate-500 dark:text-slate-400">
            Story tidak ditemukan
          </div>
          <SafeBackButton
            fallbackHref="/admin/stories"
            showIcon={false}
            className="text-blue-600 hover:underline dark:text-cyan-400"
          >
            Kembali ke Daftar Story
          </SafeBackButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Edit Story #{storyId}</h1>
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
          initialData={formData}
          onSubmit={handleSubmit}
          submitButtonText="Update Story"
          onCancel={() => router.push("/admin/stories")}
        />
      </div>
    </div>
  );
}
