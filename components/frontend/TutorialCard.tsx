import Image from "next/image";
import Link from "next/link";
import type { Feed } from "@/types/content";
import { RelativeTime } from "./RelativeTime";

type TutorialCardProps = {
  feed: Feed;
  index: number;
};

export function TutorialCard({ feed, index }: TutorialCardProps) {
  const stepCount = feed.lineCount ?? 0;
  const previewQ = feed.previewLines?.[0];
  const previewA = feed.previewLines?.[1];

  return (
    <Link
      href={`/read/${feed.slug}`}
      className="feed-card group block w-full overflow-hidden rounded-2xl transition-all duration-300 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:border-emerald-400/50 dark:hover:shadow-emerald-500/10"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-row">
        {/* ═══════════════════════════════════════════════════════
            THUMBNAIL (Left Side - Cropped)
            ═══════════════════════════════════════════════════════ */}
        <div className="relative aspect-4/3 w-32 shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800/40 sm:w-48 md:w-56">
          <Image
            src={feed.image}
            alt={feed.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 128px, (max-width: 768px) 192px, 224px"
            priority={index === 0}
          />

          {/* Step Count Badge */}
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-slate-900/80 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm dark:bg-black/70">
            <svg
              className="h-3 w-3 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <span className="hidden sm:inline">{stepCount} langkah</span>
            <span className="inline sm:hidden">{stepCount}</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            CONTENT (Right Side)
            ═══════════════════════════════════════════════════════ */}
        <div className="flex flex-1 flex-col justify-between p-3 sm:p-5">
          <div>
            {/* Badge + Timestamp */}
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:text-[11px] bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zm5.99 7.176A9.026 9.026 0 007 15.96v-4.5l.256.11a2.995 2.995 0 002.487 0l5.527-2.369v3.408c0 .753-.306 1.473-.85 1.997A6.028 6.028 0 0110 16.5a6.028 6.028 0 01-4.3-1.782A2.81 2.81 0 015 12.72V11.5l-.69.297A2 2 0 003 13.63v.87a1 1 0 001.757.656A7.97 7.97 0 009.3 16.573z" />
                </svg>
                <span className="hidden sm:inline">Tutorial</span>
                <span className="inline sm:hidden">🎓</span>
              </span>

              <span className="text-[11px] text-slate-400 dark:text-slate-600">
                •
              </span>

              <span className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-[11px]">
                <RelativeTime timestamp={feed.createdAt} />
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-300 sm:mb-3 sm:text-base md:text-lg">
              {feed.title}
            </h3>

            {/* Preview Q&A (Desktop Only) */}
            {(previewQ || previewA) && (
              <div className="mt-3 hidden space-y-2 sm:block">
                {previewQ && (
                  <div className="flex items-start gap-2 text-[13px]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                      Q
                    </span>
                    <p className="line-clamp-1 text-slate-600 dark:text-slate-400">
                      {previewQ.text}
                    </p>
                  </div>
                )}

                {previewA && (
                  <div className="flex items-start gap-2 text-[13px]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                      A
                    </span>
                    <p className="line-clamp-2 text-slate-700 dark:text-slate-300">
                      {previewA.text}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Section: Progress Dots + CTA */}
          <div className="mt-3 flex items-center justify-between border-t pt-2 sm:mt-4 sm:pt-3 border-slate-200 dark:border-slate-700/50">
            {/* Step Indicator Dots */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(stepCount, 5) }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === 0 ? "w-4" : "w-2"
                  } bg-emerald-400/50 group-hover:bg-emerald-500 dark:bg-emerald-400/60 dark:group-hover:bg-emerald-400`}
                  aria-hidden="true"
                />
              ))}
              {stepCount > 5 && (
                <span className="ml-1 text-[10px] text-slate-500 dark:text-slate-500">
                  +{stepCount - 5}
                </span>
              )}
            </div>

            {/* CTA */}
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold transition-colors sm:gap-1.5 text-emerald-600 group-hover:text-emerald-700 dark:text-emerald-300 dark:group-hover:text-emerald-200">
              <span className="hidden sm:inline">Mulai belajar</span>
              <span className="inline sm:hidden">Mulai</span>
              <svg
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
