"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

import {
  galleryPhotos,
  type GalleryCategory,
  type GalleryPhoto,
} from "@/config/gallery";
import { useLanguage } from "@/lib/i18n";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { Button } from "@/components/ui/button";

type FilterKey = "all" | GalleryCategory;

const FILTER_KEYS: FilterKey[] = ["all", "worship", "activities"];
const PAGE_SIZE = 12;

// ── Photo Card ────────────────────────────────────────────────────────────────
// Native buttons keep photo opening accessible to keyboard and touch users.
interface PhotoCardProps {
  photo: GalleryPhoto;
  index: number;
  caption: string;
  categoryLabel: string;
  onOpen: (index: number) => void;
}

function PhotoCard({
  photo,
  index,
  caption,
  categoryLabel,
  onOpen,
}: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <button
      aria-haspopup="dialog"
      aria-label={caption + " - " + categoryLabel}
      className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-surface text-left md:mb-6"
      id={`gallery-photo-${photo.id}`}
      type="button"
      onClick={() => onOpen(index)}
    >
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-card motion-reduce:animate-none"
        />
      )}
      <Image
        alt={caption}
        className="block h-auto w-full transition-opacity duration-200 group-hover:opacity-90 motion-reduce:transition-none"
        height={700}
        quality={75}
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
        src={photo.src}
        width={900}
        onLoad={() => setIsLoaded(true)}
      />
    </button>
  );
}

// ── Gallery Grid ──────────────────────────────────────────────────────────────
export function GalleryGrid() {
  const { messages: t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getCategoryLabel = useCallback(
    (category: GalleryCategory): string =>
      (t.gallery.filters as Record<string, string>)[category] ?? category,
    [t],
  );

  const getFilterLabel = useCallback(
    (key: FilterKey): string =>
      key === "all"
        ? t.gallery.filters.all
        : getCategoryLabel(key as GalleryCategory),
    [t, getCategoryLabel],
  );

  // ── Filtered photos ───────────────────────────────────────────────────────
  const filteredPhotos: GalleryPhoto[] =
    activeFilter === "all"
      ? galleryPhotos
      : galleryPhotos.filter((p) => p.category === activeFilter);

  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  const remainingCount = filteredPhotos.length - visibleCount;
  const hasMore = remainingCount > 0;

  // ── Lightbox controls ────────────────────────────────────────────────────
  const openLightbox = useCallback(
    (index: number) => setLightboxIndex(index),
    [],
  );
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null
          ? null
          : (i - 1 + visiblePhotos.length) % visiblePhotos.length,
      ),
    [visiblePhotos.length],
  );
  const goNext = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i + 1) % visiblePhotos.length,
      ),
    [visiblePhotos.length],
  );

  // Close lightbox when filter changes (avoids index mismatch)
  const handleFilterChange = useCallback((key: FilterKey) => {
    setLightboxIndex(null);
    setVisibleCount(PAGE_SIZE); // reset pagination when filter changes
    setActiveFilter(key);
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  return (
    <>
      <section
        aria-label={t.common.filterPhotos}
        className="ns-container pb-12 pt-8 md:pb-20"
      >
        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div
            aria-label={t.common.filterPhotos}
            className="flex flex-wrap gap-2"
            role="group"
          >
            {FILTER_KEYS.map((key) => (
              <Button
                key={key}
                aria-controls="gallery-results"
                aria-pressed={activeFilter === key}
                className={
                  activeFilter === key ? undefined : "border-control-border"
                }
                id={`gallery-filter-${key}`}
                size="public"
                type="button"
                variant={
                  activeFilter === key ? "public-primary" : "public-secondary"
                }
                onClick={() => handleFilterChange(key)}
              >
                {getFilterLabel(key)}
              </Button>
            ))}
          </div>
          <p aria-atomic="true" className="ns-caption" role="status">
            {t.common.showingPhotos
              .replace("{count}", String(visiblePhotos.length))
              .replace("{total}", String(filteredPhotos.length))}
          </p>
        </div>
        <div
          className="columns-1 gap-4 md:gap-6 sm:columns-2 lg:columns-3"
          id="gallery-results"
        >
          {visiblePhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              caption={
                (t.gallery.captions as Record<string, string>)[photo.captionKey]
              }
              categoryLabel={getCategoryLabel(photo.category)}
              index={index}
              photo={photo}
              onOpen={openLightbox}
            />
          ))}
        </div>
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <Button
              className="flex-wrap border-control-border"
              id="gallery-load-more"
              size="public"
              type="button"
              variant="public-secondary"
              onClick={handleLoadMore}
            >
              {t.common.loadMore.replace(
                "{count}",
                String(Math.min(PAGE_SIZE, remainingCount)),
              )}
              <span className="text-sm">
                ({t.common.remaining.replace("{count}", String(remainingCount))}
                )
              </span>
            </Button>
          </div>
        )}
      </section>
      <GalleryLightbox
        currentIndex={lightboxIndex}
        getCategoryLabel={getCategoryLabel}
        photos={visiblePhotos}
        onClose={closeLightbox}
        onNext={goNext}
        onPrev={goPrev}
      />
    </>
  );
}
