"use client";

import Image from "next/image";
import type { StatusStory } from "./types";

type StoryBubbleProps = {
  story: StatusStory;
  coverImage?: string;
  active?: boolean;
  onClick?: () => void;
};

export function StoryBubble({
  story,
  coverImage,
  active = false,
  onClick,
}: StoryBubbleProps) {
  const hasImage = Boolean(coverImage);
  const palette = story.palette || "from-sky-500 to-emerald-500";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-20 shrink-0 flex-col items-center gap-2 rounded-xl p-1 text-left transition-colors",
        active ? "bg-sky-500/10" : "hover:bg-white/60 dark:hover:bg-white/5",
      ].join(" ")}
    >
      <div
        className={[
          "grid h-16 w-16 place-items-center rounded-full p-0.5",
          story.viral
            ? "bg-gradient-to-br from-emerald-400 via-sky-400 to-orange-400"
            : "bg-slate-200 dark:bg-slate-700/70",
        ].join(" ")}
      >
        <div
          className={[
            "relative grid h-14 w-14 place-items-center overflow-hidden rounded-full",
            `bg-gradient-to-br ${palette}`,
            "text-xs font-semibold text-white",
          ].join(" ")}
        >
          {hasImage ? (
            <Image
              src={coverImage!}
              alt={story.name}
              width={56}
              height={56}
              sizes="56px"
              className="absolute inset-0 h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold leading-none tracking-tight">
              {story.label}
            </span>
          )}
        </div>
      </div>
      <p
        className="w-full truncate text-center text-xs"
        style={{ color: "inherit" }}
      >
        {story.name}
      </p>
      <span
        className="rounded-full border border-slate-200 bg-white/60 px-2 py-0.5 text-[10px] text-slate-600 dark:border-slate-700/60 dark:bg-slate-900/30 dark:text-slate-300"
      >
        {story.type}
      </span>
    </button>
  );
}
