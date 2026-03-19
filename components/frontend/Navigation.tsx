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
  "/setelah-klik-agree": ScrollText,
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
      <div className="rounded-[26px] border border-white/80 bg-white/92 p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-900/88 dark:shadow-none">
        <div className="flex items-center gap-3">
          {/* Only render logo after mounted to avoid hydration mismatch */}
          {mounted ? (
            <Image
              src={isDark ? "/dark-logo.png" : "/logo.png"}
              alt="Narzza Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          ) : (
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          )}
          <div className="leading-tight">
            <p className="text-[17px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">
              Narzza
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Media Digital
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="overflow-hidden rounded-[26px] border border-white/80 bg-white/92 p-3.5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-900/88 dark:shadow-none">
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-hide">
          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLink.map((item) => {
              const isActive = activePath === item.href;
              const Icon = NAV_ICONS[item.href] ?? Circle;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group relative flex items-center gap-3
                    rounded-[18px] px-3.5 py-2.5
                    transition-all duration-200
                    ${
                      isActive
                        ? "border border-sky-200/80 bg-sky-50/85 shadow-[0_14px_30px_-24px_rgba(14,165,233,0.45)] dark:border-cyan-500/20 dark:bg-cyan-950/18"
                        : "border border-transparent hover:bg-slate-50/90 dark:hover:bg-slate-800/40"
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-sky-400 dark:bg-cyan-300" />
                  )}

                  {/* Icon */}
                  <span
                    className={`
                      flex h-9 w-9 shrink-0 items-center justify-center
                      rounded-[14px] transition-all
                      ${
                        isActive
                          ? "bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-[0_12px_24px_-14px_rgba(37,99,235,0.65)]"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800/90 dark:text-slate-200 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`
                        text-sm font-medium leading-none tracking-[-0.01em]
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
                      className="h-3.5 w-3.5 shrink-0 text-sky-500 dark:text-cyan-300"
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
          <div className="my-3.5 h-px bg-slate-200/90 dark:bg-slate-700/80" />

          {/* Theme Toggle */}
          {!mounted ? (
            <div className="flex items-center justify-between rounded-[18px] bg-slate-50/85 px-3.5 py-2.5 dark:bg-slate-800/45">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-slate-200 dark:bg-slate-700">
                  <Circle className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
                rounded-[18px] border border-slate-200/80 bg-slate-50/85 px-3.5 py-2.5
                transition-all duration-200
                dark:border-slate-700/70 dark:bg-slate-800/45
              "
            >
              <div className="flex items-center gap-3">
                <span
                  className="
                    flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] bg-white text-slate-600 shadow-sm transition-all dark:bg-slate-900/80 dark:text-slate-300
                  "
                >
                  {isDark ? (
                    <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                  ) : (
                    <Sun className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                  )}
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                    Dark Mode
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`
                  relative h-6 w-11 rounded-full transition-colors focus:outline-none
                  ${isDark ? "bg-sky-500" : "bg-slate-300"}
                `}
              >
                <div
                  className={`
                    absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm
                    transition-transform duration-200
                    ${isDark ? "translate-x-5" : "translate-x-0.5"}
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

