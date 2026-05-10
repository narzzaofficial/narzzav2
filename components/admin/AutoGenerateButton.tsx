"use client";

import { useState } from "react";
import { Lock, Unlock, AlertTriangle, X } from "lucide-react";
import type { PipelineResult } from "@/lib/pipeline/pipeline-runner";

function ConfirmModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-xl bg-amber-100 p-2.5 dark:bg-amber-900/30">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Jalankan Auto-Generate?
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Proses ini tidak bisa dibatalkan setelah dimulai.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700/40 dark:bg-amber-900/10">
          <ul className="space-y-1.5 text-sm text-amber-800 dark:text-amber-300">
            <li className="flex items-center gap-2">
              <span className="text-amber-500">•</span> Ambil artikel dari semua sumber RSS aktif
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-500">•</span> Generate gambar dengan DALL-E 3 <span className="font-semibold">(~$0.04/gambar)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-500">•</span> Simpan feed baru otomatis ke database
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-500">•</span> Estimasi waktu: <span className="font-semibold">30–60 detik</span>
            </li>
          </ul>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="btn-secondary">
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            Ya, Jalankan
          </button>
        </div>
      </div>
    </div>
  );
}

export function AutoGenerateButton({ onSuccess }: { onSuccess?: () => void }) {
  const [locked, setLocked] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState("");

  async function runPipeline() {
    setShowConfirm(false);
    setLocked(true);
    setStatus("running");
    setResult("");

    try {
      const res = await fetch("/api/admin/auto-generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Pipeline gagal");

      const r = data.result as PipelineResult;
      setStatus("done");
      setResult(
        `Selesai: ${r.created} feed baru, ${r.skipped} dilewati${r.failed > 0 ? `, ${r.failed} gagal` : ""}.`
      );
      if (r.created > 0) onSuccess?.();
    } catch (err) {
      setStatus("error");
      setResult(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  }

  return (
    <>
      {showConfirm && (
        <ConfirmModal onConfirm={runPipeline} onCancel={() => setShowConfirm(false)} />
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* Lock toggle */}
        <button
          onClick={() => setLocked((p) => !p)}
          disabled={status === "running"}
          title={locked ? "Klik untuk membuka kunci" : "Kunci tombol"}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50 ${
            locked
              ? "border-slate-300 bg-slate-100 text-slate-500 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              : "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
          }`}
        >
          {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          {locked ? "Terkunci" : "Terbuka"}
        </button>

        {/* Generate button */}
        <button
          onClick={() => !locked && setShowConfirm(true)}
          disabled={locked || status === "running"}
          title={locked ? "Buka kunci dulu sebelum menggunakan" : "Jalankan pipeline"}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            locked
              ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-600"
              : status === "running"
              ? "cursor-not-allowed border-violet-300 bg-violet-50 text-violet-400 opacity-70 dark:border-violet-700 dark:bg-violet-900/20"
              : "border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:bg-violet-900/40"
          }`}
        >
          {status === "running" ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
              Sedang berjalan...
            </>
          ) : (
            <>✨ Generate Otomatis</>
          )}
        </button>

        {result && (
          <span className={`text-sm ${status === "error" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
            {result}
          </span>
        )}
      </div>
    </>
  );
}
