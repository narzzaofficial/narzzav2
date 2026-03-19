export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-300/70 bg-white/85 px-8 py-7 shadow-lg shadow-slate-400/15 dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-none">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-sky-100 dark:border-slate-700" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-sky-500 border-r-cyan-400 dark:border-t-cyan-300 dark:border-r-sky-400" />
        </div>

        <div className="space-y-1 text-center">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Memuat halaman
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tunggu sebentar, konten sedang disiapkan.
          </p>
        </div>
      </div>
    </div>
  );
}
