"use client";

import { getRelativeTime } from "@/lib/time-utils";
import { useCallback, useSyncExternalStore } from "react";

type RelativeTimeProps = {
  timestamp: number;
  className?: string;
};

/**
 * Client-side component to display relative time.
 * Prevents hydration mismatch by calculating time on client.
 */
export function RelativeTime({ timestamp, className }: RelativeTimeProps) {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const interval = setInterval(onStoreChange, 60000);
    return () => clearInterval(interval);
  }, []);

  const getSnapshot = useCallback(() => getRelativeTime(timestamp), [timestamp]);
  const getServerSnapshot = useCallback(() => "", []);

  const timeText = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (!timeText) {
    return <span className={className}>&nbsp;</span>;
  }

  return <span className={className}>{timeText}</span>;
}
