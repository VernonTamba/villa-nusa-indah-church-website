"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  IconCalendarEvent,
  IconChevronDown,
  IconMail,
  IconMapPin,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { useLanguage } from "@/lib/i18n";
import { CHURCH_LOCATION } from "@/constants/location";
import { createClient } from "@/utils/supabase/client";

const FALLBACK_SLIDES = [
  { src: "/images/hero-1.webp" },
  { src: "/images/hero-2.webp" },
  { src: "/images/hero-3.webp" },
  { src: "/images/hero-4.webp" },
];

const HERO_LINKS = [
  {
    icon: IconCalendarEvent,
    labelKey: "rundown" as const,
    href: "#rundown",
  },
  {
    icon: IconMapPin,
    labelKey: "location" as const,
    href: "#location",
  },
  {
    icon: IconMail,
    labelKey: "contact" as const,
    href: "#get-in-touch",
  },
];

const Hero = () => {
  const { messages: t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [heroSlides, setHeroSlides] =
    useState<{ src: string }[]>(FALLBACK_SLIDES);
  const shouldReduceMotion = useReducedMotion() ?? false;
  // Detect mobile to skip expensive parallax on low-end devices
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  // Track which slide indices have been rendered in the DOM.
  // We start with the first two so slide 0 loads eagerly and slide 1 is
  // pre-fetched before the first auto-advance fires (~5.6 s).
  // All other slides are added lazily as the carousel reaches them.
  const [renderedSlides, setRenderedSlides] = useState(() => new Set([0, 1]));

  // Fetch hero images from Supabase; fall back to local images if empty
  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("hero_images")
      .select("public_url")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setHeroSlides(data.map((row) => ({ src: row.public_url })));
        }
      });
  }, []);

  // Detect mobile breakpoint (<640px) after mount to disable heavy parallax
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");

    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    mq.addEventListener("change", handler);

    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || paused) return;

    const carouselTimer = window.setInterval(() => {
      setActiveSlide((currentSlide) => {
        const next = (currentSlide + 1) % heroSlides.length;
        // Lazily register the next+1 slide so it pre-fetches before it's needed
        const afterNext = (next + 1) % heroSlides.length;

        setRenderedSlides((prev) => {
          if (prev.has(next) && prev.has(afterNext)) return prev;

          return new Set([...prev, next, afterNext]);
        });

        return next;
      });
    }, 5600);

    return () => window.clearInterval(carouselTimer);
  }, [shouldReduceMotion, paused, heroSlides.length]);

  return (
    <section
      ref={heroRef}
      className="relative -mt-16 min-h-[min(900px,100svh)] overflow-hidden bg-background text-white"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 -inset-y-16 overflow-hidden will-change-transform"
        style={{ y: shouldReduceMotion || isMobile ? 0 : backgroundY }}
      >
        {heroSlides.map((slide, index) => {
          // Skip slides that haven't been queued for rendering yet.
          // This prevents the browser from loading all 4 images on first paint —
          // only the current and next slide are ever in the DOM simultaneously
          // until the carousel naturally cycles through all of them.
          if (!renderedSlides.has(index)) return null;

          return (
            <motion.div
              key={slide.src}
              animate={{
                opacity: activeSlide === index ? 1 : 0,
                // Disable Ken-Burns zoom on mobile to reduce GPU load
                scale:
                  activeSlide === index && !shouldReduceMotion && !isMobile
                    ? 1.04
                    : 1,
              }}
              className="absolute inset-0"
              initial={false}
              transition={{
                opacity: { duration: 1.1, ease: "easeInOut" },
                scale: { duration: 6.2, ease: "easeOut" },
              }}
            >
              <Image
                fill
                alt={`${t.hero.eyebrow} — slide ${index + 1}`}
                className="object-cover object-[center_38%]"
                priority={index === 0}
                sizes="100vw"
                src={slide.src}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <div aria-hidden="true" className="absolute inset-0 bg-black/65" />

      <div className="ns-container relative z-30 flex min-h-[min(900px,100svh)] flex-col pt-28 pb-6 md:pt-36 md:pb-8">
        <div className="flex flex-1 items-center py-6 md:py-10">
          <div className="max-w-3xl space-y-6">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
              initial={false}
              transition={{ delay: 0.12, duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="ns-display max-w-3xl text-white">
                GMAHK Villa Nusa Indah
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white sm:text-lg sm:leading-8">
                {t.hero.description}
              </p>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="ns-actions pt-2"
              initial={false}
              transition={{ delay: 0.22, duration: 0.7, ease: "easeOut" }}
            >
              {HERO_LINKS.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.href}
                    className={
                      item.labelKey === "rundown"
                        ? "ns-primary w-full sm:w-auto"
                        : "ns-secondary w-full sm:w-auto bg-background/70"
                    }
                    href={item.href}
                  >
                    <span className="flex shrink-0 items-center justify-center">
                      <Icon size={20} />
                    </span>
                    <span className="text-base font-semibold">
                      {t.hero.links[item.labelKey]}
                    </span>
                  </a>
                );
              })}
            </motion.div>
            <div className="space-y-2 border-t border-white/25 pt-5 text-sm text-white">
              <p className="font-semibold">{t.location.worshipHoursValue}</p>
              <a
                className="inline-flex min-h-11 max-w-xl items-center gap-2 underline decoration-white/40"
                href="#location"
              >
                <IconMapPin className="shrink-0" size={18} />
                {CHURCH_LOCATION.address}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-6">
          <div
            aria-label={t.common.slide.replace(
              "{count}",
              String(activeSlide + 1),
            )}
            className="flex max-w-full flex-wrap items-center gap-1"
          >
            {heroSlides.map((slide, index) => (
              <button
                key={slide.src + index}
                aria-current={activeSlide === index ? "true" : undefined}
                aria-label={t.common.slide.replace(
                  "{count}",
                  String(index + 1),
                )}
                className={`relative h-11 w-11 rounded-lg after:absolute after:inset-x-2 after:top-5 after:h-1 after:rounded-full ${activeSlide === index ? "after:bg-secondary" : "after:bg-white/60"}`}
                onClick={() => {
                  setRenderedSlides((prev) => new Set([...prev, index]));
                  setActiveSlide(index);
                }}
              />
            ))}
            <button
              aria-label={paused ? t.common.play : t.common.pause}
              className="flex h-11 w-11 items-center justify-center rounded-lg"
              type="button"
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? (
                <IconPlayerPlay size={20} />
              ) : (
                <IconPlayerPause size={20} />
              )}
            </button>
          </div>

          <div className="ml-auto hidden sm:flex items-center gap-3 text-sm font-semibold text-white">
            <span>{t.hero.scroll}</span>
            <motion.span
              animate={shouldReduceMotion ? undefined : { y: [0, 7, 0] }}
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center"
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <IconChevronDown size={20} />
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
