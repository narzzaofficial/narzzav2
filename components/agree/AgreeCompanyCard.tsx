import Image from "next/image";
import Link from "next/link";

import type { AgreeCompany } from "@/types/agree";

type AgreeCompanyCardProps = {
  company: AgreeCompany;
  topicSlug: string;
};

export function AgreeCompanyCard({ company, topicSlug }: AgreeCompanyCardProps) {
  return (
    <Link
      href={`/setelah-klik-agree/${topicSlug}/${company.slug}`}
      className="group rounded-3xl border border-slate-300/70 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-400 dark:border-slate-700/60 dark:bg-slate-900/70 dark:hover:border-slate-500"
    >
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <Image src={company.logo} alt={company.name} fill className="object-contain p-2" sizes="56px" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{company.name}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {company.description}
          </p>
        </div>
      </div>

      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-cyan-200">
        Lihat app & dokumen
      </div>
    </Link>
  );
}
