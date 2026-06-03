"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "./cn";

/**
 * Accessible modal dialog. Controlled via `open`/`onClose`. Closes on Escape and
 * backdrop click, locks body scroll while open, and moves focus into the panel.
 * Used by upgrade/paywall prompts, share sheets, and confirmations.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-lg rounded-2xl border border-sand/15 bg-ink-soft p-8 shadow-2xl focus:outline-none",
          className,
        )}
      >
        {title && (
          <h2 className="mb-4 font-display text-2xl text-sand">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
