"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SafeBackButton } from "@/components/frontend/SafeBackButton";
import { AppForm, type AppFormData } from "@/components/admin/agree/AppForm";
import { createAgreeApp, fetchAgreeCompanies } from "@/lib/services/agree-admin-service";

type CompanyOption = {
  _id: string;
  name: string;
};

const emptyForm: AppFormData = {
  name: "",
  slug: "",
  companyId: "",
  description: "",
  icon: "",
  isPopular: false,
  popularScore: 0,
  isActive: true,
};

export default function NewAgreeAppPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    fetchAgreeCompanies()
      .then((data) => {
        const items = ((data.items as CompanyOption[]) ?? []).map((item) => ({
          id: item._id,
          name: item.name,
        }));
        setCompanies(items);
      })
      .catch(() => setCompanies([]));
  }, []);

  async function handleSubmit(data: AppFormData) {
    await createAgreeApp(data);
    setMessage("App berhasil dibuat");
    setTimeout(() => router.push("/admin/agree/apps"), 800);
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">App Baru</h1>
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
          initialData={emptyForm}
          companies={companies}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/agree/apps")}
          submitButtonText="Simpan App"
        />
      </div>
    </div>
  );
}
