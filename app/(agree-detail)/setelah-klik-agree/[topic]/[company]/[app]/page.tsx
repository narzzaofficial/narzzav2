import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AgreeDocumentCard } from "@/components/agree/AgreeDocumentCard";
import { getAgreeAppPageData, getAllAgreeDocumentPaths } from "@/lib/setelah-klik-agree";

export const revalidate = 3600;

type AppPageProps = {
  params: Promise<{ topic: string; company: string; app: string }>;
};

export async function generateStaticParams() {
  const paths = await getAllAgreeDocumentPaths();
  return Array.from(
    new Map(paths.map((item) => [`${item.topic}/${item.company}/${item.app}`, item])).values()
  ).map(({ topic, company, app }) => ({ topic, company, app }));
}

export async function generateMetadata({ params }: AppPageProps) {
  const { topic, company, app } = await params;
  const data = await getAgreeAppPageData(topic, company, app);
  return data
    ? { title: `${data.name} - Setelah Klik Agree`, description: data.description }
    : { title: "App Tidak Ditemukan" };
}

export default async function AgreeAppPage({ params }: AppPageProps) {
  const { topic, company, app } = await params;
  const data = await getAgreeAppPageData(topic, company, app);

  if (!data) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <header className="rounded-[32px] border border-slate-300/70 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-500 dark:text-amber-300">
          App / Service
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{data.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 dark:text-slate-200">
          {data.description}
        </p>
      </header>

      <Link
        href={`/setelah-klik-agree/${data.topicData.slug}/${data.company.slug}`}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-300/70 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kembali
      </Link>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dokumen yang tersedia</h2>
        <div className="grid gap-4">
          {data.documents.map((document) => (
            <AgreeDocumentCard
              key={document.id}
              document={document}
              href={`/setelah-klik-agree/${data.topicData.slug}/${data.company.slug}/${data.slug}/${document.slug}`}
            />
          ))}
        </div>
      </section>
    </section>
  );
}
