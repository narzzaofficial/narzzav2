import type { ChatLine } from "@/types/content";

type AgreeQaSectionProps = {
  content: ChatLine[];
};

export function AgreeQaSection({ content }: AgreeQaSectionProps) {
  return (
    <section className="read-card p-5 md:p-7">
      <div className="max-w-3xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-500 dark:text-sky-300">
          Q&A Santai
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Versi Obrolan Biar Gampang Dicerna
        </h2>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {content.map((line, index) => (
          <div
            key={`${line.role}-${index}`}
            className={`flex ${line.role === "q" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:max-w-[86%] ${
                line.role === "q" ? "chat-bubble-q" : "chat-bubble-a"
              }`}
            >
              <span className="mr-1 font-bold">{line.role === "q" ? "Q:" : "A:"}</span>
              {line.text}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
