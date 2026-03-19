"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { StatusFeedItem, StatusStory } from "./types";

type StoryViewerOverlayProps = {
  selectedStory: StatusStory;
  feeds: StatusFeedItem[];
  onClose: () => void;
};

export function StoryViewerOverlay({
  selectedStory,
  feeds,
  onClose,
}: StoryViewerOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = feeds[currentIndex];

  const progress = useMemo(() => {
    if (!feeds.length) return 0;
    return ((currentIndex + 1) / feeds.length) * 100;
  }, [currentIndex, feeds.length]);

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < feeds.length - 1;

  const handlePrev = () => {
    if (!canPrev) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!canNext) return;
    setCurrentIndex((prev) => prev + 1);
  };

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-140 flex items-center justify-center">
      <button
        type="button"
        aria-label="Tutup status"
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <article className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl dark:border-slate-700/60 dark:bg-slate-900/70">
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
          <div
            className="h-full rounded-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-500 dark:text-sky-300">
              Status Populer
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
              {selectedStory.name}
            </h3>
          </div>

          <button type="button" onClick={onClose} className="btn-secondary">
            Tutup
          </button>
        </div>

        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-800/40">
          {current.image ? (
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 420px"
              priority
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm font-bold text-slate-700 dark:text-slate-200">
              {selectedStory.label}
            </div>
          )}
        </div>

        <h4 className="text-2xl font-bold leading-tight text-slate-900 dark:text-slate-100">
          {current.title}
        </h4>

        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50/70 p-4 text-sm leading-relaxed text-orange-900 dark:border-orange-400/30 dark:bg-orange-900/20 dark:text-orange-100">
          {current.takeaway}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canPrev}
            className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            prev
          </button>

          <Link
            href={current.href}
            onClick={onClose}
            className="btn-secondary font-semibold"
          >
            {current.ctaLabel}
          </Link>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canNext}
            className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            next
          </button>
        </div>

        <div className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
          {currentIndex + 1} / {feeds.length}
        </div>
      </article>
    </div>
  );
}
