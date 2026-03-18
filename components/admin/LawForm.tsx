"use client";

import { useState } from "react";

import { HUKUM_CATEGORIES } from "@/lib/law-categories";
import type { LawDoc } from "@/types/content";

export type LawFormData = {
  title: string;
  category: LawDoc["category"];
  summary: string;
  originalText: string;
  explanationLines: LawDoc["explanationLines"];
  number: string;
  year: number;
  enactedAt: number;
  promulgatedAt: number;
  effectiveAt?: number;
  status: LawDoc["status"];
  source: {
    institution: string;
    originalUrl: string;
    pdfUrl?: string;
  };
};

type LawFormProps = {
  initialData: LawFormData;
  onSubmit: (data: LawFormData) => Promise<void>;
  submitButtonText: string;
  onCancel: () => void;
};

function toDateInputValue(timestamp?: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateInputValue(value: string): number | undefined {
  if (!value) return undefined;
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  if (Number.isNaN(timestamp)) return undefined;
  return timestamp;
}

export function LawForm({
  initialData,
  onSubmit,
  submitButtonText,
  onCancel,
}: LawFormProps) {
  const [form, setForm] = useState<LawFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateLine = (
    index: number,
    patch: Partial<LawFormData["explanationLines"][number]>
  ) => {
    setForm((prev) => ({
      ...prev,
      explanationLines: prev.explanationLines.map((line, lineIndex) =>
        lineIndex === index ? { ...line, ...patch } : line
      ),
    }));
  };

  const removeLine = (index: number) => {
    setForm((prev) => ({
      ...prev,
      explanationLines: prev.explanationLines.filter((_, i) => i !== index),
    }));
  };

  const addLine = () => {
    setForm((prev) => ({
      ...prev,
      explanationLines: [...prev.explanationLines, { role: "q", text: "" }],
    }));
  };

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="glass-panel">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="form-label">Judul Dokumen</label>
          <input
            className="form-input"
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="Judul resmi dokumen hukum"
          />
        </div>

        <div>
          <label className="form-label">Kategori</label>
          <select
            className="form-input"
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                category: event.target.value as LawDoc["category"],
              }))
            }
          >
            {HUKUM_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Status</label>
          <select
            className="form-input"
            value={form.status}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                status: event.target.value as LawDoc["status"],
              }))
            }
          >
            <option value="Berlaku">Berlaku</option>
            <option value="Diubah">Diubah</option>
            <option value="Dicabut">Dicabut</option>
          </select>
        </div>

        <div>
          <label className="form-label">Nomor</label>
          <input
            className="form-input"
            value={form.number}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, number: event.target.value }))
            }
            placeholder="Contoh: UU 11"
          />
        </div>

        <div>
          <label className="form-label">Tahun</label>
          <input
            className="form-input"
            type="number"
            value={form.year}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, year: Number(event.target.value) }))
            }
          />
        </div>

        <div>
          <label className="form-label">Tanggal Penetapan</label>
          <input
            className="form-input"
            type="date"
            value={toDateInputValue(form.enactedAt)}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                enactedAt: fromDateInputValue(event.target.value) ?? Date.now(),
              }))
            }
          />
        </div>

        <div>
          <label className="form-label">Tanggal Pengundangan</label>
          <input
            className="form-input"
            type="date"
            value={toDateInputValue(form.promulgatedAt)}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                promulgatedAt:
                  fromDateInputValue(event.target.value) ?? Date.now(),
              }))
            }
          />
        </div>

        <div>
          <label className="form-label">Mulai Berlaku (opsional)</label>
          <input
            className="form-input"
            type="date"
            value={toDateInputValue(form.effectiveAt)}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                effectiveAt: fromDateInputValue(event.target.value),
              }))
            }
          />
        </div>

        <div>
          <label className="form-label">Instansi</label>
          <input
            className="form-input"
            value={form.source.institution}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                source: { ...prev.source, institution: event.target.value },
              }))
            }
            placeholder="JDIH / Setneg / dst"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="form-label">URL Naskah Original</label>
          <input
            className="form-input"
            value={form.source.originalUrl}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                source: { ...prev.source, originalUrl: event.target.value },
              }))
            }
            placeholder="https://..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="form-label">URL PDF (opsional)</label>
          <input
            className="form-input"
            value={form.source.pdfUrl ?? ""}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                source: { ...prev.source, pdfUrl: event.target.value },
              }))
            }
            placeholder="https://..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="form-label">Ringkasan</label>
          <textarea
            className="form-input min-h-24"
            value={form.summary}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, summary: event.target.value }))
            }
            placeholder="Ringkasan dokumen hukum"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="form-label">Naskah Original</label>
          <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
            Mendukung Markdown dasar. Gunakan format link: [Nama Sumber](https://...)
          </p>
          <textarea
            className="form-input min-h-40 font-mono"
            value={form.originalText}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, originalText: event.target.value }))
            }
            placeholder="Contoh: ## Pasal 1 atau [Naskah PDF](https://...)"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Explanation Q&A
          </h3>
          <button type="button" className="btn-secondary" onClick={addLine}>
            + Tambah Baris
          </button>
        </div>

        <div className="space-y-3">
          {form.explanationLines.map((line, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-300/70 bg-slate-50/60 p-3 dark:border-slate-700/60 dark:bg-slate-800/40"
            >
              <div className="grid gap-2 sm:grid-cols-[140px,1fr,auto]">
                <select
                  className="form-input"
                  value={line.role}
                  onChange={(event) =>
                    updateLine(index, {
                      role: event.target.value as "q" | "a",
                    })
                  }
                >
                  <option value="q">Q</option>
                  <option value="a">A</option>
                </select>

                <input
                  className="form-input"
                  value={line.text}
                  onChange={(event) =>
                    updateLine(index, { text: event.target.value })
                  }
                  placeholder="Tulis isi baris..."
                />

                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => removeLine(index)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
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
