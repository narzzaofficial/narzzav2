import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AgreeAppCard } from "@/components/agree/AgreeAppCard";
import { getAgreeCompanyPageData, getAllAgreeDocumentPaths } from "@/lib/setelah-klik-agree";

export const revalidate = 3600;

type CompanyPageProps = {
  params: Promise<{ topic: string; company: string }>;
};

export async function generateStaticParams() {
  const paths = await getAllAgreeDocumentPaths();
  return Array.from(
    new Map(paths.map((item) => [`${item.topic}/${item.company}`, item])).values()
  ).map(({ topic, company }) => ({ topic, company }));
}

export async function generateMetadata({ params }: CompanyPageProps) {
  const { topic, company } = await params;
  const data = await getAgreeCompanyPageData(topic, company);
  return data
    ? { title: `${data.name} - Setelah Klik Agree`, description: data.description }
    : { title: "Company Tidak Ditemukan" };
}

export default async function AgreeCompanyPage({ params }: CompanyPageProps) {
  const { topic, company } = await params;
  const data = await getAgreeCompanyPageData(topic, company);

  if (!data) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <header className="rounded-[32px] border border-slate-300/70 bg-white/90 p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-500 dark:text-sky-300">
          Company
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{data.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          {data.description}
        </p>
      </header>

      <Link
        href={`/setelah-klik-agree/${data.topicData.slug}`}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-300/70 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kembali
      </Link>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">App milik {data.name}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {data.apps.map((app) => (
            <AgreeAppCard
              key={app.id}
              app={app}
              href={`/setelah-klik-agree/${data.topicData.slug}/${data.slug}/${app.slug}`}
            />
          ))}
        </div>
      </section>
    </section>
  );
}
