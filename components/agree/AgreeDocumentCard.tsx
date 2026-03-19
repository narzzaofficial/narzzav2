import Link from "next/link";
import { FileBadge2, ShieldAlert } from "lucide-react";

import type { AgreeDocument } from "@/types/agree";

type AgreeDocumentCardProps = {
  document: AgreeDocument;
  href: string;
};

export function AgreeDocumentCard({ document, href }: AgreeDocumentCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-amber-300/60 bg-[linear-gradient(150deg,rgba(255,252,242,0.98),rgba(255,239,214,0.9))] p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-400 dark:border-amber-300/30 dark:bg-[linear-gradient(150deg,rgba(30,29,24,0.95),rgba(38,34,22,0.92))]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-900 shadow-sm dark:bg-slate-900/80 dark:text-amber-100">
            <FileBadge2 className="h-3.5 w-3.5" />
            {document.type.replaceAll("-", " ")}
          </div>
          <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{document.title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">
            {document.dek}
          </p>
        </div>
        <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-amber-700 dark:text-amber-200/90" />
      </div>

      <div className="mt-4 text-sm font-semibold text-amber-900 dark:text-amber-100/90">
        Baca versi asli, terjemahan, analisis, dan Q&A
      </div>
    </Link>
  );
}
