"use client";

import type { GalleryPhoto, GalleryCategory } from "@/config/gallery";

import Image from "next/image";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { useLanguage } from "@/lib/i18n";
import { AccessibleDialog } from "@/components/ui/accessible-dialog";
import { Button } from "@/components/ui/button";

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
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
  const photo = currentIndex === null ? null : photos[currentIndex];
  const caption = photo
    ? (t.gallery.captions as Record<string, string>)[photo.captionKey]
    : "";

  return (
    <AccessibleDialog
      className="inset-x-3 top-1/2 max-h-[calc(100dvh-24px)] -translate-y-1/2 overflow-y-auto rounded-2xl p-4 pt-16 sm:inset-x-8 lg:inset-x-[max(32px,calc((100vw-1100px)/2))]"
      open={!!photo}
      title={caption || t.gallery.titleStart}
      titleClassName="sr-only"
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          onPrev();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          onNext();
        }
      }}
    >
      {photo && (
        <>
          <Image
            priority
            alt={caption}
            className="mx-auto max-h-[60dvh] w-auto max-w-full rounded-xl object-contain"
            height={1050}
            quality={80}
            sizes="(max-width: 768px) 100vw, 85vw"
            src={photo.src}
            width={1400}
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <Button
              aria-label={t.gallery.lightbox.prev}
              className="border-control-border"
              id="gallery-lightbox-prev"
              size="public-icon"
              type="button"
              variant="public-secondary"
              onClick={onPrev}
            >
              <IconChevronLeft size={20} />
            </Button>
            <div
              aria-atomic="true"
              aria-live="polite"
              className="min-w-0 flex-1 text-center"
            >
              <p className="text-sm text-secondary">
                {getCategoryLabel(photo.category)} / {(currentIndex ?? 0) + 1} /{" "}
                {photos.length}
              </p>
              <p className="mt-1 text-base">{caption}</p>
            </div>
            <Button
              aria-label={t.gallery.lightbox.next}
              className="border-control-border"
              id="gallery-lightbox-next"
              size="public-icon"
              type="button"
              variant="public-secondary"
              onClick={onNext}
            >
              <IconChevronRight size={20} />
            </Button>
          </div>
        </>
      )}
    </AccessibleDialog>
  );
}
