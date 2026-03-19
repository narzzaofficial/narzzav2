"use client";

import { Moon, Share2, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { SafeBackButton } from "@/components/frontend/SafeBackButton";

type ReadDetailToolbarProps = {
  category: string;
  slug: string;
  pathPrefix?: "/feeds" | "/hukum" | "/setelah-klik-agree";
  sharePath?: string;
  shareTitle?: string;
  shareText?: string;
  labelPrefix?: string;
  fallbackHref?: string;
};

export function ReadDetailToolbar({
  category,
  slug,
  pathPrefix = "/feeds",
  sharePath,
  shareTitle = "Narzza Media Digital",
  shareText = "Baca konten ini di Narzza",
  labelPrefix = "",
  fallbackHref = "/",
}: ReadDetailToolbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const badgeText = labelPrefix ? `${labelPrefix}: ${category}` : category;

  const handleShare = async () => {
    const url = sharePath
      ? `${window.location.origin}${sharePath}`
      : `${window.location.origin}${pathPrefix}/${slug}`;
    const shareData = {
      title: shareTitle,
      text: shareText,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // fallback clipboard below
      }
    }

    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-300/70 bg-white/70 p-2 dark:border-slate-700/60 dark:bg-slate-900/60">
      <SafeBackButton
        fallbackHref={fallbackHref}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-300/70 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500"
      >
        Kembali
      </SafeBackButton>

      <div className="inline-flex items-center gap-2">
        <span className="rounded-full border border-cyan-300/60 bg-cyan-100/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-800 dark:border-cyan-400/50 dark:bg-cyan-500/10 dark:text-cyan-200">
          {badgeText}
        </span>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-300/70 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>

        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/70 text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
