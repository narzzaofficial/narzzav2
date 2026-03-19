"use client";

import { useEffect, useState } from "react";

import { ImageUpload } from "@/components/admin/ImageUpload";
import { SelectInput, TextArea, TextInput } from "@/components/form";
import { createAgreeCompanySchema } from "@/lib/validation/agree";
import type { CreateAgreeCompanyInput } from "@/types/api";

type TopicOption = {
  id: string;
  name: string;
};

export type CompanyFormData = CreateAgreeCompanyInput;

type CompanyFormProps = {
  initialData: CompanyFormData;
  topics: TopicOption[];
  onSubmit: (data: CompanyFormData) => Promise<void>;
  onCancel: () => void;
  submitButtonText: string;
};

export function CompanyForm({
  initialData,
  topics,
  onSubmit,
  onCancel,
  submitButtonText,
}: CompanyFormProps) {
  const [form, setForm] = useState<CompanyFormData>(initialData);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  async function handleSubmit() {
    setError("");
    const parsed = createAgreeCompanySchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Form tidak valid");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan company");
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
          placeholder="Meta"
          required
        />
        <TextInput
          label="Slug (optional)"
          value={form.slug ?? ""}
          onChange={(value) => setForm((prev) => ({ ...prev, slug: value }))}
          placeholder="meta"
        />
        <SelectInput
          label="Topic"
          value={form.topicId}
          onChange={(value) => setForm((prev) => ({ ...prev, topicId: value }))}
          options={topics.map((topic) => ({ value: topic.id, label: topic.name }))}
          placeholder="Pilih topic"
          required
        />
        <div className="sm:col-span-2">
          <ImageUpload
            currentImageUrl={form.logo}
            onUploadComplete={(url) => setForm((prev) => ({ ...prev, logo: url }))}
            label="Logo Company"
            buttonText="Upload Gambar"
          />
          <div className="mt-3">
            <TextInput
              label="Atau URL Manual"
              value={form.logo}
              onChange={(value) => setForm((prev) => ({ ...prev, logo: value }))}
              placeholder="https://..."
              type="url"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <TextArea
            label="Description"
            value={form.description}
            onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
            placeholder="Deskripsi company"
            rows={4}
          />
        </div>
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
