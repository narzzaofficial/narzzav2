"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "nz_sid";
const SESSION_EXP_KEY = "nz_sid_exp";
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes

function getOrCreateSession(): string {
  try {
    const id = localStorage.getItem(SESSION_KEY);
    const exp = Number(localStorage.getItem(SESSION_EXP_KEY) || "0");
    if (id && Date.now() < exp) {
      localStorage.setItem(SESSION_EXP_KEY, String(Date.now() + SESSION_TTL));
      return id;
    }
    const newId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, newId);
    localStorage.setItem(SESSION_EXP_KEY, String(Date.now() + SESSION_TTL));
    return newId;
  } catch {
    return crypto.randomUUID();
  }
}

function getDevice(): "mobile" | "tablet" | "desktop" {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) return "mobile";
  return "desktop";
}

function parseContent(path: string) {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return { contentType: "home" };
  if (parts[0] === "feeds" && parts[1]) return { contentType: "feed", contentSlug: parts[1] };
  if (parts[0] === "hukum" && parts[1]) return { contentType: "law", contentSlug: parts[1] };
  if (parts[0] === "berita") return { contentType: "category", contentCategory: "Berita" };
  if (parts[0] === "tutorial") return { contentType: "category", contentCategory: "Tutorial" };
  if (parts[0] === "riset") return { contentType: "category", contentCategory: "Riset" };
  if (parts[0] === "hukum-indonesia") return { contentType: "laws_list" };
  if (parts[0] === "setelah-klik-agree") return { contentType: "agree" };
  return { contentType: "other" };
}

function getReferrer(): string {
  try {
    const ref = document.referrer;
    if (!ref) return "direct";
    return new URL(ref).hostname;
  } catch {
    return "direct";
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    sessionIdRef.current = getOrCreateSession();
  }, []);

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = getOrCreateSession();
    }

    const payload = {
      sessionId: sessionIdRef.current,
      path: pathname,
      referrer: getReferrer(),
      device: getDevice(),
      ...parseContent(pathname),
    };

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
