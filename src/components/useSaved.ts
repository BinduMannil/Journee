"use client";

import { useCallback, useEffect, useState } from "react";
import { toggleId, parseSaved } from "@/lib/saved/collection";

const KEY = "journee:saved";

/**
 * Saved destinations persisted in localStorage (no account needed yet). Syncs
 * across tabs via the storage event. Pure set logic lives in lib/saved.
 */
export function useSaved() {
  const [ids, setIds] = useState<readonly string[]>([]);

  useEffect(() => {
    setIds(parseSaved(localStorage.getItem(KEY)));
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setIds(parseSaved(e.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = toggleId(prev, id);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, isSaved };
}
