"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DocumentForm, type DocumentFormData } from "@/components/admin/agree/DocumentForm";
import {
  fetchAgreeApps,
  fetchAgreeDocumentById,
  updateAgreeDocument,
} from "@/lib/services/agree-admin-service";

type AppOption = {
  _id: string;
  name: string;
};

type DocumentItem = {
  title: string;
  slug: string;
  appId: string;
  type: "terms-of-service" | "privacy-policy" | "community-guidelines";
  dek?: string;
  tosOriginal?: string;
  tosTranslation?: string;
  analysis?: DocumentFormData["analysis"];
  content?: DocumentFormData["content"];
  isActive?: boolean;
};

export default function EditAgreeDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [apps, setApps] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState<DocumentFormData | null | undefined>(undefined);

  useEffect(() => {
    async function loadData() {
      try {
        const [appData, item] = await Promise.all([
          fetchAgreeApps(),
          fetchAgreeDocumentById(String(params.id)),
        ]);
        setApps(
          ((appData.items as AppOption[]) ?? []).map((app) => ({
            id: app._id,
            name: app.name,
          }))
        );
        const document = item as DocumentItem;
        setFormData({
          title: document.title,
          slug: document.slug,
          appId: document.appId,
          type: document.type,
          dek: document.dek ?? "",
          tosOriginal: document.tosOriginal ?? "",
          tosTranslation: document.tosTranslation ?? "",
          analysis: document.analysis ?? {
            summary: [],
            agreedWithoutRealizing: [],
            surprisingPoints: [],
            dataCollected: [],
            platformRights: [],
            risks: [],
            tips: [],
          },
          content: document.content ?? [],
          isActive: document.isActive ?? true,
        });
      } catch (error) {
        console.error(error);
        setFormData(null);
      }
    }

    void loadData();
  }, [params.id]);

  async function handleSubmit(data: DocumentFormData) {
    await updateAgreeDocument(String(params.id), data);
    setMessage("Document berhasil diupdate");
    setTimeout(() => router.push("/admin/agree/documents"), 800);
  }

  if (formData === undefined) return null;

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-slate-500 dark:text-slate-400">Document tidak ditemukan</div>
          <Link href="/admin/agree/documents" className="btn-secondary">
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Edit Document</h1>
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
          initialData={formData}
          apps={apps}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/agree/documents")}
          submitButtonText="Update Document"
        />
      </div>
    </div>
  );
}
