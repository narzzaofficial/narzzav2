"use client";

import { useState } from "react";

import { ImageInput, SelectInput, TextInput } from "../form";

export type StoryFormData = {
  name: string;
  label: string;
  type: string;
  image: string;
  palette: string;
  viral: boolean;
};

type StoryFormProps = {
  initialData: StoryFormData;
  onSubmit: (data: StoryFormData) => Promise<void>;
  submitButtonText: string;
  onCancel: () => void;
};

const storyTypeOptions = [
  { value: "Berita", label: "Berita" },
  { value: "Tutorial", label: "Tutorial" },
  { value: "Riset", label: "Riset" },
  { value: "Hukum Indonesia", label: "Hukum Indonesia" },
  { value: "Campuran", label: "Campuran" },
];

const paletteOptions = [
  { value: "", label: "Default" },
  { value: "from-sky-500 to-cyan-500", label: "Langit" },
  { value: "from-emerald-500 to-teal-500", label: "Emerald" },
  { value: "from-indigo-500 to-violet-500", label: "Indigo" },
  { value: "from-amber-500 to-orange-500", label: "Amber" },
];

export function StoryForm({
  initialData,
  onSubmit,
  submitButtonText,
  onCancel,
}: StoryFormProps) {
  const [form, setForm] = useState<StoryFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        label: form.label.trim() || form.name.trim().slice(0, 2).toUpperCase(),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="glass-panel">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextInput
            label="Nama Story"
            value={form.name}
            onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
            placeholder="Contoh: Pilkada memanas"
            required
          />
        </div>

        <div>
          <TextInput
            label="Label Singkat"
            value={form.label}
            onChange={(value) => setForm((prev) => ({ ...prev, label: value }))}
            placeholder="Contoh: PK"
          />
        </div>

        <div>
          <SelectInput
            label="Tipe Story"
            value={form.type}
            onChange={(value) => setForm((prev) => ({ ...prev, type: value }))}
            options={storyTypeOptions}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <ImageInput
            label="Cover Image"
            value={form.image}
            onChange={(value) => setForm((prev) => ({ ...prev, image: value }))}
          />
        </div>

        <div>
          <SelectInput
            label="Palette"
            value={form.palette}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, palette: value }))
            }
            options={paletteOptions}
          />
        </div>

        <div>
          <label className="form-label">Tandai Viral</label>
          <label className="flex items-center gap-3 rounded-xl border border-slate-300/70 bg-white/70 px-4 py-3 text-sm dark:border-slate-700/70 dark:bg-slate-900/40">
            <input
              type="checkbox"
              checked={form.viral}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, viral: event.target.checked }))
              }
            />
            Story ini masuk highlight viral
          </label>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? "Menyimpan..." : submitButtonText}
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Batal
        </button>
      </div>
    </div>
  );
}
