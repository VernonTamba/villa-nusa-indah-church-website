"use client";

import { useState, useCallback, useRef, useEffect, MouseEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { galleryPhotos, type GalleryCategory, type GalleryPhoto } from "@/config/gallery";
import { useLanguage } from "@/lib/i18n";
import { GalleryLightbox } from "@/components/gallery-lightbox";

type FilterKey = "all" | GalleryCategory;

const FILTER_KEYS: FilterKey[] = ["all", "worship", "activities"];
const PAGE_SIZE = 12;

// ── Photo Card ────────────────────────────────────────────────────────────────
// Extracted so we can use hooks per-card for the magnetic + tilt effects.
interface PhotoCardProps {
  photo: GalleryPhoto;
  index: number;
  caption: string;
  categoryLabel: string;
  onOpen: (index: number) => void;
  /** When true, disables expensive 3D tilt & glow for mobile perf */
  isMobile: boolean;
}

function PhotoCard({ photo, index, caption, categoryLabel, onOpen, isMobile }: PhotoCardProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const disableTilt = shouldReduceMotion || isMobile;
  const cardRef = useRef<HTMLDivElement>(null);

  // State for 3D tilt + magnetic glow tracking
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (disableTilt || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      // Normalize to ±1 then multiply for max tilt degrees
      const rotY = (dx / (rect.width / 2)) * 7;
      const rotX = -(dy / (rect.height / 2)) * 7;
      // Glow position as percentage
      const glowX = ((e.clientX - rect.left) / rect.width) * 100;
      const glowY = ((e.clientY - rect.top) / rect.height) * 100;
      setTilt({ x: rotX, y: rotY });
      setGlowPos({ x: glowX, y: glowY });
    },
    [disableTilt],
  );

  const handleMouseEnter = useCallback(() => {
    if (!disableTilt) setIsHovered(true);
  }, [disableTilt]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
  }, []);

  return (
    <motion.div
      key={photo.id}
      id={`gallery-photo-${photo.id}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: Math.min(index * 0.045, 0.4),
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-2xl bg-default-100 shadow-md"
      style={{
        transform: disableTilt
          ? undefined
          : `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered
          ? "transform 0.1s ease-out, box-shadow 0.3s ease"
          : "transform 0.5s ease-out, box-shadow 0.3s ease",
        boxShadow: isHovered
          ? "0 20px 60px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2)"
          : "0 4px 12px rgba(0,0,0,0.12)",
        willChange: disableTilt ? "auto" : "transform",
      }}
      ref={cardRef}
      onClick={() => onOpen(index)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`${caption} — ${categoryLabel}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(index);
      }}
    >
      {/* ── Shimmer skeleton shown before image loads ── */}
      {!isLoaded && (
        <div
          className="absolute inset-0 z-10 animate-pulse rounded-2xl"
          style={{
            background:
              "linear-gradient(110deg, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 70%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.6s infinite",
          }}
        />
      )}

      {/* ── Image ── */}
      <div className="relative overflow-hidden">
        <Image
          src={photo.src}
          alt={caption}
          width={900}
          height={700}
          className={`block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-105 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
          onLoad={() => setIsLoaded(true)}
        />

        {/* ── Spotlight glow (desktop only) ── */}
        {!isMobile && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(52, 211, 153, 0.18) 0%, rgba(16, 185, 129, 0.08) 35%, transparent 65%)`,
            }}
          />
        )}

        {/* ── Subtle top-to-bottom gradient for depth ── */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      </div>
    </motion.div>
  );
}

// ── Gallery Grid ──────────────────────────────────────────────────────────────
export function GalleryGrid() {
  const { messages: t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile after mount to avoid hydration mismatch
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i - 1 + visiblePhotos.length) % visiblePhotos.length,
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
  const handleFilterChange = useCallback(
    (key: FilterKey) => {
      setLightboxIndex(null);
      setVisibleCount(PAGE_SIZE); // reset pagination when filter changes
      setActiveFilter(key);
    },
    [],
  );

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  return (
    <>
      {/* ── Shimmer keyframe injected globally once ── */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24 lg:px-12">
        {/* ── Filter tabs ─────────────────────────────────────────────────── */}
        <div className="mb-12 flex flex-col items-center gap-6 text-center">
          <motion.div
            className="flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            role="group"
            aria-label="Filter photos by category"
          >
            {FILTER_KEYS.map((key) => (
              <button
                key={key}
                id={`gallery-filter-${key}`}
                onClick={() => handleFilterChange(key)}
                aria-pressed={activeFilter === key}
                className="relative px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                {activeFilter === key && (
                  <motion.span
                    layoutId="gallery-filter-pill"
                    className="absolute inset-0 rounded-full bg-secondary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    style={{ zIndex: 0 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    activeFilter === key
                      ? "text-secondary-foreground"
                      : "text-foreground/55 hover:text-foreground"
                  }`}
                >
                  {getFilterLabel(key)}
                </span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* ── Masonry grid ────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="columns-1 gap-4 sm:columns-2 lg:columns-3"
          >
            {visiblePhotos.map((photo, i) => {
              const caption = (t.gallery.captions as Record<string, string>)[
                photo.captionKey
              ];
              const categoryLabel = getCategoryLabel(photo.category);

              return (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  caption={caption}
                  categoryLabel={categoryLabel}
                  onOpen={openLightbox}
                  isMobile={isMobile}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── Load More button ─────────────────────────────────────────────── */}
        {hasMore && (
          <motion.div
            className="mt-12 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              id="gallery-load-more"
              onClick={handleLoadMore}
              className="group flex items-center gap-2.5 rounded-full border border-secondary/40 bg-secondary/10 px-7 py-3 text-sm font-semibold text-secondary shadow-sm transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:shadow-[0_8px_24px_rgba(248,167,36,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              <motion.span
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                ✦
              </motion.span>
              Load {Math.min(PAGE_SIZE, remainingCount)} more
              <span className="text-xs opacity-60">
                ({remainingCount} remaining)
              </span>
            </button>
            <p className="text-xs text-foreground/40">
              Showing {visibleCount} of {filteredPhotos.length} photos
            </p>
          </motion.div>
        )}
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      <GalleryLightbox
        photos={visiblePhotos}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrev={goPrev}
        onNext={goNext}
        getCategoryLabel={getCategoryLabel}
      />
    </>
  );
}
