"use client";

import Image from "next/image";

import { useLanguage } from "@/lib/i18n";

// Stable on the server and client to avoid a hydration-time image swap.
const BG_IMAGES = [1, 4, 7, 10, 13, 16].map(
  (index) => `/images/gallery-opt/gallery_${index}.webp`,
);

export function GalleryHero() {
  const { messages: t } = useLanguage();

  return (
    <section
      aria-labelledby="gallery-heading"
      className="relative overflow-hidden bg-background text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-3 grid-rows-2"
      >
        {BG_IMAGES.map((src, index) => (
          <div key={src} className="relative">
            <Image
              fill
              alt=""
              className="object-cover"
              priority={index < 3}
              quality={60}
              sizes="34vw"
              src={src}
            />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-black/65" />
      <div className="ns-container ns-section relative">
        <h1 className="ns-title" id="gallery-heading">
          {t.gallery.titleStart}
          <span className="text-secondary">{t.gallery.titleEmphasis}</span>
        </h1>
        <p className="ns-lead mt-4 text-white">{t.gallery.description}</p>
      </div>
    </section>
  );
}
