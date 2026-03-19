"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SafeBackButton } from "@/components/frontend/SafeBackButton";
import { AppForm, type AppFormData } from "@/components/admin/agree/AppForm";
import {
  fetchAgreeAppById,
  fetchAgreeCompanies,
  updateAgreeApp,
} from "@/lib/services/agree-admin-service";

type CompanyOption = {
  _id: string;
  name: string;
};

type AppItem = {
  name: string;
  slug: string;
  companyId: string;
  description?: string;
  icon?: string;
  isPopular?: boolean;
  popularScore?: number;
  isActive?: boolean;
};

export default function EditAgreeAppPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState<AppFormData | null | undefined>(undefined);

  useEffect(() => {
    async function loadData() {
      try {
        const [companyData, item] = await Promise.all([
          fetchAgreeCompanies(),
          fetchAgreeAppById(String(params.id)),
        ]);
        setCompanies(
          ((companyData.items as CompanyOption[]) ?? []).map((company) => ({
            id: company._id,
            name: company.name,
          }))
        );
        const app = item as AppItem;
        setFormData({
          name: app.name,
          slug: app.slug,
          companyId: app.companyId,
          description: app.description ?? "",
          icon: app.icon ?? "",
          isPopular: app.isPopular ?? false,
          popularScore: app.popularScore ?? 0,
          isActive: app.isActive ?? true,
        });
      } catch (error) {
        console.error(error);
        setFormData(null);
      }
    }

    void loadData();
  }, [params.id]);

  async function handleSubmit(data: AppFormData) {
    await updateAgreeApp(String(params.id), data);
    setMessage("App berhasil diupdate");
    setTimeout(() => router.push("/admin/agree/apps"), 800);
  }

  if (formData === undefined) return null;

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-slate-500 dark:text-slate-400">App tidak ditemukan</div>
          <SafeBackButton fallbackHref="/admin/agree/apps" className="btn-secondary">
            Kembali
          </SafeBackButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Edit App</h1>
          <SafeBackButton fallbackHref="/admin/agree/apps" className="btn-secondary">
            Kembali
          </SafeBackButton>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <AppForm
          initialData={formData}
          companies={companies}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/agree/apps")}
          submitButtonText="Update App"
        />
      </div>
    </div>
  );
}
