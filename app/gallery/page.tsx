import type { Metadata } from "next";

import { GalleryHero } from "@/components/gallery-hero";
import { GalleryGrid } from "@/components/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos of worship, activities, fellowship, youth, children's ministry, and more from GMAHK Villa Nusa Indah.",
  openGraph: {
    title: "Gallery | GMAHK Villa Nusa Indah",
    description:
      "A glimpse into the vibrant life and warm community of GMAHK Villa Nusa Indah.",
    images: [{ url: "/images/gallery/gallery_1.webp", width: 1200, height: 800 }],
  },
};

export default function GalleryPage() {
  return (
    <main>
      <GalleryHero />
      <GalleryGrid />
    </main>
  );
}
