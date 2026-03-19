"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SafeBackButton } from "@/components/frontend/SafeBackButton";
import { TopicForm, type TopicFormData } from "@/components/admin/agree/TopicForm";
import { fetchAgreeTopicById, updateAgreeTopic } from "@/lib/services/agree-admin-service";

type TopicItem = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  eyebrow?: string;
  icon?: string;
  isActive?: boolean;
};

export default function EditAgreeTopicPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<TopicFormData | null | undefined>(undefined);

  useEffect(() => {
    async function loadItem() {
      try {
        const item = (await fetchAgreeTopicById(String(params.id))) as TopicItem;
        setFormData({
          name: item.name,
          slug: item.slug,
          description: item.description ?? "",
          eyebrow: item.eyebrow ?? "Setelah Klik Agree",
          icon: item.icon ?? "cpu",
          isActive: item.isActive ?? true,
        });
      } catch (error) {
        console.error(error);
        setFormData(null);
      }
    }

    void loadItem();
  }, [params.id]);

  async function handleSubmit(data: TopicFormData) {
    await updateAgreeTopic(String(params.id), data);
    setMessage("Topic berhasil diupdate");
    setTimeout(() => router.push("/admin/agree/topics"), 800);
  }

  if (formData === undefined) return null;

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-slate-500 dark:text-slate-400">Topic tidak ditemukan</div>
          <SafeBackButton fallbackHref="/admin/agree/topics" className="btn-secondary">
            Kembali
          </SafeBackButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Edit Topic</h1>
          <SafeBackButton fallbackHref="/admin/agree/topics" className="btn-secondary">
            Kembali
          </SafeBackButton>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <TopicForm
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/agree/topics")}
          submitButtonText="Update Topic"
        />
      </div>
    </div>
  );
}
