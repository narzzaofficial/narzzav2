import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function FeedsLayout({ children }: Props) {
  return <div className="min-h-screen px-2 py-3 md:px-3 md:py-4">{children}</div>;
}
