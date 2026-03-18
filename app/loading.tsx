export default function Loading() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto w-full max-w-5xl space-y-5">
        <div className="h-10 w-56 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="h-28 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-28 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-28 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}
