import Link from "next/link";
import {
  Newspaper,
  Scale,
  BookMarked,
  ShieldCheck,
  Zap,
  Tags,
  Building2,
  AppWindow,
  FileText,
  ArrowRight,
} from "lucide-react";

const MAIN_MODULES = [
  {
    title: "Feeds",
    description: "Kelola berita, tutorial, dan riset. Buat konten baru atau edit yang sudah ada.",
    href: "/admin/feeds",
    newHref: "/admin/feeds/new",
    icon: Newspaper,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Hukum Indonesia",
    description: "Kelola dokumen hukum, naskah original, dan explanation Q&A.",
    href: "/admin/laws",
    newHref: "/admin/laws/new",
    icon: Scale,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Stories",
    description: "Kelola story viral dan grouping konten feed.",
    href: "/admin/stories",
    newHref: "/admin/stories/new",
    icon: BookMarked,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    title: "Pipeline",
    description: "Auto-generate berita dari sumber RSS menggunakan AI.",
    href: "/admin/pipeline",
    newHref: null,
    icon: Zap,
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

const AGREE_ITEMS = [
  { label: "Topics", href: "/admin/agree/topics", icon: Tags },
  { label: "Companies", href: "/admin/agree/companies", icon: Building2 },
  { label: "Apps", href: "/admin/agree/apps", icon: AppWindow },
  { label: "Documents", href: "/admin/agree/documents", icon: FileText },
];

export default function AdminHomePage() {
  return (
    <div className="px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Main modules grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {MAIN_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.href} className="glass-panel flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 rounded-xl p-2.5 ${mod.iconBg}`}>
                    <Icon className={`h-5 w-5 ${mod.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900 dark:text-white">{mod.title}</h2>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex gap-2">
                  <Link
                    href={mod.href}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Lihat semua
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  {mod.newHref && (
                    <Link
                      href={mod.newHref}
                      className="flex items-center justify-center rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-700"
                    >
                      + Tambah
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Agree section */}
        <div className="glass-panel">
          <div className="mb-4 flex items-center gap-3">
            <div className="shrink-0 rounded-xl bg-violet-100 p-2.5 dark:bg-violet-900/30">
              <ShieldCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Agree</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola topic, company, app, dan dokumen Terms &amp; Privacy
              </p>
            </div>
            <Link
              href="/admin/agree"
              className="ml-auto flex items-center gap-1 text-xs text-violet-600 hover:underline dark:text-violet-400"
            >
              Lihat semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {AGREE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-3 transition-colors hover:bg-slate-100 dark:border-slate-700/60 dark:bg-slate-800/30 dark:hover:bg-slate-800/60"
                >
                  <Icon className="h-4 w-4 shrink-0 text-violet-500 dark:text-violet-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                  <ArrowRight className="ml-auto h-3.5 w-3.5 text-slate-400" />
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
