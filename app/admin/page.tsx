import Link from "next/link";

const adminLinks = [
  {
    title: "Kelola Feeds",
    description: "Berita, tutorial, riset, dan konten status",
    href: "/admin/feeds",
  },
  {
    title: "Kelola Hukum Indonesia",
    description: "Dokumen hukum, naskah original, dan explanation Q&A",
    href: "/admin/laws",
  },
];

export default function AdminHomePage() {
  return (
    <div className="min-h-screen px-3 py-6 md:px-5">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Pilih modul yang ingin dikelola.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {adminLinks.map((item) => (
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
