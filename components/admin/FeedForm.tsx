"use client";

import { useState, useEffect } from "react";
import type { ChatLine, Story } from "@/types/content";
import {
  TextInput,
  SelectInput,
  ImageInput,
  TextArea,
  SourceInput,
  ChatLinesSection,
} from "../form";

export type FeedFormData = {
  title: string;
  category: "Berita" | "Tutorial" | "Riset";
  image: string;
  takeaway: string;
  lines: ChatLine[];
  source?: { title: string; url: string };
  storyId?: number | null;
};

type StoriesResponse = {
  items: Story[];
};

type FeedFormProps = {
  initialData: FeedFormData;
  onSubmit: (data: FeedFormData) => Promise<void>;
  submitButtonText: string;
  onCancel: () => void;
  showJsonImport?: boolean;
};

export function FeedForm({
  initialData,
  onSubmit,
  submitButtonText,
  onCancel,
  showJsonImport = false,
}: FeedFormProps) {
  const [form, setForm] = useState<FeedFormData>(initialData);
  const [stories, setStories] = useState<Story[]>([]);
  const [jsonInput, setJsonInput] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data: StoriesResponse) => setStories(data.items ?? []))
      .catch(() => setStories([]));
  }, []);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  function handleImportJSON() {
    try {
      const json = JSON.parse(jsonInput);
      setForm({
        title: json.title || "",
        category: json.category || "Berita",
        image: json.image || "",
        takeaway: json.takeaway || "",
        lines: Array.isArray(json.lines)
          ? json.lines
          : [
              { role: "q", text: "" },
              { role: "a", text: "" },
            ],
        source: json.source
          ? { title: json.source.title || "", url: json.source.url || "" }
          : undefined,
        storyId: json.storyId ?? null,
      });
      setShowImport(false);
      setJsonInput("");
      flash("✅ JSON berhasil diimport ke form");
    } catch (err) {
      flash(
        "❌ Format JSON tidak valid: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  }

  function addLine() {
    setForm((p) => ({ ...p, lines: [...p.lines, { role: "q", text: "" }] }));
  }

  function removeLine(index: number) {
    setForm((p) => ({ ...p, lines: p.lines.filter((_, i) => i !== index) }));
  }

  function updateLineRole(index: number, role: "q" | "a") {
    setForm((p) => ({
      ...p,
      lines: p.lines.map((line, i) => (i === index ? { ...line, role } : line)),
    }));
  }

  function updateLineText(index: number, text: string) {
    setForm((p) => ({
      ...p,
      lines: p.lines.map((line, i) => (i === index ? { ...line, text } : line)),
    }));
  }

  function updateLineImage(index: number, image: string) {
    setForm((p) => ({
      ...p,
      lines: p.lines.map((line, i) =>
        i === index ? { ...line, image } : line
      ),
    }));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Prepare story options
  const storyOptions = stories.map((story) => ({
    value: story.id,
    label: `${story.name} (${story.type})`,
  }));

  return (
    <>
      {message && (
        <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2 text-sm text-blue-800 dark:bg-cyan-900/30 dark:border-cyan-500/40 dark:text-cyan-200">
          {message}
        </div>
      )}

      {/* Import JSON */}
      {showJsonImport && (
        <>
          <div className="mb-4">
            <button
              onClick={() => setShowImport(!showImport)}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-600/60"
            >
              {showImport ? "Tutup" : "Import dari JSON"}
            </button>
          </div>

          {showImport && (
            <div className="mb-4 rounded-xl border border-blue-300 bg-blue-50/50 p-5 dark:border-cyan-500/30 dark:bg-slate-900/90">
              <h3 className="mb-3 text-sm font-semibold text-blue-800 dark:text-cyan-200">
                Paste JSON Feed
              </h3>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"title": "...", "category": "Berita", "image": "...", "takeaway": "...", "source": {"title": "Kompas.com", "url": "https://..."}, "lines": [...]}'
                className="form-input mb-3 font-mono text-xs"
                rows={8}
              />
              <div className="flex gap-2">
                <button onClick={handleImportJSON} className="btn-primary">
                  Import ke Form
                </button>
                <button
                  onClick={() => {
                    setShowImport(false);
                    setJsonInput("");
                  }}
                  className="btn-secondary"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Form */}
      <div className="glass-panel">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <TextInput
              label="Title"
              value={form.title}
              onChange={(value) => setForm((p) => ({ ...p, title: value }))}
              placeholder="Title"
              required
            />
          </div>

          {/* Category */}
          <div className="sm:col-span-2">
            <SelectInput
              label="Category"
              value={form.category}
              onChange={(value) =>
                setForm((p) => ({
                  ...p, 
                  category: value as FeedFormData["category"],
                }))
              }
              options={[
                { value: "Berita", label: "Berita" },
                { value: "Tutorial", label: "Tutorial" },
                { value: "Riset", label: "Riset" },
              ]}
              required
            />
          </div>

          {/* Story Assignment */}
          <div className="sm:col-span-2">
            <SelectInput
              label="Assign ke Story (opsional)"
              value={form.storyId ?? ""}
              onChange={(value) =>
                setForm((p) => ({
                  ...p,
                  storyId: value === "" ? null : Number(value),
                }))
              }
              options={storyOptions}
              placeholder="— Tidak di-assign —"
            />
          </div>

          {/* Cover Image */}
          <div className="sm:col-span-2">
            <ImageInput
              label="Cover Image"
              value={form.image}
              onChange={(value) => setForm((p) => ({ ...p, image: value }))}
              required
            />
          </div>

          {/* Takeaway */}
          <div className="sm:col-span-2">
            <TextArea
              label="Takeaway"
              value={form.takeaway}
              onChange={(value) => setForm((p) => ({ ...p, takeaway: value }))}
              placeholder="Takeaway"
              required
            />
          </div>

          {/* Source */}
          <div className="sm:col-span-2">
            <SourceInput
              titleValue={form.source?.title || ""}
              urlValue={form.source?.url || ""}
              onTitleChange={(value) =>
                setForm((p) => ({
                  ...p,
                  source: {
                    title: value,
                    url: p.source?.url || "",
                  },
                }))
              }
              onUrlChange={(value) =>
                setForm((p) => ({
                  ...p,
                  source: {
                    title: p.source?.title || "",
                    url: value,
                  },
                }))
              }
            />
          </div>
        </div>

        {/* Chat Lines */}
        <ChatLinesSection
          lines={form.lines}
          onAdd={addLine}
          onRemove={removeLine}
          onUpdateRole={updateLineRole}
          onUpdateText={updateLineText}
          onUpdateImage={updateLineImage}
        />

        {/* Action Buttons */}
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
    </>
  );
}
