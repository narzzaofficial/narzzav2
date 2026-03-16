"use client";
import { SiteShell } from "@/components/SiteShall";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return <SiteShell>{children}</SiteShell>;
}
