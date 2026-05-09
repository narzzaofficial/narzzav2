"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Scale,
  BookMarked,
  ShieldCheck,
  Tags,
  Building2,
  AppWindow,
  FileText,
  Zap,
  BarChart2,
  ChevronDown,
  X,
} from "lucide-react";

type NavLeaf = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: NavLeaf[];
};

type NavItem = NavLeaf | NavGroup;

function isGroup(item: NavItem): item is NavGroup {
  return "children" in item;
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Feeds", href: "/admin/feeds", icon: Newspaper },
  { label: "Hukum Indonesia", href: "/admin/laws", icon: Scale },
  { label: "Stories", href: "/admin/stories", icon: BookMarked },
  {
    label: "Agree",
    icon: ShieldCheck,
    children: [
      { label: "Topics", href: "/admin/agree/topics", icon: Tags },
      { label: "Companies", href: "/admin/agree/companies", icon: Building2 },
      { label: "Apps", href: "/admin/agree/apps", icon: AppWindow },
      { label: "Documents", href: "/admin/agree/documents", icon: FileText },
    ],
  },
  { label: "Pipeline", href: "/admin/pipeline", icon: Zap },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
];

function isActive(href: string, pathname: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function SidebarContent({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  const agreeGroup = NAV.find((item) => isGroup(item) && item.label === "Agree") as NavGroup;
  const agreeChildActive = agreeGroup?.children.some((c) => isActive(c.href, pathname));
  const [agreeOpen, setAgreeOpen] = useState(agreeChildActive);

  useEffect(() => {
    if (agreeChildActive) setAgreeOpen(true);
  }, [agreeChildActive]);

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200/70 px-4 dark:border-slate-700/60">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
          N
        </div>
        <span className="font-semibold text-slate-900 dark:text-white">Narzza Admin</span>
        <button
          onClick={onClose}
          aria-label="Tutup sidebar"
          className="ml-auto rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {NAV.map((item) => {
          if (isGroup(item)) {
            const Icon = item.icon;
            const anyChildActive = item.children.some((c) => isActive(c.href, pathname));

            return (
              <div key={item.label}>
                <button
                  onClick={() => setAgreeOpen((p) => !p)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    anyChildActive
                      ? "text-violet-700 dark:text-violet-400"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${agreeOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {agreeOpen && (
                  <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-slate-200 pl-3 dark:border-slate-700">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const active = isActive(child.href, pathname);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                            active
                              ? "bg-violet-50 font-medium text-violet-700 dark:bg-violet-900/25 dark:text-violet-300"
                              : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                          }`}
                        >
                          <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const Icon = item.icon;
          const active = isActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-violet-50 text-violet-700 dark:bg-violet-900/25 dark:text-violet-300"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-slate-200/70 px-4 py-3 dark:border-slate-700/60">
        <Link
          href="/"
          target="_blank"
          className="text-xs text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
        >
          ← Lihat website
        </Link>
      </div>
    </div>
  );
}

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-white shadow-xl transition-transform duration-200 ease-in-out dark:bg-slate-900 lg:static lg:z-auto lg:shadow-none lg:translate-x-0 lg:border-r lg:border-slate-200/70 lg:dark:border-slate-700/60 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
}
