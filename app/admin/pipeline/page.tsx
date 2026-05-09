"use client";

import { useState, useEffect } from "react";
import type { IPipelineConfig, IRSSSource } from "@/lib/models/PipelineConfig";
import { AutoGenerateButton } from "@/components/admin/AutoGenerateButton";

const TEXT_MODELS = ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"];
const IMAGE_MODELS = ["dall-e-3", "dall-e-2"];

export default function PipelineAdminPage() {
  const [config, setConfig] = useState<IPipelineConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/pipeline-config")
      .then((r) => r.json())
      .then((data) => setConfig(data))
      .catch(() => flash("❌ Gagal memuat konfigurasi"))
      .finally(() => setLoading(false));
  }, []);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  }

  async function handleSave() {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/pipeline-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      flash("✅ Konfigurasi berhasil disimpan");
    } catch {
      flash("❌ Gagal menyimpan konfigurasi");
    } finally {
      setSaving(false);
    }
  }

  function updateSource(index: number, field: keyof IRSSSource, value: string | boolean) {
    if (!config) return;
    const sources = [...config.sources];
    sources[index] = { ...sources[index], [field]: value };
    setConfig({ ...config, sources });
  }

  function addSource() {
    if (!config) return;
    setConfig({
      ...config,
      sources: [...config.sources, { name: "", url: "", enabled: true }],
    });
  }

  function removeSource(index: number) {
    if (!config) return;
    setConfig({
      ...config,
      sources: config.sources.filter((_, i) => i !== index),
    });
  }

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6">
        <div className="mx-auto max-w-6xl flex min-h-64 items-center justify-center">
          <div className="text-center text-slate-500">Memuat konfigurasi...</div>
        </div>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Konfigurasi model AI dan sumber RSS
          </p>
          <AutoGenerateButton />
        </div>

        {/* Flash */}
        {message && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        {/* Model Config */}
        <div className="glass-panel space-y-4">
          <h2 className="text-base font-semibold">Model AI</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Model Teks (LangChain + OpenAI)</label>
              <select
                value={config.textModel}
                onChange={(e) => setConfig({ ...config, textModel: e.target.value })}
                className="form-input"
              >
                {TEXT_MODELS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                gpt-4o-mini paling hemat. gpt-4o lebih akurat untuk terjemahan.
              </p>
            </div>
            <div>
              <label className="form-label">Model Gambar (OpenAI)</label>
              <select
                value={config.imageModel}
                onChange={(e) => setConfig({ ...config, imageModel: e.target.value })}
                className="form-input"
              >
                {IMAGE_MODELS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                DALL-E 3: ~$0.04/gambar. DALL-E 2: ~$0.02/gambar.
              </p>
            </div>
          </div>
          <div>
            <label className="form-label">Artikel per Run</label>
            <input
              type="number"
              min={1}
              max={20}
              value={config.articlesPerRun}
              onChange={(e) => setConfig({ ...config, articlesPerRun: Number(e.target.value) })}
              className="form-input w-32"
            />
            <p className="mt-1 text-xs text-slate-500">
              Maksimal artikel yang diproses per satu kali pipeline berjalan.
            </p>
          </div>
        </div>

        {/* RSS Sources */}
        <div className="glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Sumber RSS</h2>
            <button onClick={addSource} className="text-sm text-violet-600 hover:underline dark:text-violet-400">
              + Tambah Sumber
            </button>
          </div>

          <div className="space-y-3">
            {config.sources.map((source, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <input
                  type="checkbox"
                  checked={source.enabled}
                  onChange={(e) => updateSource(i, "enabled", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-violet-600"
                />
                <div className="flex-1 grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    value={source.name}
                    onChange={(e) => updateSource(i, "name", e.target.value)}
                    placeholder="Nama sumber"
                    className="form-input text-sm"
                  />
                  <input
                    type="url"
                    value={source.url}
                    onChange={(e) => updateSource(i, "url", e.target.value)}
                    placeholder="https://..."
                    className="form-input text-sm"
                  />
                </div>
                <button
                  onClick={() => removeSource(i)}
                  className="mt-1 text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400"
                  title="Hapus sumber"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Centang untuk mengaktifkan sumber. Artikel dari semua sumber aktif akan diproses setiap kali pipeline berjalan.
          </p>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Konfigurasi"}
          </button>
        </div>
      </div>
    </div>
  );
}
