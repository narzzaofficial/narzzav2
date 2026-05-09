import Link from "next/link";
import type { Metadata } from "next";
import {
  BookOpenText,
  BriefcaseBusiness,
  Compass,
  Handshake,
  Layers3,
  Target,
  Newspaper,
  GraduationCap,
  FlaskConical,
  Scale,
  ShieldCheck,
  Check,
  ArrowRight,
  Mail,
} from "lucide-react";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tentang Narzza",
  description:
    "Profil singkat Narzza sebagai media digital yang membungkus informasi, edukasi, dan insight dalam format yang lebih mudah dipahami.",
  alternates: { canonical: "/tentang" },
  openGraph: {
    title: "Tentang Narzza",
    description:
      "Profil singkat Narzza sebagai media digital yang membungkus informasi, edukasi, dan insight dalam format yang lebih mudah dipahami.",
    url: "/tentang",
  },
  twitter: {
    title: "Tentang Narzza",
    description:
      "Profil singkat Narzza sebagai media digital yang membungkus informasi, edukasi, dan insight dalam format yang lebih mudah dipahami.",
  },
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { value: "5", label: "Pilar Konten" },
  { value: "Q&A", label: "Format Khas" },
  { value: "100%", label: "Lokal Indonesia" },
  { value: "AI+", label: "Editorial Teknologi" },
];

