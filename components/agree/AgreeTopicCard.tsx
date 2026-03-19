import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CarFront,
  Cpu,
  FolderTree,
  Layers3,
  MessageSquareMore,
  PlayCircle,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";

import type { AgreeTopicIcon, AgreeTopicSummary } from "@/types/agree";

type AgreeTopicCardProps = {
  topic: AgreeTopicSummary;
};

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

export function AgreeTopicCard({ topic }: AgreeTopicCardProps) {
  const TopicIcon = topicIcons[topic.icon] ?? Cpu;

  return (
    <Link
      href={`/setelah-klik-agree/${topic.slug}`}
      className="group rounded-[28px] border border-cyan-300/60 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(224,247,255,0.94))] p-5 shadow-[0_18px_40px_rgba(17,24,39,0.08)] transition hover:-translate-y-1 hover:border-cyan-400 dark:border-cyan-400/30 dark:bg-[linear-gradient(145deg,rgba(10,19,45,0.98),rgba(8,42,63,0.92))]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-white">
          <Sparkles className="h-3.5 w-3.5" />
          {topic.eyebrow}
        </div>
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/85 text-cyan-700 shadow-sm dark:bg-slate-900/70 dark:text-cyan-200">
          <TopicIcon className="h-5 w-5" />
        </span>
      </div>

      <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
        {topic.name}
      </h2>
      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {topic.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 shadow-sm dark:bg-slate-900/70">
          <FolderTree className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-300" />
          {topic.companyCount} company
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 shadow-sm dark:bg-slate-900/70">
          <Layers3 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-300" />
          {topic.documentCount} document
        </span>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition group-hover:gap-3 dark:text-cyan-200">
        Buka topik
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
