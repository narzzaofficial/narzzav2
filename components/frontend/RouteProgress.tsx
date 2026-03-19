"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function shouldHandleAnchor(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  try {
    const nextUrl = new URL(anchor.href, window.location.href);
    const currentUrl = new URL(window.location.href);

    if (nextUrl.origin !== currentUrl.origin) return false;
    if (
      nextUrl.pathname === currentUrl.pathname &&
      nextUrl.search === currentUrl.search
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function RouteProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  function clearTimers() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (finishingRef.current) {
      clearTimeout(finishingRef.current);
      finishingRef.current = null;
    }
  }

  function startProgress() {
    clearTimers();
    startedRef.current = true;
    setVisible(true);
    setProgress(14);

    intervalRef.current = setInterval(() => {
      setProgress((current) => {
        if (current >= 88) return current;
        const step = current < 40 ? 12 : current < 68 ? 7 : 3;
        return Math.min(current + step, 88);
      });
    }, 180);
  }

  function finishProgress() {
    if (!startedRef.current) return;

    clearTimers();
    setProgress(100);

    finishingRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      startedRef.current = false;
    }, 260);
  }

  useEffect(() => {
    finishProgress();
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!shouldHandleAnchor(anchor)) return;

      startProgress();
    }

    function handlePopState() {
      startProgress();
    }

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
      clearTimers();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[100] transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-[3px] origin-left bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 shadow-[0_0_18px_rgba(56,189,248,0.45)] transition-[width] duration-200 ease-out dark:from-cyan-300 dark:via-sky-400 dark:to-blue-400"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
