"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

import type { GalleryPhoto, GalleryCategory } from "@/config/gallery";
import { useLanguage } from "@/lib/i18n";

interface GalleryLightboxProps {
  /** The currently visible (filtered) photo set — navigation stays within this set. */
  photos: GalleryPhoto[];
  /** Index within `photos` of the open photo, or `null` when closed. */
  currentIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  getCategoryLabel: (category: GalleryCategory) => string;
}

export function GalleryLightbox({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  getCategoryLabel,
}: GalleryLightboxProps) {
  const { messages: t } = useLanguage();

  const isOpen = currentIndex !== null;
  const currentPhoto = isOpen ? photos[currentIndex] : null;
  const caption = currentPhoto
    ? (t.gallery.captions as Record<string, string>)[currentPhoto.captionKey]
    : "";

  // ── Keyboard navigation ──────────────────────────────────────────────────
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [isOpen, onClose, onPrev, onNext],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // ── Body scroll lock ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && currentPhoto && (
        /* ── Backdrop ─────────────────────────────────────────────────────── */
        <motion.div
          key="lightbox-backdrop"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/92 p-4 sm:p-8"
          style={{ backdropFilter: "blur(12px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={onClose}
        >
          {/* ── Close button ─────────────────────────────────────────────── */}
          <button
            id="gallery-lightbox-close"
            onClick={onClose}
            aria-label={t.gallery.lightbox.close}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-105"
          >
            <IconX size={20} />
          </button>

          {/* ── Prev button ──────────────────────────────────────────────── */}
          <button
            id="gallery-lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label={t.gallery.lightbox.prev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-105 sm:left-5"
          >
            <IconChevronLeft size={24} />
          </button>

          {/* ── Next button ──────────────────────────────────────────────── */}
          <button
            id="gallery-lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label={t.gallery.lightbox.next}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-105 sm:right-5"
          >
            <IconChevronRight size={24} />
          </button>

          {/* ── Photo card (animates per photo change) ───────────────────── */}
          <motion.div
            key={currentPhoto.id}
            className="relative flex max-h-[90vh] max-w-5xl w-full flex-col items-center gap-4"
            initial={{ scale: 0.88, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Photo */}
            <div className="relative flex max-h-[78vh] w-full items-center justify-center overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={currentPhoto.src}
                alt={caption}
                width={1400}
                height={1050}
                className="max-h-[78vh] w-auto rounded-2xl object-contain"
                quality={90}
                sizes="(max-width: 768px) 100vw, 85vw"
                priority
              />
            </div>

            {/* Caption bar */}
            <div className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <span className="shrink-0 rounded-full border border-secondary/35 bg-secondary/15 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary">
                  {getCategoryLabel(currentPhoto.category)}
                </span>
                <p className="truncate text-sm text-white/80">{caption}</p>
              </div>
              {/* Counter */}
              <span className="shrink-0 font-mono text-xs tabular-nums text-white/35">
                {String(currentIndex + 1).padStart(2, "0")}
                <span className="mx-1 text-white/20">/</span>
                {String(photos.length).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
