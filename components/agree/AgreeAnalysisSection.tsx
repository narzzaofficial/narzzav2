import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileWarning,
  Lightbulb,
  Shield,
  Sparkles,
} from "lucide-react";

import type { AgreeAnalysis } from "@/types/agree";

type AgreeAnalysisSectionProps = {
  analysis: AgreeAnalysis;
};

const sections = [
  { key: "summary", title: "Ringkasan Cepat", icon: Sparkles },
  { key: "agreedWithoutRealizing", title: "Yang Kamu Setujui Tanpa Sadar", icon: CheckCircle2 },
  { key: "surprisingPoints", title: "Yang Bikin Kaget", icon: Eye },
  { key: "dataCollected", title: "Data yang Mereka Ambil", icon: FileWarning },
  { key: "platformRights", title: "Hak Mereka atas Akunmu", icon: Shield },
  { key: "risks", title: "Kemungkinan Risiko / Dampak", icon: AlertTriangle },
  { key: "tips", title: "Tips Buat User", icon: Lightbulb },
] as const;

export function AgreeAnalysisSection({ analysis }: AgreeAnalysisSectionProps) {
  return (
    <section className="read-card p-5 md:p-7">
      <div className="max-w-3xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-fuchsia-500 dark:text-fuchsia-300">
          Analisis Penting
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Yang Perlu Kamu Tahu Sebelum Klik Agree
        </h2>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {sections.map(({ key, title, icon: Icon }) => (
          <section
            key={key}
            className="rounded-[26px] border border-slate-300/70 bg-white/80 p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/50"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
            </div>

            <ul className="mt-4 space-y-2.5 text-sm leading-7 text-slate-700 dark:text-slate-200">
              {analysis[key].map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-950/40"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
