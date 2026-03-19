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

  return (
    <Link
      href={`/feeds/${feed.slug}`}
      className="feed-card group block w-full overflow-hidden rounded-2xl p-0 transition-all duration-300 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:border-emerald-400/50 dark:hover:shadow-emerald-500/10"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col">
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800/40">
          <Image
            src={feed.image}
            alt={feed.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 720px"
            priority={index === 0}
          />

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

        <div className="p-2.5 sm:p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 sm:text-[11px]">
              Tutorial
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-600">
              •
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-[11px]">
              <RelativeTime timestamp={feed.createdAt} />
            </span>
          </div>

          <h3 className="break-words text-[14px] font-bold leading-snug transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-300 sm:text-[15px] md:text-[17px]">
            {feed.title}
          </h3>

          <div className="mt-3 flex items-center justify-end border-t border-slate-200 pt-2 dark:border-slate-700/50">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 transition-colors group-hover:text-emerald-700 dark:text-emerald-300 dark:group-hover:text-emerald-200">
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
