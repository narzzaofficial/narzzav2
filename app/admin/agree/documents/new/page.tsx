"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DocumentForm, type DocumentFormData } from "@/components/admin/agree/DocumentForm";
import { createAgreeDocument, fetchAgreeApps } from "@/lib/services/agree-admin-service";

type AppOption = {
  _id: string;
  name: string;
};

const emptyForm: DocumentFormData = {
  title: "",
  slug: "",
  appId: "",
  type: "terms-of-service",
  dek: "",
  tosOriginal: "",
  tosTranslation: "",
  analysis: {
    summary: [],
    agreedWithoutRealizing: [],
    surprisingPoints: [],
    dataCollected: [],
    platformRights: [],
    risks: [],
    tips: [],
  },
  content: [],
  isActive: true,
};

export default function NewAgreeDocumentPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [apps, setApps] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    fetchAgreeApps()
      .then((data) => {
        const items = ((data.items as AppOption[]) ?? []).map((item) => ({
          id: item._id,
          name: item.name,
        }));
        setApps(items);
      })
      .catch(() => setApps([]));
  }, []);

  async function handleSubmit(data: DocumentFormData) {
    await createAgreeDocument(data);
    setMessage("Document berhasil dibuat");
    setTimeout(() => router.push("/admin/agree/documents"), 800);
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Document Baru</h1>
          <Link href="/admin/agree/documents" className="btn-secondary">
            Kembali
          </Link>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <DocumentForm
          initialData={emptyForm}
          apps={apps}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/agree/documents")}
          submitButtonText="Simpan Document"
        />
      </div>
    </div>
  );
}
