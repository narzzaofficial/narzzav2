"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CompanyForm, type CompanyFormData } from "@/components/admin/agree/CompanyForm";
import { createAgreeCompany, fetchAgreeTopics } from "@/lib/services/agree-admin-service";

type TopicOption = {
  _id: string;
  name: string;
};

const emptyForm: CompanyFormData = {
  name: "",
  slug: "",
  topicId: "",
  logo: "",
  description: "",
  isActive: true,
};

export default function NewAgreeCompanyPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [topics, setTopics] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    fetchAgreeTopics()
      .then((data) => {
        const items = ((data.items as TopicOption[]) ?? []).map((item) => ({
          id: item._id,
          name: item.name,
        }));
        setTopics(items);
      })
      .catch(() => setTopics([]));
  }, []);

  async function handleSubmit(data: CompanyFormData) {
    await createAgreeCompany(data);
    setMessage("Company berhasil dibuat");
    setTimeout(() => router.push("/admin/agree/companies"), 800);
  }

  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Company Baru</h1>
          <Link href="/admin/agree/companies" className="btn-secondary">
            Kembali
          </Link>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
            {message}
          </div>
        )}

        <CompanyForm
          initialData={emptyForm}
          topics={topics}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/agree/companies")}
          submitButtonText="Simpan Company"
        />
      </div>
    </div>
  );
}
