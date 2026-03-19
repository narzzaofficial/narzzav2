"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

import {
  canNavigateBackSafely,
  prepareSafeBackNavigation,
} from "@/lib/navigation-history";

type SafeBackButtonProps = {
  fallbackHref: string;
  children?: React.ReactNode;
} & Omit<ComponentProps<"button">, "type" | "onClick" | "children">;

export function SafeBackButton({
  fallbackHref,
  children = "Kembali",
  className,
  ...props
}: SafeBackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (canNavigateBackSafely()) {
      prepareSafeBackNavigation();
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button type="button" onClick={handleClick} className={className} {...props}>
      <ArrowLeft className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}

