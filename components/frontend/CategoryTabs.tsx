import type React from "react";

export type HomeCategory = "Semua" | "Berita" | "Tutorial" | "Riset" | "Buku";

type CategoryConfig = {
  key: HomeCategory;
  icon: string;
  activeStyle: React.CSSProperties;
};

const categoryButtons: CategoryConfig[] = [
  {
    key: "Semua",
    icon: "🌐",
    activeStyle: {
      background: "#6366f1",
      borderColor: "#6366f1",
      color: "#fff",
    },
  },
  {
    key: "Berita",
    icon: "📰",
    activeStyle: {
      background: "#0ea5e9",
      borderColor: "#0ea5e9",
      color: "#fff",
    },
  },
  {
    key: "Tutorial",
    icon: "🎓",
    activeStyle: {
      background: "#10b981",
      borderColor: "#10b981",
      color: "#fff",
    },
  },
  {
    key: "Riset",
    icon: "🔬",
    activeStyle: {
      background: "#d946ef",
      borderColor: "#d946ef",
      color: "#fff",
    },
  },
  {
    key: "Buku",
    icon: "📚",
    activeStyle: {
      background: "#f59e0b",
      borderColor: "#f59e0b",
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
    <div className="mt-4 mb-6">
      <div className="scrollbar-hide flex w-full max-w-full items-center gap-2.5 overflow-x-auto pb-2 px-safe scroll-px-safe">
        {categoryButtons.map((cat) => {
          const isActive = activeCategory === cat.key;

          return (
            <button
              key={cat.key}
              onClick={() => onChange(cat.key)}
              className={`
                inline-flex items-center gap-1.5 
                px-4 py-2 
                text-sm font-medium 
                rounded-full 
                border border-slate-200
                whitespace-nowrap
                transition-all duration-200
                active:scale-98
                shadow-sm
                ${!isActive ? "bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50" : ""}
                dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300
                dark:hover:border-slate-600 dark:hover:bg-slate-700
              `}
              style={isActive ? cat.activeStyle : undefined}
              aria-pressed={isActive}
              aria-label={`Filter ${cat.key}`}
            >
              <span aria-hidden="true">{cat.icon}</span> {cat.key}
            </button>
          );
        })}
      </div>
    </div>
  );
}
