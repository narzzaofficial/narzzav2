import Link from "next/link";
import { FileText } from "lucide-react";

import { AgreeAppIcon } from "@/components/agree/AgreeAppIcon";
import type { AgreeApp } from "@/types/agree";

type AgreeAppCardProps = {
  app: AgreeApp;
  href: string;
};

export function AgreeAppCard({ app, href }: AgreeAppCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-[26px] border border-sky-300/40 bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(236,248,255,0.92))] p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-400 dark:border-cyan-300/25 dark:bg-[linear-gradient(160deg,rgba(15,23,42,0.92),rgba(12,28,45,0.9))]"
    >
      <div className="flex items-center gap-4">
        <AgreeAppIcon imageUrl={app.icon} appName={app.name} className="h-9 w-9 shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{app.name}</h3>
          <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {app.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:bg-slate-900/80 dark:text-slate-200">
          <FileText className="h-3.5 w-3.5 text-sky-600 dark:text-cyan-300/90" />
          Bedah dokumen
        </div>

        <div className="ml-auto inline-flex items-center gap-2 text-sm font-semibold leading-none text-sky-700 dark:text-cyan-200/90">
          Masuk ke halaman app
          <span className="block shrink-0 text-base leading-none transition group-hover:translate-x-1">
            &gt;
          </span>
        </div>
      </div>
    </Link>
  );
}
