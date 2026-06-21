"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  IconCalendarEvent,
  IconChevronDown,
  IconMail,
  IconMapPin,
  IconSparkles,
} from "@tabler/icons-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { useLanguage } from "@/lib/i18n";
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
  const [heroSlides, setHeroSlides] = useState<{ src: string }[]>(FALLBACK_SLIDES);
  const shouldReduceMotion = useReducedMotion() ?? false;
  // Detect mobile to skip expensive parallax on low-end devices
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

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
    if (shouldReduceMotion) return;

    const carouselTimer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 5600);

    return () => window.clearInterval(carouselTimer);
  }, [shouldReduceMotion, heroSlides.length]);

  return (
    <section
      ref={heroRef}
      className="relative w-screen -mt-16 mb-48 min-h-svh overflow-hidden bg-slate-950 text-white"
      style={{ marginLeft: "calc(50% - 50vw)" }}
    >
      <motion.div
        className="absolute inset-x-0 -inset-y-16 overflow-hidden will-change-transform"
        style={{ y: (shouldReduceMotion || isMobile) ? 0 : backgroundY }}
        aria-hidden="true"
      >
        {heroSlides.map((slide, index) => (
          <motion.div
            key={slide.src}
            className="absolute inset-0"
            animate={{
              opacity: activeSlide === index ? 1 : 0,
              // Disable Ken-Burns zoom on mobile to reduce GPU load
              scale: activeSlide === index && !shouldReduceMotion && !isMobile ? 1.04 : 1,
            }}
            initial={false}
            transition={{
              opacity: { duration: 1.1, ease: "easeInOut" },
              scale: { duration: 6.2, ease: "easeOut" },
            }}
          >
            <Image
              fill
              priority={index === 0}
              src={slide.src}
              alt={`${t.hero.eyebrow} — slide ${index + 1}`}
              sizes="100vw"
              className="object-cover object-[center_38%]"
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,31,26,0.88)_0%,rgba(1,75,63,0.66)_42%,rgba(1,31,26,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.16)_0%,rgba(2,6,23,0.12)_45%,rgba(2,6,23,0.5)_100%)]" />
      </div>

      <div className="relative z-30 mx-auto flex min-h-svh w-full max-w-7xl flex-col px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <div className="flex flex-1 items-center py-8 sm:py-10">
          <div className="max-w-4xl space-y-7">
            <motion.p
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-secondary backdrop-blur-md"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <IconSparkles size={16} />
              {t.hero.eyebrow}
            </motion.p>

            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
                GMAHK Villa Nusa Indah
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white sm:text-lg sm:leading-8">
                {t.hero.description}
              </p>
            </motion.div>

            <motion.div
              className="grid max-w-3xl gap-3 pt-2 sm:grid-cols-3"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.7, ease: "easeOut" }}
            >
              {HERO_LINKS.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 border border-white/20 bg-white/10 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-secondary/70 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary rounded-xl"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform duration-300 group-hover:scale-110">
                      <Icon size={20} />
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {t.hero.links[item.labelKey]}
                    </span>
                  </a>
                );
              })}
            </motion.div>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-6">
          <div className="hidden items-center gap-2 sm:flex" aria-label="Slide indicators">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.src + index}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={activeSlide === index ? "true" : undefined}
                className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                  activeSlide === index
                    ? "w-12 bg-secondary"
                    : "w-6 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3 text-sm font-semibold text-white">
            <span>{t.hero.scroll}</span>
            <motion.span
              aria-hidden="true"
              animate={shouldReduceMotion ? undefined : { y: [0, 7, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md"
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
