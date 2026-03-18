import Image from "next/image";
import type { Feed, FeedComment } from "@/types/content";

import { ChatImage } from "@/components/chats/chat-image";
import { RelativeTime } from "../frontend/RelativeTime";
import { ReadDetailToolbar } from "./read-detail-toolbar";
import { ReadCommentsSection } from "./read-comments-section";

type ReadDetailProps = {
  feed: Feed;
  comments: FeedComment[];
};

export function ReadDetail({ feed, comments }: ReadDetailProps) {
  return (
    <article className="mx-auto w-full max-w-215 px-1 pb-1 md:px-2 md:pb-2">
      <ReadDetailToolbar category={feed.category} slug={feed.slug} />

      <div className="read-card">
        <div className="relative h-56 w-full md:h-72">
          <Image
            src={feed.image}
            alt={feed.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 900px"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>

        <div className="p-5 md:p-7">
          <header className="mb-5 border-b border-slate-300/70 pb-5 dark:border-slate-700/70">
            <h1 className="read-title">{feed.title}</h1>
            <div className="read-meta mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {feed.author || "Narzza Media Digital"}
              </span>
              <span aria-hidden="true">.</span>
              <time dateTime={new Date(feed.createdAt).toISOString()}>
                <RelativeTime timestamp={feed.createdAt} />
              </time>
            </div>
          </header>

          <div className="flex flex-col gap-3">
            {feed.lines.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className={`flex ${line.role === "q" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`read-content max-w-[92%] rounded-2xl px-4 py-3 md:max-w-[86%] ${
                    line.role === "q" ? "chat-bubble-q" : "chat-bubble-a"
                  }`}
                >
                  <span className="mr-1.5 text-[11px] font-bold tracking-wide">
                    {line.role === "q" ? "Q: " : "A: "}
                  </span>
                  {line.text}
                  {line.image ? <ChatImage src={line.image} /> : null}
                </div>
              </div>
            ))}
          </div>

          {feed.source ? (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-300/70 bg-slate-100/70 px-4 py-3 dark:border-slate-700/50 dark:bg-slate-800/30">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Sumber:
              </span>
              <a
                href={feed.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-700 underline decoration-cyan-700/30 underline-offset-2 transition hover:text-cyan-800 hover:decoration-cyan-800/50 dark:text-cyan-300 dark:hover:text-cyan-200"
              >
                {feed.source.title}
              </a>
            </div>
          ) : null}

          <div className="mt-5 rounded-xl border border-amber-300/60 bg-amber-100/70 px-4 py-3 text-sm text-amber-900 dark:border-amber-300/35 dark:bg-amber-400/10 dark:text-amber-100">
            <strong>Inti cepat:</strong> {feed.takeaway}
          </div>
        </div>
      </div>

      <ReadCommentsSection
        feedId={feed.id}
        feedSlug={feed.slug}
        initialComments={comments}
      />
    </article>
  );
}
