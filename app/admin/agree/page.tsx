import Link from "next/link";
import { SafeBackButton } from "@/components/frontend/SafeBackButton";

const modules = [
  {
    title: "Kelola Topic",
    description: "Kategori utama seperti Technology, Finance, Social Media.",
    href: "/admin/agree/topics",
  },
  {
    title: "Kelola Company",
    description: "Company yang terhubung ke topic, termasuk logo dan deskripsi.",
    href: "/admin/agree/companies",
  },
  {
    title: "Kelola App",
    description: "App milik company, icon upload, dan status popular.",
    href: "/admin/agree/apps",
  },
  {
    title: "Kelola Document",
    description: "Terms, Privacy, markdown, analisis, dan Q&A.",
    href: "/admin/agree/documents",
  },
];

export default function AgreeAdminHomePage() {
  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Setelah Klik Agree</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Pilih modul form yang ingin dikelola.
            </p>
          </div>
          <SafeBackButton fallbackHref="/admin" className="btn-secondary">
            Kembali
          </SafeBackButton>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {modules.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="glass-panel block transition hover:-translate-y-0.5"
            >
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
