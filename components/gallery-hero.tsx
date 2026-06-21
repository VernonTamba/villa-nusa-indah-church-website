"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { IconSparkles, IconChevronDown } from "@tabler/icons-react";
import { useLanguage } from "@/lib/i18n";

/** Full pool of all gallery images for the background collage. */
const ALL_BG_IMAGES = Array.from(
  { length: 30 },
  (_, i) => `/images/gallery-opt/gallery_${i + 1}.webp`,
);

/** Shuffle an array using Fisher-Yates and return the first `count` items. */
function sampleImages(pool: string[], count: number): string[] {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

/**
 * Per-cell drift keyframes so each background tile animates independently,
 * creating a subtle living-collage feel. More varied and dynamic.
 */
const CELL_DRIFTS: Array<{ scale: number[]; x: number[]; y: number[]; duration: number }> = [
  { scale: [1, 1.10, 1.04, 1], x: [0, 12, -6, 0], y: [0, -8, 4, 0], duration: 18 },
  { scale: [1, 1.12, 1.06, 1], x: [0, -14, 7, 0], y: [0, 10, -5, 0], duration: 22 },
  { scale: [1, 1.08, 1.05, 1], x: [0, 9, -4, 0], y: [0, 12, -6, 0], duration: 20 },
  { scale: [1, 1.13, 1.07, 1], x: [0, -10, 6, 0], y: [0, -12, 7, 0], duration: 24 },
  { scale: [1, 1.09, 1.04, 1], x: [0, 15, -8, 0], y: [0, 6, -3, 0], duration: 19 },
  { scale: [1, 1.11, 1.06, 1], x: [0, -11, 5, 0], y: [0, -9, 5, 0], duration: 21 },
];

export function GalleryHero() {
  const { messages: t } = useLanguage();
  const shouldReduceMotion = useReducedMotion() ?? false;

  // Pick 6 random images from the full pool — reshuffled on every page load.
  const bgImages = useMemo(() => sampleImages(ALL_BG_IMAGES, 6), []);

  return (
    <section
      className="relative w-screen -mt-16 min-h-[72vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white"
      style={{ marginLeft: "calc(50% - 50vw)" }}
    >
      {/* ── Blurred collage background ── */}
      <div
        className="absolute inset-0 grid grid-cols-3 grid-rows-2"
        aria-hidden="true"
      >
        {bgImages.map((src, i) => (
          <div key={src} className="relative overflow-hidden">
            <motion.div
              className="absolute inset-0"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: CELL_DRIFTS[i].scale,
                      x: CELL_DRIFTS[i].x,
                      y: CELL_DRIFTS[i].y,
                    }
              }
              transition={{
                duration: CELL_DRIFTS[i].duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="34vw"
                className="object-cover brightness-75"
                quality={35}
                priority={i < 3}
              />
            </motion.div>
          </div>
        ))}
      </div>

      {/* ── Gradient overlays ── */}
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,31,26,0.82)_0%,rgba(1,75,63,0.48)_50%,rgba(1,31,26,0.82)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.28)_0%,rgba(2,6,23,0.10)_45%,rgba(2,6,23,0.72)_100%)]"
        aria-hidden="true"
      />

      {/* ── Hero content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[72vh] px-6 py-28 text-center max-w-4xl mx-auto w-full gap-6">
        {/* Eyebrow pill */}
        <motion.p
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-secondary backdrop-blur-md"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <IconSparkles size={15} />
          {t.gallery.eyebrow}
        </motion.p>

        {/* Title */}
        <motion.h1
          className="text-5xl sm:text-7xl font-black leading-[1.02] tracking-tight text-white"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
        >
          {t.gallery.titleStart}
          <span className="bg-gradient-to-r from-secondary via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            {t.gallery.titleEmphasis}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="max-w-xl text-base sm:text-lg leading-7 text-white/75"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.65, ease: "easeOut" }}
        >
          {t.gallery.description}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="mt-6 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <motion.span
            aria-hidden="true"
            animate={shouldReduceMotion ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-md"
          >
            <IconChevronDown size={20} />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
