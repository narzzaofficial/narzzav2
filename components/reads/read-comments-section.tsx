"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FeedComment } from "@/types/content";
import { RelativeTime } from "@/components/frontend/RelativeTime";

type ReadCommentsSectionProps = {
  feedId: number;
  feedSlug: string;
  initialComments: FeedComment[];
};

export function ReadCommentsSection({
  feedId,
  feedSlug,
  initialComments,
}: ReadCommentsSectionProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const cleanedName = name.trim();
    const cleanedMessage = message.trim();

    if (cleanedName.length < 2) {
      setError("Nama minimal 2 karakter.");
      return;
    }

    if (cleanedMessage.length < 2) {
      setError("Komentar minimal 2 karakter.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedId,
          feedSlug,
          name: cleanedName,
          message: cleanedMessage,
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setError(payload?.error || "Gagal mengirim komentar.");
        return;
      }

      setComments((prev) => [payload as FeedComment, ...prev]);
      setMessage("");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan saat mengirim komentar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-6 rounded-2xl border border-slate-300/70 bg-white/85 p-4 dark:border-slate-700/60 dark:bg-slate-900/65">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Komentar
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kamu"
          className="w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100"
          maxLength={60}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis komentar..."
          className="min-h-24 w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100"
          maxLength={1200}
        />
        {error ? (
          <p className="text-xs text-red-600 dark:text-red-300">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-600 dark:hover:bg-cyan-500"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
        </button>
      </form>

      <div
        className={`mt-5 space-y-3 ${comments.length > 4 ? "max-h-[420px] overflow-y-auto pr-1" : ""}`}
      >
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Belum ada komentar.
          </p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-xl border border-slate-300/70 bg-slate-50/80 p-3 dark:border-slate-700/60 dark:bg-slate-800/50"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {comment.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <RelativeTime timestamp={comment.createdAt} />
                </p>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {comment.message}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
