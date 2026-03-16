import Image from "next/image";
import Link from "next/link";
import type { Feed } from "@/types/content";
import { RelativeTime } from "./RelativeTime";

type FeedTitleCardProps = {
  feed: Feed;
  index: number;
};

type CategoryConfig = {
  badge: string;
  accent: string;
  icon: string;
};

const categoryConfigs: Record<Feed["category"], CategoryConfig> = {
  Berita: {
    badge:
      "bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30",
    accent: "hover:border-sky-400 dark:hover:border-sky-400/50",
    icon: "📰",
  },
  Tutorial: {
    badge:
      "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
    accent: "hover:border-emerald-400 dark:hover:border-emerald-400/50",
    icon: "🎓",
  },
  Riset: {
    badge:
      "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300 dark:bg-fuchsia-500/20 dark:text-fuchsia-300 dark:border-fuchsia-500/30",
    accent: "hover:border-fuchsia-400 dark:hover:border-fuchsia-400/50",
    icon: "🔬",
  },
};

export function FeedTitleCard({ feed, index }: FeedTitleCardProps) {
  const config = categoryConfigs[feed.category];

  return (
    <Link
      href={`/read/${feed.slug}`}
      className={`feed-card group ${config.accent}`}
      style={{ animationDelay: `${index * 110}ms` }}
    >
      {/* ═══════════════════════════════════════════════════════
          MOBILE LAYOUT (2-column grid friendly)
          ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:hidden">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-800/40">
          <Image
            src={feed.image}
            alt={feed.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="50vw"
            priority={index === 0}
          />

          {/* Category Badge Overlay */}
          <span
            className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${config.badge}`}
          >
            <span aria-hidden="true">{config.icon}</span>
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-2.5">
          <h2 className="line-clamp-2 text-xs font-semibold leading-snug transition-colors group-hover:text-blue-600 dark:group-hover:text-cyan-200">
            {feed.title}
          </h2>

          <div className="mt-auto flex items-center justify-between gap-1 pt-2">
            <span className="text-[9px] text-slate-500 dark:text-slate-500">
              <RelativeTime timestamp={feed.createdAt} />
            </span>
            <span className="text-[9px] font-semibold text-blue-600 transition-colors group-hover:text-blue-700 dark:text-cyan-400 dark:group-hover:text-cyan-300">
              Baca
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          DESKTOP LAYOUT (Horizontal with image right)
          ═══════════════════════════════════════════════════════ */}
      <div className="hidden md:flex items-stretch gap-4 p-4">
        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between">
          {/* Top: Badge & Meta */}
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-bold ${config.badge}`}
              >
                <span className="text-sm" aria-hidden="true">
                  {config.icon}
                </span>
                {feed.category}
              </span>

              <span className="text-slate-400 dark:text-slate-600">•</span>

              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <RelativeTime timestamp={feed.createdAt} />
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-3 line-clamp-2 text-base font-bold leading-tight transition-colors group-hover:text-blue-600 dark:group-hover:text-cyan-300 md:text-lg">
              {feed.title}
            </h2>

            {/* Inti Cepat Box */}
            <div className="inti-cepat-box">
              <div className="mb-1.5 flex items-center gap-1.5">
                <svg
                  className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-xs font-semibold text-blue-700 dark:text-cyan-300">
                  Inti Cepat
                </span>
              </div>
              <p className="line-clamp-2 text-sm leading-relaxed">
                {feed.takeaway}
              </p>
            </div>
          </div>

          {/* Bottom: CTA */}
          <div className="mt-3 flex items-center gap-2 text-xs">
            <svg
              className="h-3.5 w-3.5 text-blue-600/80 dark:text-cyan-400/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="font-medium text-blue-600 transition-colors group-hover:text-blue-700 dark:text-cyan-400 dark:group-hover:text-cyan-300">
              Buka Chat Q&A
            </span>
            <svg
              className="h-3 w-3 text-blue-600 transition-transform group-hover:translate-x-1 dark:text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Image Thumbnail */}
        <div className="relative h-32 w-32 shrink-0 self-center overflow-hidden rounded-lg bg-slate-100 shadow-md dark:bg-slate-800/40 md:h-36 md:w-36">
          <Image
            src={feed.image}
            alt={feed.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 128px, 144px"
            priority={index === 0}
          />
        </div>
      </div>
    </Link>
  );
}
