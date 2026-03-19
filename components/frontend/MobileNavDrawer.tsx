"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
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

type MobileNavDrawerProps = {
  activePath: string;
};

export function MobileNavDrawer({ activePath }: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll when drawer is open
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  const toggleDrawer = () => setIsOpen((prev) => !prev);
  const closeDrawer = () => setIsOpen(false);
  const isDark = theme === "dark";

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {mounted ? (
              <Image
                src={isDark ? "/dark-logo.png" : "/logo.png"}
                alt="Narzza"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
            )}
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Narzza
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Media Digital
              </p>
            </div>
          </div>

          {/* Menu Button */}
          <button
            onClick={toggleDrawer}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-slate-700 dark:text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Overlay & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Dark Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={closeDrawer}
          />

          {/* Drawer Panel */}
          <aside className="absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {mounted ? (
                  <Image
                    src={isDark ? "/dark-logo.png" : "/logo.png"}
                    alt="Narzza"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                )}
                <div className="leading-tight">
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    Narzza
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Media Digital
                  </p>
                </div>
              </div>

              <button
                onClick={closeDrawer}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <svg
                  className="w-5 h-5 text-slate-600 dark:text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation Links - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3">
              <nav className="space-y-1">
                {navLink.map((item) => {
                  const isActive = activePath === item.href;
                  const Icon = NAV_ICONS[item.href] ?? Circle;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeDrawer}
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
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-cyan-400" />
                      )}

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
            </div>

            {/* Theme Toggle */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-3">
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
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="group w-full flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700">
                      {isDark ? (
                        <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                      ) : (
                        <Sun className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                      )}
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold leading-none text-slate-700 dark:text-slate-300">
                        {isDark ? "Light Mode" : "Dark Mode"}
                      </p>
                      <p className="mt-1 text-[11px] leading-none text-slate-500">
                        {isDark ? "Beralih ke terang" : "Beralih ke gelap"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      isDark ? "bg-cyan-500" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        isDark ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

