import { notFound } from "next/navigation";

import { HukumCategoryBrowser } from "@/components/frontend/HukumCategoryBrowser";
import { getLawsByCategory } from "@/lib/laws";
import { HUKUM_CATEGORIES, isHukumCategory } from "@/lib/law-categories";
import type { HukumCategory } from "@/types/content";

export const revalidate = 3600;

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return HUKUM_CATEGORIES.map((category) => ({ category }));
}

export default async function HukumCategoryPage({
  params,
}: CategoryPageProps) {
  const { category } = await params;

  if (!isHukumCategory(category)) {
    notFound();
  }

  const limit = 300;
  const data = await getLawsByCategory(category as HukumCategory, 1, limit);

  return (
    <section className="space-y-4">
      <header className="glass-panel">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-400 dark:text-sky-300">
          Hukum Indonesia
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          {category}
        </h1>
      </header>

      <HukumCategoryBrowser
        category={category as HukumCategory}
        items={data.items}
        truncated={data.pagination.hasMore}
      />
    </section>
  );
}
