"use client";

import {
  useId,
  useRef,
  type ReactNode,
  type KeyboardEventHandler,
} from "react";
import { Dialog } from "radix-ui";
import { IconX } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

/** Shared modal behavior for public drawers and the photo viewer. */
export function AccessibleDialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
  titleClassName,
  onKeyDown,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
}) {
  const { messages: t } = useLanguage();
  const returnFocus = useRef<HTMLElement | null>(null);
  const descriptionId = useId();

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="newskin ns-overlay fixed inset-0 z-[10050]" />
        <Dialog.Content
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            "newskin ns-modal fixed z-[10060] outline-none",
            className,
          )}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocus.current?.focus();
          }}
          onKeyDown={onKeyDown}
          onOpenAutoFocus={() => {
            returnFocus.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
          }}
        >
          <Dialog.Title
            className={cn(
              "ns-card-title border-b border-border p-5 pr-20",
              titleClassName,
            )}
          >
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description
              className="ns-caption px-5 pt-4"
              id={descriptionId}
            >
              {description}
            </Dialog.Description>
          )}
          <Dialog.Close
            aria-label={t.common.close}
            className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-foreground hover:bg-card"
          >
            <IconX size={20} />
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
