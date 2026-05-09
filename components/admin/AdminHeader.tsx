"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/feeds": "Feeds",
  "/admin/feeds/new": "Tambah Feed",
  "/admin/laws": "Hukum Indonesia",
  "/admin/laws/new": "Tambah Hukum",
  "/admin/stories": "Stories",
  "/admin/stories/new": "Tambah Story",
  "/admin/agree": "Agree",
  "/admin/agree/topics": "Topics",
  "/admin/agree/topics/new": "Tambah Topic",
  "/admin/agree/companies": "Companies",
  "/admin/agree/companies/new": "Tambah Company",
  "/admin/agree/apps": "Apps",
  "/admin/agree/apps/new": "Tambah App",
  "/admin/agree/documents": "Documents",
  "/admin/agree/documents/new": "Tambah Document",
  "/admin/pipeline": "Pipeline",
  "/admin/analytics": "Analytics",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (/^\/admin\/feeds\/[^/]+$/.test(pathname)) return "Edit Feed";
  if (/^\/admin\/laws\/[^/]+$/.test(pathname)) return "Edit Hukum";
  if (/^\/admin\/stories\/[^/]+$/.test(pathname)) return "Edit Story";
  if (/^\/admin\/agree\/topics\/[^/]+$/.test(pathname)) return "Edit Topic";
  if (/^\/admin\/agree\/companies\/[^/]+$/.test(pathname)) return "Edit Company";
  if (/^\/admin\/agree\/apps\/[^/]+$/.test(pathname)) return "Edit App";
  if (/^\/admin\/agree\/documents\/[^/]+$/.test(pathname)) return "Edit Document";
  return "Admin";
}

type AdminHeaderProps = {
  email: string;
  onMenuClick: () => void;
};

export function AdminHeader({ email, onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80 md:px-5">
      <button
        onClick={onMenuClick}
        aria-label="Buka sidebar"
        className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm text-slate-500 sm:block dark:text-slate-400">{email}</span>
        <UserButton />
      </div>
    </header>
  );
}
