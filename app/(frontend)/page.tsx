"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

const Page = () => {
  // Ambil fungsi tema dari next-themes
  const { theme, setTheme } = useTheme();

  // State untuk mencegah hydration error
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  return (
    // Wrapper utama: min-h-screen memastikan background penuh layar
    <div className="min-h-screen p-6 transition-colors duration-300 md:p-12">
      {/* Header & Tombol Toggle */}
      <div className="mb-10 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/50 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Eksperimen UI NardiLabs
        </h1>

        {/* Tombol hanya di-render setelah client siap */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 hover:shadow-md active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {theme === "dark" ? "☀️ Mode Terang" : "🌙 Mode Gelap"}
          </button>
        )}
      </div>

      {/* Grid untuk menjejerkan komponen yang mau di-test */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Komponen 1: Feed Card */}
        <div className="feed-card group">
          <h3 className="text-lg font-bold">Belajar Next.js dan Tailwind</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Testing transisi warna pada text deskripsi saat tema diubah.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="tag-pill">Tutorial</span>
            <span className="tag-pill">Web Dev</span>
          </div>
        </div>

        {/* Komponen 2: Glass Panel */}
        <aside className="glass-panel">
          <h2 className="mb-4 text-xl font-bold">Kategori Populer</h2>
          <div className="inti-cepat-box">
            Paling banyak dicari minggu ini! Perhatikan gradasi warnanya
            berubah.
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Page;
