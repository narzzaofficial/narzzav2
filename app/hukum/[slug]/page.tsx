import type { Metadata } from "next";
import Link from "next/link";
import { ScrollText, ShieldCheck } from "lucide-react";

import { RelativeTime } from "@/components/frontend/RelativeTime";
import { LawMarkdown } from "@/components/hukum/LawMarkdown";
import { ReadDetailToolbar } from "@/components/reads/read-detail-toolbar";
import { getAllLaws, getLawBySlug } from "@/lib/laws";

export const dynamic = "force-static";
export const revalidate = 3600;

type LawDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function formatLawNumber(number: string, year: number) {
  const text = number.trim();
  const match = text.match(/^(.+?)\s+(\d+[A-Za-z-]*)$/);
  if (!match) return `No. ${text} Tahun ${year}`;
  const code = match[1].trim();
  const serial = match[2].trim();
  return `${code} No. ${serial} Tahun ${year}`;
}

export async function generateStaticParams() {
  const allLaws = await getAllLaws();
  return allLaws.filter((law) => Boolean(law.slug)).map((law) => ({ slug: law.slug }));
}

export async function generateMetadata({
  params,
}: LawDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const law = await getLawBySlug(slug);

  if (!law) {
    return {
      title: "Dokumen Hukum Tidak Ditemukan",
      description: "Dokumen hukum tidak ditemukan.",
    };
  }

  return {
    title: `${law.number}/${law.year} - ${law.title}`,
    description: law.summary || law.title,
    alternates: {
      canonical: `/hukum/${law.slug}`,
    },
    openGraph: {
      title: `${law.number}/${law.year} - ${law.title}`,
      description: law.summary || law.title,
      url: `/hukum/${law.slug}`,
      type: "article",
    },
  };
}

export default async function LawDetailPage({ params }: LawDetailPageProps) {
  const { slug } = await params;
  const law = await getLawBySlug(slug);

  if (!law) {
    return <div>Content not found</div>;
  }

  return (
    <article className="mx-auto w-full max-w-[960px] space-y-4">
      <ReadDetailToolbar
        category={law.category}
        slug={law.slug}
        pathPrefix="/hukum"
        shareTitle={`${law.number}/${law.year} - ${law.title}`}
        shareText="Baca dokumen hukum ini di Narzza"
        labelPrefix="Label Hukum"
      />

      <header className="read-card p-5 md:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-500 dark:text-sky-300">
          Hukum Indonesia
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">
          {law.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="rounded-full border border-sky-300/60 bg-sky-100/70 px-3 py-1 font-semibold text-sky-800 dark:border-sky-400/40 dark:bg-sky-500/10 dark:text-sky-200">
            {law.category}
          </span>
          <span className="rounded-full border border-slate-300/70 bg-white/80 px-2.5 py-1 font-semibold text-slate-700 dark:border-slate-600/70 dark:bg-slate-800/80 dark:text-slate-200">
            {formatLawNumber(law.number, law.year)}
          </span>
          <span>-</span>
          <RelativeTime timestamp={law.promulgatedAt} />
          <span>-</span>
          <span>{law.status}</span>
        </div>
      </header>

      <section className="read-card p-5 md:p-7">
        <div className="rounded-xl border border-slate-300/70 bg-white/70 p-4 dark:border-slate-700/60 dark:bg-slate-900/35 md:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/70 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
              Dokumen Resmi
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-slate-600 dark:text-slate-300 md:h-6 md:w-6" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">
              Naskah Original
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Teks resmi dengan struktur dan redaksi sebagaimana dokumen sumber.
          </p>

          <div className="mt-3">
            <span className="inline-flex items-center rounded-full border border-slate-300/70 bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600/70 dark:bg-slate-800/80 dark:text-slate-200">
              {formatLawNumber(law.number, law.year)}
            </span>
          </div>

          <div className="mt-4 text-base leading-7 text-slate-700 dark:text-slate-200 md:text-[17px]">
            <LawMarkdown content={law.originalText} />
          </div>
        </div>
      </section>

      <section className="read-card p-5 md:p-7">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Explanation (Q&A)
        </h2>
        <div className="mt-3 flex flex-col gap-3">
          {law.explanationLines.map((line, index) => (
            <div
              key={index}
              className={`flex ${line.role === "q" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  line.role === "q" ? "chat-bubble-q" : "chat-bubble-a"
                }`}
              >
                <span className="mr-1 font-bold">
                  {line.role === "q" ? "Q:" : "A:"}
                </span>
                {line.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="read-card p-5 md:p-7">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Sumber
        </h2>
        <div className="mt-3 space-y-2 text-sm">
          <p className="text-slate-700 dark:text-slate-200">
            Instansi: {law.source.institution}
          </p>
          <Link
            href={law.source.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-cyan-700 underline underline-offset-2 dark:text-cyan-300"
          >
            Naskah original
          </Link>
          {law.source.pdfUrl ? (
            <Link
              href={law.source.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-cyan-700 underline underline-offset-2 dark:text-cyan-300"
            >
              PDF resmi
            </Link>
          ) : null}
        </div>
      </section>
    </article>
  );
}
