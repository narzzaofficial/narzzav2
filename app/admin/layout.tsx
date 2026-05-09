import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { requireAdminPage } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdminPage();

  return (
    <ClerkProvider signInUrl="/sign-in" signInFallbackRedirectUrl="/admin">
      <AdminShell email={admin.email}>
        {children}
      </AdminShell>
    </ClerkProvider>
  );
}
