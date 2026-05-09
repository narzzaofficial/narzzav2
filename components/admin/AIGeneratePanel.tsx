"use client";

import { useState } from "react";
import type { ChatLine } from "@/types/content";

type GenerateResult = {
  title?: string;
  lines: ChatLine[];
  takeaway: string;
  sourceUrl?: string;
  sourceTitle?: string;
};

type AIGeneratePanelProps = {
  onResult: (result: GenerateResult) => void;
  onFlash: (msg: string) => void;
};

type GenerateMode = "url" | "text" | "topic";
type Level = "pemula" | "menengah" | "lanjutan";

export function AIGeneratePanel({ onResult, onFlash }: AIGeneratePanelProps) {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<GenerateMode>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<Level>("pemula");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageCopied, setImageCopied] = useState(false);

  async function handleGenerate() {
    if (mode === "topic" && !topic.trim()) return onFlash("❌ Ketik topik tutorial dulu");
    if (mode === "url" && !url.trim()) return onFlash("❌ Masukkan URL artikel");
    if (mode === "text" && !text.trim()) return onFlash("❌ Paste teks artikel dulu");

    setIsGenerating(true);
    setImagePrompt("");
    try {
      const res = await fetch("/api/admin/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: mode === "url" ? url.trim() : undefined,
          text: mode === "text" ? text.trim() : undefined,
          topic: mode === "topic" ? topic.trim() : undefined,
          level: mode === "topic" ? level : undefined,
          title: title.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generate gagal");

      setImagePrompt(data.imagePrompt || "");
      onResult({
        title: data.title,
        lines: data.lines,
        takeaway: data.takeaway,
        sourceUrl: data.sourceUrl,
        sourceTitle: data.sourceTitle,
      });
      onFlash("✅ Konten berhasil digenerate — cek form di bawah!");
    } catch (err) {
      onFlash("❌ " + (err instanceof Error ? err.message : "Generate gagal"));
    } finally {
      setIsGenerating(false);
    }
  }

  function copyImagePrompt() {
    navigator.clipboard.writeText(imagePrompt).then(() => {
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    });
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => setShow(!show)}
        className="inline-flex items-center gap-2 rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:bg-violet-900/40"
      >
        ✨ {show ? "Tutup Generate AI" : "Generate Konten dengan AI"}
      </button>

      {show && (
        <div className="mt-2 rounded-xl border border-violet-300 bg-violet-50/50 p-5 space-y-4 dark:border-violet-700/50 dark:bg-violet-900/10">
          <h3 className="text-sm font-semibold text-violet-800 dark:text-violet-300">
            ✨ Generate Konten + Prompt Gambar
          </h3>

          <div className="flex flex-wrap gap-2">
            {(["url", "text", "topic"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === m
                    ? "bg-violet-600 text-white"
                    : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
                }`}
              >
                {m === "url" && "Dari URL"}
                {m === "text" && "Paste Teks"}
                {m === "topic" && "✨ Topik AI (Tutorial)"}
              </button>
            ))}
          </div>

          {mode === "url" && (
            <div>
              <label className="form-label">URL Artikel</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://antaranews.com/berita/..."
                className="form-input"
              />
            </div>
          )}

          {mode === "text" && (
            <div>
              <label className="form-label">Teks Artikel (copy-paste dari website)</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste isi artikel di sini..."
                className="form-input font-mono text-xs"
                rows={6}
              />
            </div>
          )}

          {mode === "topic" && (
            <div className="space-y-3">
              <div className="rounded-lg border border-violet-200 bg-violet-50/50 px-3 py-2 text-xs text-violet-700 dark:border-violet-700/40 dark:bg-violet-900/10 dark:text-violet-300">
                AI akan menulis tutorial lengkap dari pengetahuannya sendiri berdasarkan topik yang kamu berikan.
              </div>
              <div>
                <label className="form-label">Topik Tutorial</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="cth: cara membuat CV yang menarik, belajar Python untuk pemula..."
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as Level)}
                  className="form-input"
                >
                  <option value="pemula">Pemula — dari nol, tidak perlu background</option>
                  <option value="menengah">Menengah — sudah paham dasarnya</option>
                  <option value="lanjutan">Lanjutan — tips dan teknik expert</option>
                </select>
              </div>
            </div>
          )}

          {mode !== "topic" && (
            <div>
              <label className="form-label">Judul (opsional — kosongkan untuk auto-detect)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul artikel..."
                className="form-input"
              />
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 btn-primary disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sedang generate...
              </>
            ) : (
              "Generate Sekarang"
            )}
          </button>

          {imagePrompt && (
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-700/50 dark:bg-emerald-900/10">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Prompt Gambar — copy &amp; paste ke DALL-E / Midjourney
                </span>
                <button
                  onClick={copyImagePrompt}
                  className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  {imageCopied ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed dark:text-emerald-300">
                {imagePrompt}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