const valueCards = [
  {
    title: "Mudah dicerna",
    description:
      "Topik yang padat dikemas jadi format ringkas, jelas, dan dekat dengan bahasa sehari-hari — bukan copas press release.",
    icon: BookOpenText,
    accent: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  },
  {
    title: "Punya arah bisnis",
    description:
      "Bukan sekadar mengejar traffic. Narzza dibangun untuk tumbuh lewat audiens loyal, kemitraan editorial, dan produk konten.",
    icon: BriefcaseBusiness,
    accent: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  {
    title: "Jembatan menuju keputusan",
    description:
      "Pembaca bukan cuma tahu informasi, tapi lebih siap mengambil keputusan yang relevan buat hidup dan kerja mereka.",
    icon: Compass,
    accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
];

const pillars = [
  {
    title: "Berita",
    description: "Update cepat, relevan, dan terkurasi — agar pembaca tidak tenggelam dalam arus informasi.",
    icon: Newspaper,
    color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20",
  },
  {
    title: "Tutorial",
    description: "Langkah demi langkah untuk memahami proses, tools, dan konsep secara praktis.",
    icon: GraduationCap,
    color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-900/20",
  },
  {
    title: "Riset",
    description: "Insight lebih dalam untuk melihat konteks, pola, dan pembelajaran jangka panjang.",
    icon: FlaskConical,
    color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
  },
  {
    title: "Hukum Indonesia",
    description: "Dokumen hukum yang dibuat lebih mudah dipahami publik, bukan hanya kalangan spesialis.",
    icon: Scale,
    color: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20",
  },
  {
    title: "Setelah Klik Agree",
    description: "Membedah Terms of Service dan Privacy Policy platform digital secara jujur dan manusiawi.",
    icon: ShieldCheck,
    color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/20",
  },
];

const audienceGroups = [
  {
    label: "Pembaca digital modern",
    detail: "Ingin cepat paham tanpa harus membaca dokumen panjang sendiri.",
  },
  {
    label: "Pelajar & profesional muda",
    detail: "Butuh ringkasan tajam untuk tetap update di tengah kesibukan.",
  },
  {
    label: "Founder & decision maker",
    detail: "Mencari konteks yang cukup untuk mengambil keputusan yang lebih baik.",
  },
  {
    label: "Brand & mitra konten",
    detail: "Ingin hadir di tengah audiens yang menghargai kualitas penjelasan.",
  },
];

const businessPoints = [
  "Diposisikan sebagai media digital dengan pendekatan editorial yang ramah, jelas, dan bernilai jangka panjang.",
  "Fokus membangun kepercayaan audiens melalui konten yang relevan, konsisten, dan mudah dipahami.",
  "Cocok dikembangkan lewat sponsorship, partnership konten, branded series, dan produk editorial turunan.",
  "Nilai jual utama: kemampuan menyederhanakan topik kompleks tanpa kehilangan makna pentingnya.",
];

const collaborationItems = [
  "Partnership konten untuk brand yang ingin hadir lewat pendekatan edukatif, bukan hard selling.",
  "Sponsored insight atau seri editorial tematik yang tetap selaras dengan kebutuhan audience.",
  "Kolaborasi media, komunitas, atau institusi yang ingin menjangkau pembaca dengan format yang lebih membumi.",
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function TentangPage() {
  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Tentang Narzza",
            description:
              "Profil singkat Narzza sebagai media digital yang membungkus informasi, edukasi, dan insight dalam format yang lebih mudah dipahami.",
            url: absoluteUrl("/tentang"),
          }),
        }}
      />

      {/* ── Hero ── */}
      <header className="glass-panel relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-200/50 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -bottom-16 left-1/4 h-36 w-36 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-400/10" />

        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 dark:border-sky-700/50 dark:bg-sky-900/20">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">
              Tentang Narzza
            </span>
          </div>

          <h1 className="max-w-2xl text-3xl font-bold leading-snug text-slate-900 dark:text-white md:text-4xl">
            Media digital yang membuat informasi penting terasa lebih{" "}
            <span className="text-sky-600 dark:text-sky-400">dekat, jelas,</span>{" "}
            dan berguna.
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Narzza mengemas berita, edukasi, hukum, dan kebijakan digital dalam
            format yang lebih mudah dipahami oleh audience modern. Bukan sekadar
            ramai — tapi membangun kepercayaan lewat penjelasan yang relevan dan membumi.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              Lihat Konten <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/setelah-klik-agree" className="btn-secondary">
              Jelajahi Editorial
            </Link>
          </div>
        </div>
      </header>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4 text-center shadow-sm dark:border-slate-700/60 dark:bg-slate-900/50"
          >
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Value proposition ── */}
      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500 dark:text-sky-400">
            Posisi Brand
          </p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
            Informatif sekaligus layak berkembang secara bisnis
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {valueCards.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60"
              >
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.accent}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Content pillars ── */}
      <section className="glass-panel space-y-5">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Layers3 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500 dark:text-sky-400">
              Pilar Konten
            </p>
            <h2 className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">
              5 lini utama yang menopang Narzza
            </h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-700/50 dark:bg-slate-800/30"
              >
                <div className={`mt-0.5 shrink-0 rounded-lg p-2 ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400">0{i + 1}</span>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Audience + Business ── */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Audience */}
        <article className="glass-panel space-y-5">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500 dark:text-sky-400">
                Audience
              </p>
              <h2 className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">
                Siapa yang paling cocok
              </h2>
            </div>
          </div>

          <div className="space-y-2.5">
            {audienceGroups.map((item) => (
              <div
                key={item.label}
                className="flex gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-3.5 dark:border-slate-700/50 dark:bg-slate-800/30"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                  <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Business */}
        <article className="glass-panel space-y-5">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              <BriefcaseBusiness className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500 dark:text-sky-400">
                Nilai Bisnis
              </p>
              <h2 className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">
                Arah pertumbuhan yang realistis
              </h2>
            </div>
          </div>

          <div className="space-y-2.5">
            {businessPoints.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-3.5 dark:border-slate-700/50 dark:bg-slate-800/30"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/20">
                  <Check className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                </span>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* ── Collaboration CTA ── */}
      <section className="relative overflow-hidden rounded-2xl border border-sky-200/70 bg-gradient-to-br from-sky-50 to-indigo-50 p-7 dark:border-sky-700/30 dark:from-sky-900/20 dark:to-indigo-900/20">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-200/60 blur-3xl dark:bg-sky-500/10" />
        <div className="pointer-events-none absolute -bottom-10 left-1/2 h-32 w-32 rounded-full bg-violet-200/50 blur-3xl dark:bg-violet-500/10" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                <Handshake className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500 dark:text-sky-400">
                  Kolaborasi
                </p>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Tertarik bekerja sama?
                </h2>
              </div>
            </div>

            <ul className="space-y-1.5">
              {collaborationItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0">
            <Link
              href="mailto:hello@narzza.com"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
            >
              <Mail className="h-4 w-4" />
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}
