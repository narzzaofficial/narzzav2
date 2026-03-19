"use client";

import { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <main id="main-content" className="min-h-screen bg-canvas">
      {children}
    </main>
  );
}
