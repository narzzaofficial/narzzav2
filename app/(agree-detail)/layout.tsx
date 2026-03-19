import type { ReactNode } from "react";

type AgreeDetailLayoutProps = {
  children: ReactNode;
};

export default function AgreeDetailLayout({ children }: AgreeDetailLayoutProps) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}

