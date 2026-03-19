import Link from "next/link";
import type { Metadata } from "next";
import {
  BookOpenText,
  BriefcaseBusiness,
  Compass,
  Handshake,
  Layers3,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Narzza",
  description:
    "Profil singkat Narzza sebagai media digital yang membungkus informasi, edukasi, dan insight dalam format yang lebih mudah dipahami.",
};

const valueCards = [
  {
    title: "Media yang lebih mudah dicerna",
    description:
      "Narzza membungkus topik yang padat menjadi format yang lebih ringkas, jelas, dan dekat dengan bahasa user sehari-hari.",
    icon: BookOpenText,
  },
  {
    title: "Konten yang punya arah bisnis",
    description:
      "Bukan sekadar mengejar traffic, Narzza dibangun untuk menjadi brand media yang bisa tumbuh lewat audiens loyal, kemitraan, dan produk editorial.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Jembatan antara informasi dan keputusan",
    description:
      "Konten Narzza diarahkan supaya pembaca bukan cuma tahu informasi, tapi juga lebih siap mengambil keputusan yang relevan buat hidup dan kerja mereka.",
    icon: Compass,
  },
];

const pillars = [
  {
    title: "Berita",
    description:
      "Update yang cepat, relevan, dan dipilih supaya audience tidak tenggelam dalam arus informasi yang berlebihan.",
  },
  {
    title: "Tutorial",
    description:
      "Konten langkah demi langkah yang membantu user memahami proses, tools, dan konsep secara praktis.",
  },
  {
    title: "Riset",
    description:
      "Insight yang lebih dalam untuk audience yang ingin melihat konteks, pola, dan pembelajaran jangka panjang.",
  },
  {
    title: "Hukum Indonesia",
    description:
      "Dokumen hukum dan penjelasan yang dibuat lebih mudah dipahami oleh publik, bukan hanya kalangan spesialis.",
  },
  {
    title: "Setelah Klik Agree",
    description:
      "Ruang editorial untuk membedah Terms of Service, Privacy Policy, dan kebijakan platform digital secara lebih jujur dan manusiawi.",
  },
];

const audienceGroups = [
  "Pembaca digital yang ingin cepat paham tanpa harus membaca dokumen panjang sendiri.",
  "Pelajar, profesional muda, dan founder yang butuh ringkasan tajam untuk tetap update.",
  "Brand atau partner yang ingin hadir di tengah audience yang menghargai konteks dan kualitas penjelasan.",
];

const businessPoints = [
  "Narzza diposisikan sebagai media digital dengan pendekatan editorial yang ramah, jelas, dan bernilai jangka panjang.",
  "Fokus utamanya adalah membangun kepercayaan audiens melalui konten yang relevan, konsisten, dan mudah dipahami.",
  "Ke depan, bisnis ini cocok dikembangkan lewat sponsorship, partnership konten, branded series, dan produk editorial turunan.",
  "Nilai jual Narzza ada pada kemampuannya menyederhanakan topik yang kompleks tanpa kehilangan makna pentingnya.",
];

const collaborationItems = [
  "Partnership konten untuk brand yang ingin hadir lewat pendekatan edukatif, bukan hard selling.",
  "Sponsored insight atau seri editorial tematik yang tetap selaras dengan kebutuhan audience.",
  "Kolaborasi media, komunitas, atau institusi yang ingin menjangkau pembaca dengan format yang lebih membumi.",
];

export default function TentangPage() {
  return (
    <section className="space-y-7 md:space-y-9">
      <header className="glass-panel overflow-hidden">
        <div className="relative">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-sky-200/45 blur-3xl dark:bg-cyan-400/10" />
          <div className="absolute -bottom-12 left-1/3 h-28 w-28 rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-400/10" />

          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-500 dark:text-sky-300">
              Tentang Narzza
            </p>
            <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl">
              Media digital yang membuat informasi penting terasa lebih dekat,
              lebih jelas, dan lebih berguna.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Narzza hadir sebagai brand media yang mengemas berita, edukasi,
              hukum, dan kebijakan digital dalam format yang lebih mudah
              dipahami oleh audience modern. Fokusnya bukan sekadar ramai,
              tetapi membangun kepercayaan lewat penjelasan yang terasa relevan
              dan membumi.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/" className="btn-primary">
                Lihat Konten
              </Link>
              <Link href="/setelah-klik-agree" className="btn-secondary">
                Jelajahi Editorial
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-sky-400 dark:text-sky-300">
            Posisi Brand
          </p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl">
            Narzza dibangun sebagai media yang informatif sekaligus layak
            berkembang secara bisnis
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {valueCards.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-300/70 bg-white/85 p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-cyan-500/15 dark:text-cyan-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="glass-panel">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <Layers3 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-sky-400 dark:text-sky-300">
                Pilar Konten
              </p>
              <h2 className="mt-1 text-2xl font-medium text-slate-900 dark:text-slate-100">
                Lini utama yang menopang brand
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {pillars.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40"
              >
                <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-panel">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-sky-400 dark:text-sky-300">
                Audience
              </p>
              <h2 className="mt-1 text-2xl font-medium text-slate-900 dark:text-slate-100">
                Siapa yang paling cocok dengan Narzza
              </h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {audienceGroups.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-4 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="glass-panel">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              <BriefcaseBusiness className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-sky-400 dark:text-sky-300">
                Nilai Bisnis
              </p>
              <h2 className="mt-1 text-2xl font-medium text-slate-900 dark:text-slate-100">
                Arah pertumbuhan yang realistis
              </h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {businessPoints.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-4 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="glass-panel">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-cyan-500/15 dark:text-cyan-300">
              <Handshake className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-sky-400 dark:text-sky-300">
                Kolaborasi
              </p>
              <h2 className="mt-1 text-2xl font-medium text-slate-900 dark:text-slate-100">
                Bentuk kerja sama yang cocok
              </h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {collaborationItems.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-4 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
