"use client";

import { useEffect, useState } from "react";

import { ImageUpload } from "@/components/admin/ImageUpload";
import { SelectInput, TextArea, TextInput } from "@/components/form";
import { createAgreeAppSchema } from "@/lib/validation/agree";
import type { CreateAgreeAppInput } from "@/types/api";

type CompanyOption = {
  id: string;
  name: string;
};

export type AppFormData = CreateAgreeAppInput;

type AppFormProps = {
  initialData: AppFormData;
  companies: CompanyOption[];
  onSubmit: (data: AppFormData) => Promise<void>;
  onCancel: () => void;
  submitButtonText: string;
};

export function AppForm({
  initialData,
  companies,
  onSubmit,
  onCancel,
  submitButtonText,
}: AppFormProps) {
  const [form, setForm] = useState<AppFormData>(initialData);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  async function handleSubmit() {
    setError("");
    const parsed = createAgreeAppSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Form tidak valid");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan app");
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
          placeholder="Instagram"
          required
        />
        <TextInput
          label="Slug (optional)"
          value={form.slug ?? ""}
          onChange={(value) => setForm((prev) => ({ ...prev, slug: value }))}
          placeholder="instagram"
        />
        <SelectInput
          label="Company"
          value={form.companyId}
          onChange={(value) => setForm((prev) => ({ ...prev, companyId: value }))}
          options={companies.map((company) => ({ value: company.id, label: company.name }))}
          placeholder="Pilih company"
          required
        />
        <TextInput
          label="Popular Score"
          value={String(form.popularScore ?? 0)}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              popularScore: Number(value || 0),
            }))
          }
          placeholder="0"
        />
        <div className="sm:col-span-2">
          <ImageUpload
            currentImageUrl={form.icon}
            onUploadComplete={(url) => setForm((prev) => ({ ...prev, icon: url }))}
            label="App Icon"
            buttonText="Upload Icon"
          />
          <div className="mt-3">
            <TextInput
              label="Atau URL Manual"
              value={form.icon}
              onChange={(value) => setForm((prev) => ({ ...prev, icon: value }))}
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
            placeholder="Deskripsi app"
            rows={4}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={form.isPopular ?? false}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, isPopular: event.target.checked }))
            }
          />
          Aplikasi populer
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={form.isActive ?? true}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, isActive: event.target.checked }))
            }
          />
          Active
        </label>
      </div>

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
