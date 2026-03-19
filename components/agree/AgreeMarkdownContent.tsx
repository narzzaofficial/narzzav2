import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AgreeMarkdownContentProps = {
  content: string;
  tone?: "default" | "translation";
};

export function AgreeMarkdownContent({
  content,
  tone = "default",
}: AgreeMarkdownContentProps) {
  const textToneClass =
    tone === "translation"
      ? "text-slate-800 dark:text-slate-100"
      : "text-slate-800 dark:text-slate-100";

  const surfaceToneClass =
    tone === "translation"
      ? "border-emerald-300/80 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-[0_18px_40px_-28px_rgba(16,185,129,0.4)] dark:border-emerald-500/25 dark:bg-gradient-to-br dark:from-emerald-950/40 dark:via-slate-950/70 dark:to-teal-950/30"
      : "border-sky-300/80 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-[0_18px_40px_-28px_rgba(14,165,233,0.38)] dark:border-sky-500/25 dark:bg-gradient-to-br dark:from-sky-950/35 dark:via-slate-950/70 dark:to-blue-950/30";

  return (
    <div
      className={`markdown-content rounded-[1.75rem] border px-5 py-5 text-[15px] leading-8 sm:px-6 sm:py-6 ${surfaceToneClass} ${textToneClass} [&_a]:font-medium [&_a]:text-sky-700 [&_a]:underline [&_a]:decoration-sky-700/35 [&_a]:underline-offset-3 [&_a]:hover:text-sky-800 dark:[&_a]:text-cyan-300 dark:[&_a]:decoration-cyan-300/35 dark:[&_a]:hover:text-cyan-200 [&_blockquote]:my-5 [&_blockquote]:border-l-[3px] [&_blockquote]:border-slate-300 [&_blockquote]:bg-white/60 [&_blockquote]:py-1 [&_blockquote]:pl-4 [&_blockquote]:pr-3 [&_blockquote]:italic dark:[&_blockquote]:border-slate-600 dark:[&_blockquote]:bg-slate-900/50 [&_code]:rounded-md [&_code]:bg-white/75 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[12px] [&_code]:font-medium dark:[&_code]:bg-slate-800/80 [&_h1]:mb-4 [&_h1]:text-[1.8rem] [&_h1]:font-semibold [&_h1]:leading-tight [&_h2]:mb-4 [&_h2]:text-[1.45rem] [&_h2]:font-semibold [&_h2]:leading-tight [&_h3]:mb-3 [&_h3]:text-[1.15rem] [&_h3]:font-semibold [&_li]:mb-1.5 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-5 [&_p]:leading-8 [&_strong]:font-semibold [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-5`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
