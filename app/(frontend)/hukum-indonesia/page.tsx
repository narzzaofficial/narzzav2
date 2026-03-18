import Link from "next/link";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  CarFront,
  Cpu,
  Handshake,
  Landmark,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";

import { HUKUM_CATEGORIES } from "@/lib/law-categories";
import type { HukumCategory } from "@/types/content";

export const revalidate = 3600;

const categoryIcons: Record<HukumCategory, ComponentType<{ className?: string }>> = {
  Pidana: ShieldAlert,
  Perdata: Scale,
  Ketenagakerjaan: BriefcaseBusiness,
  Bisnis: Landmark,
  Pajak: BadgeDollarSign,
  Pertanahan: ShieldCheck,
  Keluarga: Users,
  Konsumen: Handshake,
  Siber: Cpu,
  LaluLintas: CarFront,
};

export default function HukumIndonesiaHomePage() {
  return (
    <section className="space-y-4">
      <header className="glass-panel">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-400 dark:text-sky-300">
          Hukum Indonesia
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Kategori Dokumen Hukum
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Pilih kategori untuk menampilkan dokumen hukum dengan pagination dan
          cache ISR.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {HUKUM_CATEGORIES.map((category) => {
          const Icon = categoryIcons[category];
          return (
            <Link
              key={category}
              href={`/hukum-indonesia/${category}`}
              className="group rounded-xl border border-slate-300/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-sky-400 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-cyan-400/60"
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-sky-600 transition group-hover:text-sky-500 dark:text-cyan-300 dark:group-hover:text-cyan-200" />
                <span>{category}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
