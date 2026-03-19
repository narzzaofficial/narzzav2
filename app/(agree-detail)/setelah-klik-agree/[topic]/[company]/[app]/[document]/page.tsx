import { notFound } from "next/navigation";

import { AgreeAnalysisSection } from "@/components/agree/AgreeAnalysisSection";
import { AgreeMarkdownContent } from "@/components/agree/AgreeMarkdownContent";
import { AgreeQaSection } from "@/components/agree/AgreeQaSection";
import { ReadDetailToolbar } from "@/components/reads/read-detail-toolbar";
import { getAgreeDocumentDetail, getAllAgreeDocumentPaths } from "@/lib/setelah-klik-agree";

export const revalidate = 3600;

type DocumentPageProps = {
  params: Promise<{ topic: string; company: string; app: string; document: string }>;
};

export async function generateStaticParams() {
  return getAllAgreeDocumentPaths();
}

export async function generateMetadata({ params }: DocumentPageProps) {
  const { topic, company, app, document } = await params;
  const detail = await getAgreeDocumentDetail(topic, company, app, document);

  if (!detail) {
    return { title: "Dokumen Tidak Ditemukan" };
  }

  return {
    title: `${detail.app.name} ${detail.title} - Setelah Klik Agree`,
    description: detail.dek,
  };
}

export default async function AgreeDocumentDetailPage({ params }: DocumentPageProps) {
  const { topic, company, app, document } = await params;
  const detail = await getAgreeDocumentDetail(topic, company, app, document);

  if (!detail) {
    notFound();
  }

  const sharePath = `/setelah-klik-agree/${detail.topic.slug}/${detail.company.slug}/${detail.app.slug}/${detail.slug}`;

  return (
    <article className="mx-auto w-full max-w-5xl space-y-3 px-2 py-2 md:space-y-4 md:px-3 md:py-3">
      <ReadDetailToolbar
        category={detail.app.name}
        slug={detail.slug}
        pathPrefix="/setelah-klik-agree"
        sharePath={sharePath}
        shareTitle={`${detail.app.name} ${detail.title} - Setelah Klik Agree`}
        shareText={detail.dek}
        labelPrefix="Setelah Klik Agree"
      />

      <section className="read-card p-5 md:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-500 dark:text-sky-300">
          {detail.type.replaceAll("-", " ")}
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {detail.app.name} - {detail.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          {detail.dek}
        </p>
      </section>

      <section className="read-card p-5 md:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-500 dark:text-cyan-300">
          Teks Asli
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Versi Original (English)
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-300/70 bg-slate-50/90 p-4 dark:border-slate-700/60 dark:bg-slate-950/40">
          <AgreeMarkdownContent content={detail.tosOriginal} />
        </div>
      </section>

      {detail.tosTranslation?.trim() ? (
        <section className="read-card p-5 md:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-500 dark:text-emerald-300">
            Terjemahan
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Versi Indonesia
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-emerald-300/60 bg-emerald-50/70 p-4 dark:border-emerald-400/30 dark:bg-emerald-400/10">
            <AgreeMarkdownContent content={detail.tosTranslation} tone="translation" />
          </div>
        </section>
      ) : null}

      <AgreeAnalysisSection analysis={detail.analysis} />
      <AgreeQaSection content={detail.content} />
    </article>
  );
}
