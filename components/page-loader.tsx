"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import AdventistLogo from "@/public/icons/advent.svg";

/**
 * Full-screen page transition loader.
 *
 * - Appears when navigating between distinct routes (pathname without hash changes).
 * - Does NOT appear for same-page anchor jumps (#rundown, #location, etc.).
 * - Shows the church logo + animated top-bar progress fill, then fades out.
 */
export default function PageLoader() {
  const pathname = usePathname();

  // Track the "previous" pathname so we can detect a real route change.
  const prevPathRef = useRef<string>(pathname);

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Ramp the progress bar from 0 → 85 % automatically, then snap to 100 % when done.
  const progressRafRef = useRef<number | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startLoad() {
    // Cancel any in-flight animation
    if (progressRafRef.current !== null) cancelAnimationFrame(progressRafRef.current);
    if (hideTimerRef.current !== null) clearTimeout(hideTimerRef.current);

    setProgress(0);
    setIsLoading(true);

    // Animate the bar up to ~85 % over ~1.2 s using easeOut curve
    const startTime = performance.now();
    const DURATION = 1200; // ms
    const TARGET = 85;

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased * TARGET);
      if (t < 1) {
        progressRafRef.current = requestAnimationFrame(tick);
      }
    }
    progressRafRef.current = requestAnimationFrame(tick);
  }

  function finishLoad() {
    if (progressRafRef.current !== null) {
      cancelAnimationFrame(progressRafRef.current);
      progressRafRef.current = null;
    }
    // Snap bar to 100 % then fade the overlay out after a short delay
    setProgress(100);
    hideTimerRef.current = setTimeout(() => setIsLoading(false), 400);
  }

  useEffect(() => {
    // Strip any hash from the current pathname before comparing
    const strippedPath = pathname.split("#")[0];
    const prevStripped = prevPathRef.current.split("#")[0];

    if (strippedPath !== prevStripped) {
      // Real route change — show loader immediately
      startLoad();
      // Wait for the next paint before finishing so the bar is visible
      // Next.js triggers a re-render once the new page is ready.
      // We finish as soon as this effect runs with the new pathname.
      // Using a tiny timeout gives the ramp animation a chance to play.
      const finishTimer = setTimeout(finishLoad, 600);
      prevPathRef.current = pathname;
      return () => clearTimeout(finishTimer);
    }

    prevPathRef.current = pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressRafRef.current !== null) cancelAnimationFrame(progressRafRef.current);
      if (hideTimerRef.current !== null) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          aria-live="polite"
          aria-label="Loading page"
        >
          {/* ── Top progress bar ─────────────────────────────────────────── */}
          <div
            className="absolute inset-x-0 top-0 h-[3px] bg-foreground/10"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-secondary to-primary"
              style={{ scaleX: progress / 100 }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          {/* ── Center content: logo + church name ───────────────────────── */}
          <motion.div
            className="flex flex-col items-center gap-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Logo badge */}
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-[0_12px_36px_rgba(0,0,0,0.18)]">
              <Image
                src={AdventistLogo}
                alt="Adventist Logo"
                width={44}
                height={44}
                className="h-11 w-11"
                priority
              />
            </div>

            {/* Church name */}
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50">
                GMAHK
              </p>
              <p className="mt-0.5 text-lg font-bold tracking-tight text-foreground">
                Villa Nusa Indah
              </p>
            </div>

            {/* Animated dots */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-secondary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
