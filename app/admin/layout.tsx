import { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { requireAdminPage } from "@/lib/auth";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const admin = await requireAdminPage();

  return (
    <main id="main-content" className="min-h-screen bg-canvas">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-end px-3 pt-4 md:px-5">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-300/70 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200">
          <span className="hidden sm:inline">{admin.email}</span>
          <UserButton />
        </div>
      </div>
      {children}
    </main>
  );
}
