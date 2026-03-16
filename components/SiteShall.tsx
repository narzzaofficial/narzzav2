"use client";

import { usePathname } from "next/navigation";
import AdsPlaceholder from "./frontend/AdsPlaceholder";
import { MobileNavDrawer } from "./frontend/MobileNavDrawer";
import { Navigation } from "./frontend/Navigation";

type SiteShellProps = {
  children: React.ReactNode;
};

const DETAIL_PATTERNS = [
  /^\/read\/[^/]+$/,
  /^\/buku\/[^/]+$/,
  /^\/roadmap\/[^/]+$/,
  /^\/toko\/[^/]+$/,
];

function isDetailPage(path: string) {
  return DETAIL_PATTERNS.some((pattern) => pattern.test(path));
}

export function SiteShell({ children }: SiteShellProps) {
  const activePath = usePathname();

  if (isDetailPage(activePath)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-[1400px]">
        <div className="relative flex gap-6 py-6 pt-20 lg:pt-6">
          {/* Sidebar Kiri - Desktop only */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-6">
              <Navigation />
            </div>
          </aside>

          {/* Konten Utama */}
          <main className="flex-1 min-w-0 max-w-3xl mx-auto px-2 lg:px-0">
            {children}
          </main>

          {/* Sidebar Kanan - Desktop only */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-6 space-y-4">
              <AdsPlaceholder label="Iklan" size="300 × 250" variant="square" />
              <AdsPlaceholder
                label="Sponsor"
                size="Native Promo Block"
                variant="native"
              />
              <AdsPlaceholder label="Iklan" size="300 × 90" variant="banner" />
            </div>
          </aside>
        </div>
      </div>

      <MobileNavDrawer activePath={activePath} />
    </div>
  );
}
