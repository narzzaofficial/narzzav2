type EmptyStoryOverlayProps = {
  onClose: () => void;
};

export function EmptyStoryOverlay({ onClose }: EmptyStoryOverlayProps) {
  return (
    <div className="fixed inset-0 z-140 bg-black/60 backdrop-blur-md">
      <button
        type="button"
        aria-label="Tutup status populer"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative flex h-full items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-5 text-center shadow-xl dark:border-slate-700/60 dark:bg-slate-900/70">
          <p className="text-sm text-slate-800 dark:text-slate-100">
            Belum ada konten populer untuk status ini.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary mt-4"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
