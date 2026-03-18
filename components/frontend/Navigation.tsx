"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { navLink } from "@/constants/NavLink";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Circle,
  FlaskConical,
  GraduationCap,
  Home,
  Info,
  Moon,
  Newspaper,
  Scale,
  ScrollText,
  Sun,
} from "lucide-react";

const NAV_ICONS: Record<string, LucideIcon> = {
  "/": Home,
  "/berita": Newspaper,
  "/tutorial": GraduationCap,
  "/riset": FlaskConical,
  "/hukum-indonesia": Scale,
  "/pusat-hadist": ScrollText,
  "/tentang": Info,
};

export function Navigation() {
  const activePath = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <div className="flex flex-col gap-4">
      {/* Logo Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-white/80 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Only render logo after mounted to avoid hydration mismatch */}
          {mounted ? (
            <Image
              src={isDark ? "/dark-logo.png" : "/logo.png"}
              alt="Narzza Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          )}
          <div className="leading-tight">
            <p className="text-xl font-bold text-slate-900 dark:text-white">Narzza</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Media Digital</p>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-white/80 dark:border-slate-800 p-3 shadow-sm overflow-hidden">
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-hide">
          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLink.map((item) => {
              const isActive = activePath === item.href;
              const Icon = NAV_ICONS[item.href] ?? Circle;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group relative flex items-center gap-3 
                    rounded-xl px-3 py-2.5
                    transition-all duration-150
                    ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-cyan-400" />
                  )}

                  {/* Icon */}
                  <span
                    className={`
                      flex h-9 w-9 shrink-0 items-center justify-center 
                      rounded-lg transition-all
                      ${
                        isActive
                          ? "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/30"
                          : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 text-slate-900 dark:text-white" />
                  </span>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`
                        text-sm font-semibold leading-none
                        ${
                          isActive
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-700 dark:text-slate-300"
                        }
                      `}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`
                        mt-1 text-[11px] leading-none
                        ${
                          isActive
                            ? "text-slate-600 dark:text-slate-400"
                            : "text-slate-500 dark:text-slate-500"
                        }
                      `}
                    >
                      {item.note}
                    </p>
                  </div>

                  {/* Active chevron */}
                  {isActive && (
                    <svg
                      className="h-4 w-4 shrink-0 text-cyan-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-3 h-px bg-slate-200 dark:bg-slate-700" />

          {/* Theme Toggle */}
          {!mounted ? (
            <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700">
                  <Circle className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Tema
                  </p>
                  <p className="text-[11px] text-slate-500">Loading...</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="
                group w-full flex items-center justify-between
                rounded-xl px-4 py-3
                transition-all duration-150
                bg-sky-50/50 dark:bg-slate-800/50
              "
            >
              <div className="flex items-center gap-3">
                <span
                  className="
                    flex h-5 w-5 shrink-0 items-center justify-center 
                    transition-all
                  "
                >
                  {isDark ? (
                    <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                  ) : (
                    <Sun className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                  )}
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold leading-none text-slate-700 dark:text-slate-300">
                    Dark Mode
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`
                  relative h-5 w-10 rounded-full transition-colors focus:outline-none
                  ${isDark ? "bg-cyan-500" : "bg-slate-300"}
                `}
              >
                <div
                  className={`
                    absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm
                    transition-transform duration-200
                    ${isDark ? "translate-x-5" : "translate-x-1"}
                  `}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

