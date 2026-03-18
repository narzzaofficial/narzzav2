import type { ReactNode } from "react";

type HukumLayoutProps = {
  children: ReactNode;
};

export default function HukumLayout({ children }: HukumLayoutProps) {
  return <div className="min-h-screen px-2 py-3 md:px-3 md:py-4">{children}</div>;
}

