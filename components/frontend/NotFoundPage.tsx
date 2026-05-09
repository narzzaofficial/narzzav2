import Link from "next/link";
import { Compass, Home, Newspaper, Scale } from "lucide-react";

type NotFoundPageProps = {
  compact?: boolean;
};

export function NotFoundPage({ compact = false }: NotFoundPageProps) {
  return (
    <section
      className={`mx-auto w-full max-w-3xl px-2 ${compact ? "py-6" : "py-10 md:py-16"}`}
      aria-labelledby="not-found-title"
    >
      <div className="read-card relative overflow-hidden p-5 md:p-8">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-sky-300/25 blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/65 bg-sky-100/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-sky-800 dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-200">
            <Compass className="h-3.5 w-3.5" />
            Error 404
          </span>

          <h1
            id="not-found-title"
            className="mt-4 text-2xl font-bold leading-tight text-slate-900 dark:text-slate-100 md:text-3xl"
          >
            Halaman tidak ditemukan
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 md:text-base">
            Link mungkin sudah berubah, dihapus, atau URL yang dimasukkan belum tepat.
            Kamu bisa lanjut dari halaman utama atau pilih kategori populer di bawah.
          </p>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-300/70 bg-sky-100/80 px-4 py-2.5 text-sm font-semibold text-sky-800 transition hover:border-sky-400 hover:bg-sky-200/70 dark:border-cyan-400/35 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:border-cyan-300/55 dark:hover:bg-cyan-400/20"
            >
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
            <Link
              href="/berita"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300/70 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600/70 dark:bg-slate-900/65 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800/80"
            >
              <Newspaper className="h-4 w-4" />
              Buka Berita
            </Link>
            <Link
              href="/hukum-indonesia"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300/70 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600/70 dark:bg-slate-900/65 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800/80"
            >
              <Scale className="h-4 w-4" />
              Jelajah Hukum Indonesia
            </Link>
            <Link
              href="/setelah-klik-agree"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300/70 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600/70 dark:bg-slate-900/65 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800/80"
            >
              <Compass className="h-4 w-4" />
              Cek Setelah Klik Agree
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
