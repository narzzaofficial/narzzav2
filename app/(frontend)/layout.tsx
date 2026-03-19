"use client";

import AdsPlaceholder from "@/components/frontend/AdsPlaceholder";
import { MobileNavDrawer } from "@/components/frontend/MobileNavDrawer";
import { Navigation } from "@/components/frontend/Navigation";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
        <div className="relative flex gap-4 py-6 pt-20 lg:gap-8 lg:pt-6 xl:gap-10">
          <aside className="hidden w-[280px] shrink-0 lg:block">
            <div className="sticky top-6">
              <Navigation />
            </div>
          </aside>

          <main id="main-content" className="mx-auto min-w-0 max-w-4xl flex-1 px-2 lg:px-0">
            {children}
          </main>

          <aside className="hidden w-64 shrink-0 xl:block">
            <div className="sticky top-6 space-y-4">
              <AdsPlaceholder label="Iklan" size="300 x 250" variant="square" />
              <AdsPlaceholder
                label="Sponsor"
                size="Native Promo Block"
                variant="native"
              />
              <AdsPlaceholder label="Iklan" size="300 x 90" variant="banner" />
            </div>
          </aside>
        </div>
      </div>

      <MobileNavDrawer activePath={pathname} />
    </div>
  );
}
