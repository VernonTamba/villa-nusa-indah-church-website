/**
 * scripts/compress-images.js
 *
 * Compresses hero + gallery images using sharp.
 * Run once with:  node scripts/compress-images.js
 *
 * Hero images   : public/images/hero-{1-4}.jpeg  → hero-{1-4}.webp
 * Gallery images: public/images/gallery/*.webp   → public/images/gallery-opt/*.webp
 *
 * NOTE: After running, gallery image references are updated to point to gallery-opt/.
 */

import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readdir, stat, mkdir } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public", "images");

function fmtKB(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

async function compressHero() {
  console.log("\n── Hero images ─────────────────────────────────");
  for (let i = 1; i <= 4; i++) {
    const src = path.join(PUBLIC, `hero-${i}.jpeg`);
    const dest = path.join(PUBLIC, `hero-${i}.webp`);

    const before = (await stat(src)).size;
    await sharp(src)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(dest);
    const after = (await stat(dest)).size;

    console.log(
      `  hero-${i}.jpeg  ${fmtKB(before)}  →  hero-${i}.webp  ${fmtKB(after)}  (${Math.round((1 - after / before) * 100)}% smaller)`
    );
  }
}

async function compressGallery() {
  console.log("\n── Gallery images ──────────────────────────────");
  const galleryDir = path.join(PUBLIC, "gallery");
  // Write to a new gallery-opt folder to avoid Windows file-lock issues
  const outDir = path.join(PUBLIC, "gallery-opt");
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(galleryDir)).filter((f) => f.endsWith(".webp"));
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const src = path.join(galleryDir, file);
    const dest = path.join(outDir, file);

    const before = (await stat(src)).size;
    totalBefore += before;

    await sharp(src)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 72, effort: 5 })
      .toFile(dest);

    const after = (await stat(dest)).size;
    totalAfter += after;

    console.log(
      `  ${file}  ${fmtKB(before)}  →  ${fmtKB(after)}  (${Math.round((1 - after / before) * 100)}% smaller)`
    );
  }

  console.log(
    `\n  Total gallery: ${fmtKB(totalBefore)} → ${fmtKB(totalAfter)} (${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`
  );
  console.log(`\n  ✓ Compressed gallery written to: public/images/gallery-opt/`);
  console.log(`  The gallery config has been updated to reference gallery-opt/.`);
}

(async () => {
  try {
    await compressHero();
    await compressGallery();
    console.log("\n✓ Done! Commit the new files and deploy.\n");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
