import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AgreeAppCard } from "@/components/agree/AgreeAppCard";
import { AgreeCompanyCard } from "@/components/agree/AgreeCompanyCard";
import { AgreeDocumentCard } from "@/components/agree/AgreeDocumentCard";
import { absoluteUrl } from "@/lib/site";
import { getAgreeTopicPageData, getAgreeTopics } from "@/lib/setelah-klik-agree";

export const revalidate = 3600;

type TopicPageProps = {
  params: Promise<{ topic: string }>;
};

export async function generateStaticParams() {
  const topics = await getAgreeTopics();
  return topics.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topic } = await params;
  const data = await getAgreeTopicPageData(topic);
  return data
    ? {
        title: `${data.topic.name} - Setelah Klik Agree`,
        description: data.topic.description,
        alternates: {
          canonical: `/setelah-klik-agree/${data.topic.slug}`,
        },
        openGraph: {
          title: `${data.topic.name} - Setelah Klik Agree`,
          description: data.topic.description,
          url: `/setelah-klik-agree/${data.topic.slug}`,
          type: "website",
        },
      }
    : { title: "Topik Tidak Ditemukan" };
}

export default async function AgreeTopicPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const data = await getAgreeTopicPageData(topic);

  if (!data) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: data.topic.name,
            description: data.topic.description,
            url: absoluteUrl(`/setelah-klik-agree/${data.topic.slug}`),
          }),
        }}
      />
      <header className="rounded-[32px] border border-slate-300/70 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-500 dark:text-cyan-300">
          {data.topic.eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{data.topic.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          {data.topic.description}
        </p>
      </header>

      <Link
        href="/setelah-klik-agree"
        className="inline-flex items-center gap-1 rounded-xl border border-slate-300/70 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kembali
      </Link>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Company dalam topik ini</h2>
        <div className="grid gap-4">
          {data.companies.map((company) => (
            <AgreeCompanyCard key={company.id} company={company} topicSlug={data.topic.slug} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">App yang sudah dibedah</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {data.apps.map((app) => {
            const company = data.companies.find((item) => item.id === app.companyId)!;
            return (
              <AgreeAppCard
                key={app.id}
                app={app}
                href={`/setelah-klik-agree/${data.topic.slug}/${company.slug}/${app.slug}`}
              />
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dokumen terbaru</h2>
        <div className="grid gap-4">
          {data.latestDocuments.map((document) => (
            <AgreeDocumentCard
              key={document.id}
              document={document}
              href={`/setelah-klik-agree/${document.topic.slug}/${document.company.slug}/${document.app.slug}/${document.slug}`}
            />
          ))}
        </div>
      </section>
    </section>
  );
}
