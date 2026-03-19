"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SafeBackButton } from "@/components/frontend/SafeBackButton";
import { TopicForm, type TopicFormData } from "@/components/admin/agree/TopicForm";
import { createAgreeTopic } from "@/lib/services/agree-admin-service";

const emptyForm: TopicFormData = {
  name: "",
  slug: "",
  description: "",
  eyebrow: "Setelah Klik Agree",
  icon: "cpu",
  isActive: true,
};

export default function NewAgreeTopicPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function handleSubmit(data: TopicFormData) {
    await createAgreeTopic(data);
    setMessage("Topic berhasil dibuat");
    setTimeout(() => router.push("/admin/agree/topics"), 800);
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Topic Baru</h1>
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
          initialData={emptyForm}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/agree/topics")}
          submitButtonText="Simpan Topic"
        />
      </div>
    </div>
  );
}
