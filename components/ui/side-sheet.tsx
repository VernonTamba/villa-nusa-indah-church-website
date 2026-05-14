// components/ui/side-sheet.tsx
"use client";

import { useEffect, useRef } from "react";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface SideSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "right" | "left";
  width?: string;
  className?: string;
}

const SideSheet = ({
  open,
  onClose,
  title,
  children,
  side = "right",
  width = "w-96",
  className,
}: SideSheetProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[9999] bg-black/50 transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />

      {/* Floating panel with inset */}
      <div
        ref={panelRef}
        className={cn(
          "fixed z-[9999] flex max-w-none flex-col overflow-hidden bg-background sm:max-w-[calc(100vw-2rem)]",
          "border border-border shadow-2xl sm:rounded-2xl",
          "will-change-transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          // Full-screen on mobile, then inset from edges on larger screens.
          side === "right"
            ? "inset-0 sm:inset-auto sm:right-4 sm:top-4 sm:bottom-4"
            : "inset-0 sm:inset-auto sm:left-4 sm:top-4 sm:bottom-4",
          // Slide in/out
          side === "right"
            ? open
              ? "translate-x-0"
              : "translate-x-[calc(100%+2rem)]"
            : open
              ? "translate-x-0"
              : "-translate-x-[calc(100%+2rem)]",
          width,
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-6 shrink-0 sm:rounded-t-2xl">
          {title && (
            <h1 className="text-2xl font-bold text-foreground dark:text-white">
              {title}
            </h1>
          )}
          <button
            onClick={onClose}
            className={cn(
              "ml-auto flex h-8 w-8 items-center justify-center rounded-md",
              "border border-border text-foreground dark:text-white",
              "transition-colors hover:bg-muted hover:text-foreground dark:hover:text-white cursor-pointer",
            )}
            aria-label="Close"
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Scrollable content slot */}
        <div className="side-sheet-scroll flex-1 overflow-y-auto sm:rounded-b-2xl">
          {children}
        </div>
      </div>
    </>
  );
};

export default SideSheet;
