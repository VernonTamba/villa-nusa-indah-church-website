"use client";

import { cn } from "@/lib/utils";
import { AccessibleDialog } from "@/components/ui/accessible-dialog";
import { useLanguage } from "@/lib/i18n";

interface SideSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "right" | "left";
  width?: string;
  className?: string;
}

export default function SideSheet({
  open,
  onClose,
  title,
  children,
  side = "right",
  width = "sm:w-96",
  className,
}: SideSheetProps) {
  const { messages: t } = useLanguage();

  return (
    <AccessibleDialog
      className={cn(
        "inset-y-0 flex w-full max-w-full flex-col sm:inset-y-4 sm:max-w-[calc(100vw-2rem)] sm:rounded-2xl",
        side === "right" ? "right-0 sm:right-4" : "left-0 sm:left-4",
        width,
        className,
      )}
      open={open}
      title={title ?? t.rundown.viewDetail}
      onClose={onClose}
    >
      <div className="side-sheet-scroll min-h-0 flex-1 overflow-y-auto">
        {children}
      </div>
    </AccessibleDialog>
  );
}
