"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SafeBackButton } from "@/components/frontend/SafeBackButton";
import { CompanyForm, type CompanyFormData } from "@/components/admin/agree/CompanyForm";
import {
  fetchAgreeCompanyById,
  fetchAgreeTopics,
  updateAgreeCompany,
} from "@/lib/services/agree-admin-service";

type TopicOption = {
  _id: string;
  name: string;
};

type CompanyItem = {
  name: string;
  slug: string;
  topicId: string;
  logo?: string;
  description?: string;
  isActive?: boolean;
};

export default function EditAgreeCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [topics, setTopics] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState<CompanyFormData | null | undefined>(undefined);

  useEffect(() => {
    async function loadData() {
      try {
        const [topicData, item] = await Promise.all([
          fetchAgreeTopics(),
          fetchAgreeCompanyById(String(params.id)),
        ]);
        setTopics(
          ((topicData.items as TopicOption[]) ?? []).map((topic) => ({
            id: topic._id,
            name: topic.name,
          }))
        );
        const company = item as CompanyItem;
        setFormData({
          name: company.name,
          slug: company.slug,
          topicId: company.topicId,
          logo: company.logo ?? "",
          description: company.description ?? "",
          isActive: company.isActive ?? true,
        });
      } catch (error) {
        console.error(error);
        setFormData(null);
      }
    }

    void loadData();
  }, [params.id]);

  async function handleSubmit(data: CompanyFormData) {
    await updateAgreeCompany(String(params.id), data);
    setMessage("Company berhasil diupdate");
    setTimeout(() => router.push("/admin/agree/companies"), 800);
  }

  if (formData === undefined) return null;

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-slate-500 dark:text-slate-400">Company tidak ditemukan</div>
          <SafeBackButton fallbackHref="/admin/agree/companies" className="btn-secondary">
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
          <h1 className="text-xl font-bold">Edit Company</h1>
          <SafeBackButton fallbackHref="/admin/agree/companies" className="btn-secondary">
            Kembali
          </SafeBackButton>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <CompanyForm
          initialData={formData}
          topics={topics}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/agree/companies")}
          submitButtonText="Update Company"
        />
      </div>
    </div>
  );
}
