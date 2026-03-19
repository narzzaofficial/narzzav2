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
      ? "text-slate-700 dark:text-slate-100"
      : "text-slate-700 dark:text-slate-200";

  return (
    <div
      className={`markdown-content text-sm leading-7 ${textToneClass} [&_a]:text-sky-700 [&_a]:underline [&_a]:decoration-sky-700/40 [&_a]:underline-offset-2 [&_a]:hover:text-sky-800 dark:[&_a]:text-cyan-300 dark:[&_a]:decoration-cyan-300/40 dark:[&_a]:hover:text-cyan-200 [&_blockquote]:border-l-2 [&_blockquote]:border-slate-300 [&_blockquote]:pl-3 [&_blockquote]:italic dark:[&_blockquote]:border-slate-600 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[12px] dark:[&_code]:bg-slate-800/70 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_p]:leading-8 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

