"use client";

import { useEffect, useState } from "react";

import { SelectInput, TextArea, TextInput } from "@/components/form";
import {
  linesToTextarea,
  listToTextarea,
  qaTextareaToLines,
  textareaToList,
} from "@/components/admin/agree/form-utils";
import { createAgreeDocumentSchema } from "@/lib/validation/agree";
import type { CreateAgreeDocumentInput } from "@/types/api";
import type { AgreeAnalysis, AgreeDocumentType } from "@/types/agree";

type AppOption = {
  id: string;
  name: string;
};

type DocumentFormState = {
  title: string;
  slug?: string;
  appId: string;
  type: AgreeDocumentType;
  dek: string;
  tosOriginal: string;
  tosTranslation?: string;
  summaryText: string;
  agreedWithoutRealizingText: string;
  surprisingPointsText: string;
  dataCollectedText: string;
  platformRightsText: string;
  risksText: string;
  tipsText: string;
  contentText: string;
  isActive?: boolean;
};

export type DocumentFormData = CreateAgreeDocumentInput;

type DocumentFormProps = {
  initialData: DocumentFormData;
  apps: AppOption[];
  onSubmit: (data: DocumentFormData) => Promise<void>;
  onCancel: () => void;
  submitButtonText: string;
};

function toFormState(data: DocumentFormData): DocumentFormState {
  return {
    title: data.title,
    slug: data.slug,
    appId: data.appId,
    type: data.type,
    dek: data.dek,
    tosOriginal: data.tosOriginal,
    tosTranslation: data.tosTranslation,
    summaryText: listToTextarea(data.analysis.summary),
    agreedWithoutRealizingText: listToTextarea(data.analysis.agreedWithoutRealizing),
    surprisingPointsText: listToTextarea(data.analysis.surprisingPoints),
    dataCollectedText: listToTextarea(data.analysis.dataCollected),
    platformRightsText: listToTextarea(data.analysis.platformRights),
    risksText: listToTextarea(data.analysis.risks),
    tipsText: listToTextarea(data.analysis.tips),
    contentText: linesToTextarea(data.content),
    isActive: data.isActive,
  };
}

function toAnalysis(form: DocumentFormState): AgreeAnalysis {
  return {
    summary: textareaToList(form.summaryText),
    agreedWithoutRealizing: textareaToList(form.agreedWithoutRealizingText),
    surprisingPoints: textareaToList(form.surprisingPointsText),
    dataCollected: textareaToList(form.dataCollectedText),
    platformRights: textareaToList(form.platformRightsText),
    risks: textareaToList(form.risksText),
    tips: textareaToList(form.tipsText),
  };
}

export function DocumentForm({
  initialData,
  apps,
  onSubmit,
  onCancel,
  submitButtonText,
}: DocumentFormProps) {
  const [form, setForm] = useState<DocumentFormState>(toFormState(initialData));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(toFormState(initialData));
  }, [initialData]);

  async function handleSubmit() {
    setError("");

    let content;
    try {
      content = qaTextareaToLines(form.contentText);
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : "Format Q&A tidak valid");
      return;
    }

    const payload: DocumentFormData = {
      title: form.title,
      slug: form.slug,
      appId: form.appId,
      type: form.type,
      dek: form.dek,
      tosOriginal: form.tosOriginal,
      tosTranslation: form.tosTranslation,
      analysis: toAnalysis(form),
      content,
      isActive: form.isActive ?? true,
    };

    const parsed = createAgreeDocumentSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Form tidak valid");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan document");
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
          label="Title"
          value={form.title}
          onChange={(value) => setForm((prev) => ({ ...prev, title: value }))}
          placeholder="Terms of Service"
          required
        />
        <TextInput
          label="Slug (optional)"
          value={form.slug ?? ""}
          onChange={(value) => setForm((prev) => ({ ...prev, slug: value }))}
          placeholder="terms-of-service"
        />
        <SelectInput
          label="App"
          value={form.appId}
          onChange={(value) => setForm((prev) => ({ ...prev, appId: value }))}
          options={apps.map((app) => ({ value: app.id, label: app.name }))}
          placeholder="Pilih app"
          required
        />
        <SelectInput
          label="Type"
          value={form.type}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, type: value as AgreeDocumentType }))
          }
          options={[
            { value: "terms-of-service", label: "Terms of Service" },
            { value: "privacy-policy", label: "Privacy Policy" },
            { value: "community-guidelines", label: "Community Guidelines" },
          ]}
          required
        />
        <div className="sm:col-span-2">
          <TextArea
            label="Dek"
            value={form.dek}
            onChange={(value) => setForm((prev) => ({ ...prev, dek: value }))}
            placeholder="Ringkasan pendek document"
            rows={3}
          />
        </div>
        <div className="sm:col-span-2">
          <TextArea
            label="Versi Original (Markdown allowed)"
            value={form.tosOriginal}
            onChange={(value) => setForm((prev) => ({ ...prev, tosOriginal: value }))}
            placeholder="## Terms of Service"
            rows={10}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <TextArea
            label="Versi Indonesia (optional, Markdown allowed)"
            value={form.tosTranslation ?? ""}
            onChange={(value) => setForm((prev) => ({ ...prev, tosTranslation: value }))}
            placeholder="## Terjemahan Ringkas"
            rows={10}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <TextArea label="Ringkasan Cepat" value={form.summaryText} onChange={(value) => setForm((prev) => ({ ...prev, summaryText: value }))} rows={5} placeholder="Satu poin per baris" />
        <TextArea label="Yang Kamu Setujui Tanpa Sadar" value={form.agreedWithoutRealizingText} onChange={(value) => setForm((prev) => ({ ...prev, agreedWithoutRealizingText: value }))} rows={5} placeholder="Satu poin per baris" />
        <TextArea label="Yang Bikin Kaget" value={form.surprisingPointsText} onChange={(value) => setForm((prev) => ({ ...prev, surprisingPointsText: value }))} rows={5} placeholder="Satu poin per baris" />
        <TextArea label="Data yang Mereka Ambil" value={form.dataCollectedText} onChange={(value) => setForm((prev) => ({ ...prev, dataCollectedText: value }))} rows={5} placeholder="Satu poin per baris" />
        <TextArea label="Hak Mereka atas Akunmu" value={form.platformRightsText} onChange={(value) => setForm((prev) => ({ ...prev, platformRightsText: value }))} rows={5} placeholder="Satu poin per baris" />
        <TextArea label="Kemungkinan Risiko / Dampak" value={form.risksText} onChange={(value) => setForm((prev) => ({ ...prev, risksText: value }))} rows={5} placeholder="Satu poin per baris" />
        <div className="sm:col-span-2">
          <TextArea label="Tips Buat User" value={form.tipsText} onChange={(value) => setForm((prev) => ({ ...prev, tipsText: value }))} rows={5} placeholder="Satu poin per baris" />
        </div>
      </div>

      <div className="mt-6">
        <TextArea
          label="Q&A Lines"
          value={form.contentText}
          onChange={(value) => setForm((prev) => ({ ...prev, contentText: value }))}
          rows={12}
          placeholder={"Q: Apa inti dokumen ini?\nA: Intinya ..."}
          required
        />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Tulis satu baris per item dengan format `Q: ...` atau `A: ...`.
        </p>
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
