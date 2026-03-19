import Link from "next/link";
import {
  BriefcaseBusiness,
  Building2,
  CarFront,
  Cpu,
  FileText,
  MessageSquareMore,
  PlayCircle,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";

import { AgreeAppIcon } from "@/components/agree/AgreeAppIcon";
import { getAgreeLandingData } from "@/lib/setelah-klik-agree";
import type { AgreeTopicIcon } from "@/types/agree";

export const revalidate = 3600;

export const metadata = {
  title: "Setelah Klik Agree",
  description:
    "Bedah Terms of Service, Privacy Policy, dan kebijakan digital dengan bahasa yang lebih gampang dipahami.",
};

const latestEntryLabels = {
  company: "Company Baru",
  app: "App Baru",
  document: "Konten Baru",
} as const;

const latestEntryIcons = {
  company: Building2,
  app: null,
  document: FileText,
} as const;

const topicIcons: Record<AgreeTopicIcon, typeof Cpu> = {
  cpu: Cpu,
  messages: MessageSquareMore,
  wallet: Wallet,
  store: Store,
  briefcase: BriefcaseBusiness,
  sparkles: Sparkles,
  play: PlayCircle,
  car: CarFront,
};

export default async function SetelahKlikAgreeLandingPage() {
  const data = await getAgreeLandingData();

  return (
    <section className="space-y-7 md:space-y-9">
      <header className="glass-panel">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-400 dark:text-sky-300">
          Setelah Klik Agree
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-3xl">
          Bedah Terms of Service & Privacy Policy
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
          Pilih topik untuk melihat company, aplikasi populer, dan dokumen TOS
          yang sudah dibedah dengan gaya yang lebih mudah dipahami.
        </p>
      </header>

      <section className="space-y-4 pt-1 md:pt-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-sky-400 dark:text-sky-300">
            Topik
          </p>
          <h2 className="mt-1 text-[1.65rem] font-medium leading-tight text-slate-800 dark:text-slate-100 md:text-[1.5rem]">
            Kategori ekosistem digital
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.topics.map((topic) => {
            const TopicIcon = topicIcons[topic.icon] ?? Cpu;
            return (
              <Link
                key={topic.slug}
                href={`/setelah-klik-agree/${topic.slug}`}
                className="group rounded-xl border border-slate-300/70 bg-white/80 px-4 py-4 text-sm text-slate-800 transition hover:-translate-y-0.5 hover:border-sky-400 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-cyan-400/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-base font-medium leading-tight">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                        <TopicIcon className="h-4 w-4" />
                      </span>
                      <span>{topic.name}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {topic.companyCount} company - {topic.documentCount} document
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 pt-1 md:pt-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-sky-400 dark:text-sky-300">
            Aplikasi Populer
          </p>
          <h2 className="mt-1 text-[1.65rem] font-medium leading-tight text-slate-800 dark:text-slate-100 md:text-[1.5rem]">
            App yang paling sering dicari user
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.popularApps.map(({ app, company, topic }) => {
            return (
              <Link
                key={app.id}
                href={`/setelah-klik-agree/${topic.slug}/${company.slug}/${app.slug}`}
                className="group rounded-xl border border-slate-300/70 bg-white/80 px-4 py-4 text-sm transition hover:-translate-y-0.5 hover:border-sky-400 dark:border-slate-700/60 dark:bg-slate-900/60 dark:hover:border-cyan-400/60"
              >
                <div className="flex items-center gap-2.5">
                  <AgreeAppIcon imageUrl={app.icon} appName={app.name} className="h-7 w-7 shrink-0" />
                  <div className="text-[15px] font-medium text-slate-800 dark:text-slate-100">
                    {app.name}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 pt-1 md:pt-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-sky-400 dark:text-sky-300">
            Terbaru Ditambahkan
          </p>
          <h2 className="mt-1 text-[1.65rem] font-medium leading-tight text-slate-800 dark:text-slate-100 md:text-[1.5rem]">
            Company, app, atau konten TOS yang baru masuk
          </h2>
        </div>

        <div className="grid gap-4">
          {data.latestEntries.map((entry) => {
            const Icon = latestEntryIcons[entry.type];
            return (
              <Link
                key={`${entry.type}-${entry.id}`}
                href={entry.href}
                className="group rounded-xl border border-slate-300/70 bg-white/80 px-4 py-4 text-sm transition hover:-translate-y-0.5 hover:border-sky-400 dark:border-slate-700/60 dark:bg-slate-900/60 dark:hover:border-cyan-400/60"
              >
                <div className="flex items-start gap-3">
                  {entry.type === "app" ? (
                    <AgreeAppIcon imageUrl={entry.appIcon} appName={entry.title} className="h-7 w-7 shrink-0" />
                  ) : (
                    Icon && <Icon className="mt-1 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" />
                  )}
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {latestEntryLabels[entry.type]}
                    </div>
                    <div className="mt-1 text-[15px] font-medium text-slate-800 dark:text-slate-100">
                      {entry.title}
                    </div>
                    <div className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                      {entry.description}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </section>
  );
}
