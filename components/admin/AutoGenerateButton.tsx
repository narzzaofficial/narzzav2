"use client";

import { useState } from "react";
import type { PipelineResult } from "@/lib/pipeline/pipeline-runner";

export function AutoGenerateButton({ onSuccess }: { onSuccess?: () => void }) {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState<string>("");

  async function handleGenerate() {
    if (
      !confirm(
        "Jalankan auto-generate berita?\n\nProses ini akan:\n• Ambil berita dari RSS feed\n• Generate gambar dengan DALL-E 3 (~$0.04/gambar)\n• Simpan feed baru otomatis\n\nEstimasi waktu: 30–60 detik."
      )
    )
      return;

    setStatus("running");
    setResult("");

    try {
      const res = await fetch("/api/admin/auto-generate", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Pipeline gagal");

      const r = data.result as PipelineResult;
      setStatus("done");
      setResult(
        `Selesai: ${r.created} feed baru dibuat, ${r.skipped} dilewati (duplikat)${r.failed > 0 ? `, ${r.failed} gagal` : ""}.`
      );
      if (r.created > 0) onSuccess?.();
    } catch (err) {
      setStatus("error");
      setResult(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleGenerate}
        disabled={status === "running"}
        className="inline-flex items-center gap-2 rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-violet-700 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:bg-violet-900/40"
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
        <span
          className={`text-sm ${
            status === "error"
              ? "text-red-600 dark:text-red-400"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {result}
        </span>
      )}
    </div>
  );
}
