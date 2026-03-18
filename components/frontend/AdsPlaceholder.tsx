"use client";

type AdsProps = {
  label: string;
  size: string;
  /** Optional: "banner" | "square" | "native" — affects aspect ratio */
  variant?: "banner" | "square" | "native";
};

const AdsPlaceholder = ({ label, size, variant = "square" }: AdsProps) => {
  const heightClass =
    variant === "banner"
      ? "h-[90px]"
      : variant === "native"
      ? "h-[120px]"
      : "h-[250px]";

  return (
    <div className="overflow-hidden mb-6">
      <p
        className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500"
      >
        {label}
      </p>
      <div
        className={`flex ${heightClass} w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs font-medium text-slate-400 dark:text-slate-500`}
      >
        {size}
      </div>
    </div>
  );
};

export default AdsPlaceholder;
