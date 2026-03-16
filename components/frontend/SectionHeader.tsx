type ColorClass = "sky" | "emerald" | "fuchsia" | "purple" | "amber";

const bgColorMap: Record<ColorClass, string> = {
  sky: "bg-sky-500/15 ring-1 ring-sky-500/25",
  emerald: "bg-emerald-500/15 ring-1 ring-emerald-500/25",
  fuchsia: "bg-fuchsia-500/15 ring-1 ring-fuchsia-500/25",
  purple: "bg-purple-500/15 ring-1 ring-purple-500/25",
  amber: "bg-amber-500/15 ring-1 ring-amber-500/25",
};

type SectionHeaderProps = {
  icon: string;
  title: string;
  desc: string;
  colorClass: ColorClass;
};

export function SectionHeader({
  icon,
  title,
  desc,
  colorClass,
}: SectionHeaderProps) {
  const bgClass = bgColorMap[colorClass];

  return (
    <div className="mb-4 flex items-center gap-3">
      <div
        className={`
        flex items-center justify-center 
        w-10 h-10 
        rounded-xl 
        shrink-0
        ${bgClass}
      `}
      >
        <span className="text-lg" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
