"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "./cn";

/**
 * Lightweight toast/snackbar system. Mount <ToastProvider> once (in the root
 * layout); call `useToast().toast("Saved")` from any client component. Toasts
 * auto-dismiss and stack bottom-center. Intentionally dependency-free.
 */
export type ToastTone = "default" | "success" | "error";

interface ToastItem {
  readonly id: number;
  readonly message: string;
  readonly tone: ToastTone;
}

interface ToastApi {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const TONES: Record<ToastTone, string> = {
  default: "border-sand/20 text-sand",
  success: "border-gold/50 text-gold-bright",
  error: "border-red-400/50 text-red-200",
};

const DISMISS_MS = 3200;

export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [items, setItems] = useState<readonly ToastItem[]>([]);
  const nextId = useRef(0);

  const toast = useCallback((message: string, tone: ToastTone = "default") => {
    const id = nextId.current++;
    setItems((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, DISMISS_MS);
  }, []);

  const api = useMemo<ToastApi>(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[110] flex flex-col items-center gap-2 px-4"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto rounded-full border bg-ink-soft/95 px-5 py-2 text-sm shadow-lg backdrop-blur-md",
              TONES[t.tone],
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}
