type StorySidePreviewProps = {
  label: string;
  title?: string;
  takeaway?: string | null;
  storyType?: string;
  onClick: () => void;
};

export function StorySidePreview({
  label,
  title,
  takeaway,
  storyType,
  onClick,
}: StorySidePreviewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pointer-events-auto hidden w-[200px] shrink-0 cursor-pointer rounded-2xl border border-slate-200 bg-white/70 p-4 text-left opacity-70 backdrop-blur-sm transition hover:opacity-95 dark:border-slate-700/60 dark:bg-slate-900/50 xl:block"
    >
      <p
        className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400"
      >
        {label}
      </p>

      {title ? (
        <>
          <p
            className="mt-2 overflow-hidden text-sm font-semibold leading-snug [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
          >
            {title}
          </p>

          {takeaway && (
            <div
              className="mt-2.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[10px] leading-relaxed text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/30 dark:text-slate-200"
            >
              {takeaway}
            </div>
          )}
        </>
      ) : (
        storyType && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {storyType}
          </p>
        )
      )}
    </button>
  );
}
