"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LawForm, LawFormData } from "@/components/admin/LawForm";
import { createLaw } from "@/lib/services/law-service";

const now = Date.now();

const emptyForm: LawFormData = {
  title: "",
  category: "Pidana",
  summary: "",
  originalText: "",
  explanationLines: [
    { role: "q", text: "" },
    { role: "a", text: "" },
  ],
  number: "",
  year: new Date().getUTCFullYear(),
  enactedAt: now,
  promulgatedAt: now,
  effectiveAt: now,
  status: "Berlaku",
  source: {
    institution: "",
    originalUrl: "",
    pdfUrl: "",
  },
  storyId: null,
};

export default function NewLawPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleSubmit(data: LawFormData) {
    try {
      await createLaw(data);
      flash("Dokumen hukum berhasil dibuat");
      setTimeout(() => router.push("/admin/laws"), 1000);
    } catch (error) {
      flash("Gagal menyimpan dokumen hukum");
      console.error(error);
      throw new Error("Failed to save");
    }
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Dokumen Hukum Baru</h1>
          <Link href="/admin/laws" className="btn-secondary">
            Kembali
          </Link>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <LawForm
          initialData={emptyForm}
          onSubmit={handleSubmit}
          submitButtonText="Simpan Dokumen"
          onCancel={() => router.push("/admin/laws")}
        />
      </div>
    </div>
  );
}
