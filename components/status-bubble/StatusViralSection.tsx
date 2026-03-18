"use client";

import { createPortal } from "react-dom";
import { useMemo, useRef, useEffect, useState } from "react";
import { StoryBubble } from "@/components/status-bubble/StoryBubble";
import { EmptyStoryOverlay } from "./EmptyStoryOverlay";
import type { StatusFeedItem, StatusStory } from "./types";
import { StoryViewerOverlay } from "./StoryViewerOverlay";

type StatusViralSectionProps = {
  stories: StatusStory[];
  feeds: StatusFeedItem[];
  standalone?: boolean;
};

export function StatusViralSection({
  stories,
  feeds,
  standalone = false,
}: StatusViralSectionProps) {
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

  const selectedStory = useMemo(
    () => stories.find((s) => s.id === selectedStoryId) || null,
    [selectedStoryId, stories]
  );

  const feedsByStory = useMemo(() => {
    const map = new Map<number, StatusFeedItem[]>();

    for (const feed of feeds) {
      if (feed.storyId === null) continue;
      const items = map.get(feed.storyId) ?? [];
      items.push(feed);
      map.set(feed.storyId, items);
    }

    for (const [storyId, items] of map.entries()) {
      items.sort((a, b) => b.id - a.id);
      map.set(storyId, items);
    }

    return map;
  }, [feeds]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll horizontally with mouse wheel on desktop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY * 1.5, behavior: "smooth" });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const portalTarget = typeof document === "undefined" ? null : document.body;

  // Render Portal Content
  const renderPortal = () => {
    if (!portalTarget || selectedStoryId === null) return null;
    const storyFeeds = feedsByStory.get(selectedStoryId) ?? [];

    if (!selectedStory) {
      return createPortal(
        <EmptyStoryOverlay onClose={() => setSelectedStoryId(null)} />,
        portalTarget
      );
    }

    if (storyFeeds.length === 0) {
      return createPortal(
        <EmptyStoryOverlay onClose={() => setSelectedStoryId(null)} />,
        portalTarget
      );
    }

    return createPortal(
      <StoryViewerOverlay
        selectedStory={selectedStory}
        feeds={storyFeeds}
        onClose={() => setSelectedStoryId(null)}
      />,
      portalTarget
    );
  };

  return (
    <>
      <div
        className={standalone ? "" : "mt-6 border-t border-slate-200 pt-5 dark:border-slate-800"}
      >
        <div className="mb-2 flex items-center justify-between sm:mb-3">
          <h2
            className="text-sm font-semibold"
          >
            Status Viral Hari Ini
          </h2>
          <span
            className="text-xs"
            style={{ color: "inherit" }}
          >
            klik status
          </span>
        </div>

        {/* Render List Story Bubble */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex cursor-grab gap-2 overflow-x-auto pb-1 active:cursor-grabbing sm:gap-3 sm:pb-2"
        >
          {stories.map((story) => (
            <StoryBubble
              key={story.id}
              story={story}
              coverImage={story.image}
              active={selectedStory?.id === story.id}
              onClick={() => setSelectedStoryId(story.id)}
            />
          ))}
        </div>
      </div>

      {/* Render Modal/Overlay (Jika ada story yang dipilih) */}
      {renderPortal()}
    </>
  );
}
