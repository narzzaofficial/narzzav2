import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

type AgreeBreadcrumbsProps = {
  items: Crumb[];
};

export function AgreeBreadcrumbs({ items }: AgreeBreadcrumbsProps) {
  return (
    <nav className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="transition hover:text-slate-800 dark:hover:text-slate-100"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800 dark:text-slate-100">{item.label}</span>
          )}
          {index < items.length - 1 ? <span>/</span> : null}
        </span>
      ))}
    </nav>
  );
}
