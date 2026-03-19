"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SafeBackButton } from "@/components/frontend/SafeBackButton";
import { LawForm, LawFormData } from "@/components/admin/LawForm";
import { fetchLawById, updateLaw } from "@/lib/services/law-service";

export default function EditLawPage() {
  const router = useRouter();
  const params = useParams();
  const lawId = Number(params.id);
  const isValidLawId = Number.isFinite(lawId) && lawId > 0;

  const [formData, setFormData] = useState<LawFormData | null | undefined>(
    undefined
  );
  const [message, setMessage] = useState("");

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  useEffect(() => {
    if (!isValidLawId) return;

    async function loadLaw() {
      try {
        const law = await fetchLawById(lawId);
        setFormData({
          title: law.title,
          category: law.category,
          summary: law.summary,
          originalText: law.originalText,
          explanationLines: [...law.explanationLines],
          number: law.number,
          year: law.year,
          enactedAt: law.enactedAt,
          promulgatedAt: law.promulgatedAt,
          effectiveAt: law.effectiveAt,
          status: law.status,
          source: {
            institution: law.source.institution,
            originalUrl: law.source.originalUrl,
            pdfUrl: law.source.pdfUrl || "",
          },
          storyId: law.storyId ?? null,
        });
      } catch (error) {
        console.error(error);
        flash("Gagal memuat dokumen hukum");
        setFormData(null);
      }
    }

    loadLaw();
  }, [lawId, isValidLawId]);

  async function handleSubmit(data: LawFormData) {
    try {
      await updateLaw(lawId, data);
      flash("Dokumen hukum berhasil diupdate");
      setTimeout(() => router.push("/admin/laws"), 1000);
    } catch (error) {
      console.error(error);
      flash("Gagal menyimpan dokumen hukum");
      throw new Error("Failed to save");
    }
  }

  if (!isValidLawId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-slate-500 dark:text-slate-400">
            Dokumen hukum tidak ditemukan
          </div>
          <SafeBackButton
            fallbackHref="/admin/laws"
            showIcon={false}
            className="text-blue-600 hover:underline dark:text-cyan-400"
          >
            Kembali ke Daftar Hukum
          </SafeBackButton>
        </div>
      </div>
    );
  }

  if (formData === undefined) return null;

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-slate-500 dark:text-slate-400">
            Dokumen hukum tidak ditemukan
          </div>
          <SafeBackButton
            fallbackHref="/admin/laws"
            showIcon={false}
            className="text-blue-600 hover:underline dark:text-cyan-400"
          >
            Kembali ke Daftar Hukum
          </SafeBackButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Edit Dokumen #{lawId}</h1>
          <SafeBackButton fallbackHref="/admin/laws" className="btn-secondary">
            Kembali
          </SafeBackButton>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <LawForm
          initialData={formData}
          onSubmit={handleSubmit}
          submitButtonText="Update Dokumen"
          onCancel={() => router.push("/admin/laws")}
        />
      </div>
    </div>
  );
}
