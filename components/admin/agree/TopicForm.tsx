"use client";

import { useEffect, useState } from "react";

import { TextArea, TextInput } from "@/components/form";
import { createAgreeTopicSchema } from "@/lib/validation/agree";
import type { CreateAgreeTopicInput } from "@/types/api";

export type TopicFormData = CreateAgreeTopicInput;

type TopicFormProps = {
  initialData: TopicFormData;
  onSubmit: (data: TopicFormData) => Promise<void>;
  onCancel: () => void;
  submitButtonText: string;
};

export function TopicForm({
  initialData,
  onSubmit,
  onCancel,
  submitButtonText,
}: TopicFormProps) {
  const [form, setForm] = useState<TopicFormData>(initialData);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  async function handleSubmit() {
    setError("");
    const parsed = createAgreeTopicSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Form tidak valid");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan topic");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="glass-panel">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Name"
          value={form.name}
          onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
          placeholder="Technology"
          required
        />
        <TextInput
          label="Slug (optional)"
          value={form.slug ?? ""}
          onChange={(value) => setForm((prev) => ({ ...prev, slug: value }))}
          placeholder="technology"
        />
        <div className="sm:col-span-2">
          <TextArea
            label="Description"
            value={form.description}
            onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
            placeholder="Deskripsi topik"
            rows={3}
          />
        </div>
        <TextInput
          label="Eyebrow"
          value={form.eyebrow ?? ""}
          onChange={(value) => setForm((prev) => ({ ...prev, eyebrow: value }))}
          placeholder="Setelah Klik Agree"
        />
        <TextInput
          label="Icon"
          value={form.icon ?? ""}
          onChange={(value) => setForm((prev) => ({ ...prev, icon: value }))}
          placeholder="cpu"
        />
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          checked={form.isActive ?? true}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, isActive: event.target.checked }))
          }
        />
        Active
      </label>

      <div className="mt-6 flex gap-2">
        <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Menyimpan..." : submitButtonText}
        </button>
        <button onClick={onCancel} type="button" className="btn-secondary">
          Batal
        </button>
      </div>
    </div>
  );
}
