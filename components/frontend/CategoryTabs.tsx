import type React from "react";
import type { LucideIcon } from "lucide-react";
import { FlaskConical, Globe, GraduationCap, Newspaper, Scale } from "lucide-react";

export type HomeCategory =
  | "Semua"
  | "Berita"
  | "Tutorial"
  | "Riset"
  | "Hukum Indonesia";

type CategoryConfig = {
  key: HomeCategory;
  icon: LucideIcon;
  activeStyle: React.CSSProperties;
};

const categoryButtons: CategoryConfig[] = [
  {
    key: "Semua",
    icon: Globe,
    activeStyle: {
      background: "#4338ca",
      borderColor: "#4338ca",
      color: "#fff",
    },
  },
  {
    key: "Berita",
    icon: Newspaper,
    activeStyle: {
      background: "#0369a1",
      borderColor: "#0369a1",
      color: "#fff",
    },
  },
  {
    key: "Tutorial",
    icon: GraduationCap,
    activeStyle: {
      background: "#047857",
      borderColor: "#047857",
      color: "#fff",
    },
  },
  {
    key: "Riset",
    icon: FlaskConical,
    activeStyle: {
      background: "#a21caf",
      borderColor: "#a21caf",
      color: "#fff",
    },
  },
  {
    key: "Hukum Indonesia",
    icon: Scale,
    activeStyle: {
      background: "#b45309",
      borderColor: "#b45309",
      color: "#fff",
    },
  },
];

type CategoryTabsProps = {
  activeCategory: HomeCategory;
  onChange: (category: HomeCategory) => void;
};

export function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps) {
  return (
    <div className="mb-6 mt-4">
      <div className="scrollbar-hide flex w-full max-w-full items-center gap-2.5 overflow-x-auto px-safe pb-2 scroll-px-safe">
        {categoryButtons.map((cat) => {
          const isActive = activeCategory === cat.key;
          const Icon = cat.icon;

          return (
            <button
              key={cat.key}
              onClick={() => onChange(cat.key)}
              className={`
                inline-flex items-center gap-1.5
                rounded-full
                border border-slate-200
                px-4 py-2
                text-sm font-medium
                whitespace-nowrap
                shadow-sm
                transition-all duration-200
                active:scale-98
                ${!isActive ? "bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50" : ""}
                dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300
                dark:hover:border-slate-600 dark:hover:bg-slate-700
              `}
              style={isActive ? cat.activeStyle : undefined}
              aria-pressed={isActive}
              aria-label={`Filter ${cat.key}`}
              type="button"
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {cat.key}
            </button>
          );
        })}
      </div>
    </div>
  );
}
