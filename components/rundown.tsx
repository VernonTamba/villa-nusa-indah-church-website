"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  IconBook2,
  IconChevronLeft,
  IconChevronRight,
  IconCoffee,
  IconMicrophone2,
  IconMusic,
  IconPackage,
  IconScanPosition,
  IconSparkles,
  IconUsersGroup,
  type Icon as TablerIcon,
} from "@tabler/icons-react";

/** Map from the serializable string key stored in RUNDOWN_ITEMS to the actual icon component. */
const RUNDOWN_ICON_MAP: Record<string, TablerIcon> = {
  IconBook2,
  IconCoffee,
  IconMicrophone2,
  IconMusic,
  IconPackage,
  IconScanPosition,
  IconSparkles,
  IconUsersGroup,
};
import { Button } from "@/components/ui/button";
import SideSheet from "./ui/side-sheet";
import { Accordion, AccordionItem } from "@heroui/react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, viewport } from "@/lib/animations";
import {
  RUNDOWN_ITEMS,
  SCROLL_MOMENTS,
  type ScrollMoment,
} from "@/constants/rundown";
import { useLanguage, type Locale } from "@/lib/i18n";
import { createClient } from "@/utils/supabase/client";

// Derive the same snake_case key used in the admin panel
function toKey(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

// ─── Desktop: Scroll-Stack Card ───────────────────────────────────────────────

type ScrollStackCardProps = {
  item: ScrollMoment;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
};

const ScrollStackCard = ({
  item,
  index,
  total,
  progress,
  reduceMotion,
}: ScrollStackCardProps) => {
  const segment = 1 / total;
  const start = index * segment;
  const settle = start + segment * 0.26;
  const hold = start + segment * 0.72;
  const end = start + segment;
  const enter = start - segment * 0.55;
  const exit = end + segment * 0.45;
  const direction = index % 2 === 0 ? 1 : -1;
  const scale = useTransform(
    progress,
    [enter, start, hold, end, exit],
    reduceMotion ? [1.04, 1, 1, 0.96, 0.92] : [1.16, 1, 1, 0.88, 0.8],
  );
  const y = useTransform(
    progress,
    [enter, start, settle, end, exit],
    reduceMotion ? [24, 0, 0, -8, -18] : [120, 0, 0, -18, -58],
  );
  const opacity = useTransform(
    progress,
    [enter, start, hold, exit],
    reduceMotion ? [0, 1, 1, 0.72] : [0, 1, 1, 0.4],
  );
  const rotate = useTransform(
    progress,
    [enter, start, exit],
    reduceMotion ? [0, 0, 0] : [3 * direction, 0, -2 * direction],
  );
  const imageScale = useTransform(
    progress,
    [start, hold, exit],
    reduceMotion ? [1.02, 1.01, 1] : [1.08, 1.04, 1],
  );
  const contentOpacity = useTransform(
    progress,
    [enter, start, end],
    reduceMotion ? [0.85, 1, 0.95] : [0.5, 1, 0.84],
  );

  return (
    <motion.figure
      className="absolute inset-0 w-full origin-top transform-gpu will-change-transform"
      style={{ scale, y, opacity, rotate, zIndex: index + 1 }}
    >
      <div className="relative flex h-full overflow-hidden rounded-[32px] border border-white/20 bg-slate-950 shadow-[0_28px_80px_rgba(2,6,23,0.28)]">
        <motion.img
          src={item.image}
          alt={`${item.title} placeholder image`}
          loading={index === 0 ? "eager" : "lazy"}
          className="h-full w-full object-cover"
          style={{ scale: imageScale }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.72))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(248,167,36,0.22),transparent_32%)]" />

        <motion.figcaption
          className="absolute inset-x-0 bottom-0 space-y-4 p-5 sm:p-8 md:p-10"
          style={{ opacity: contentOpacity }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
              {item.label}
            </span>
            <span className="text-xs font-semibold tracking-[0.35em] text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="max-w-2xl space-y-3">
            <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              {item.title}
            </h3>
            <p className="max-w-xl text-sm leading-6 text-white sm:text-base">
              {item.description}
            </p>
          </div>
        </motion.figcaption>
      </div>
    </motion.figure>
  );
};

// ─── Mobile: Swipeable Card Carousel ──────────────────────────────────────────

type MobileCardCarouselProps = {
  moments: ScrollMoment[];
  reduceMotion: boolean;
};

const MobileCardCarousel = ({ moments, reduceMotion }: MobileCardCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = forward (left swipe), -1 = backward (right swipe)
  const total = moments.length;

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(total - 1, next));
    if (clamped === activeIndex) return;
    setDirection(clamped > activeIndex ? 1 : -1);
    setActiveIndex(clamped);
  };

  // Slide variants: entering card slides in from the side, exiting card scales back slightly
  const cardVariants = {
    enter: (dir: number) => ({
      x: dir >= 0 ? "72%" : "-72%",
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (dir: number) => ({
      x: dir >= 0 ? "-28%" : "28%",
      opacity: 0,
      scale: 0.94,
      transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const current = moments[activeIndex];

  return (
    <div className="mt-6 select-none">
      {/* Card area — pure image, no text overlay */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        <div className="absolute inset-0 overflow-hidden rounded-[20px] shadow-[0_20px_60px_rgba(2,6,23,0.32)]">
          <AnimatePresence custom={direction} mode="wait" initial={false}>
            <motion.figure
              key={activeIndex}
              custom={direction}
              variants={reduceMotion ? undefined : cardVariants}
              initial={reduceMotion ? { opacity: 0 } : "enter"}
              animate={reduceMotion ? { opacity: 1 } : "center"}
              exit={reduceMotion ? { opacity: 0 } : "exit"}
              drag={!reduceMotion ? "x" : undefined}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                const THRESHOLD = 48;
                if (info.offset.x < -THRESHOLD && activeIndex < total - 1) {
                  goTo(activeIndex + 1);
                } else if (info.offset.x > THRESHOLD && activeIndex > 0) {
                  goTo(activeIndex - 1);
                }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              style={{ touchAction: "pan-y" }}
            >
              {/* Clean image — no caption overlay */}
              <img
                src={current.image}
                alt={current.title}
                loading="eager"
                draggable={false}
                className="h-full w-full object-cover pointer-events-none"
              />
            </motion.figure>
          </AnimatePresence>

          {/* Subtle vignette so arrows stay readable */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(2,6,23,0.35))]" />

          {/* Prev arrow */}
          <button
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous moment"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/50 disabled:opacity-0 disabled:pointer-events-none"
          >
            <IconChevronLeft size={16} stroke={2.5} />
          </button>

          {/* Next arrow */}
          <button
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === total - 1}
            aria-label="Next moment"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/50 disabled:opacity-0 disabled:pointer-events-none"
          >
            <IconChevronRight size={16} stroke={2.5} />
          </button>
        </div>
      </div>

      {/* ── Text content below the image ─────────────────────────────────── */}
      <div className="mt-4 px-1">
        {/* Label row + counter */}
        <div className="flex items-center justify-between gap-3">
          <AnimatePresence mode="wait">
            <motion.span
              key={`label-${activeIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="inline-flex rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary"
            >
              {current.label}
            </motion.span>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Moment indicators">
            {moments.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to moment ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-6 bg-secondary"
                    : "w-2 bg-foreground/20 dark:bg-white/30 hover:bg-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Title + description — animate on slide change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${activeIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 space-y-1"
          >
            <h3 className="text-lg font-bold leading-snug text-primary dark:text-white">
              {current.title}
            </h3>
            <p className="text-sm leading-relaxed text-foreground/70 dark:text-white/65 line-clamp-3">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Swipe hint */}
        <p className="mt-3 text-center text-[10px] tracking-wide text-foreground/35 dark:text-white/30">
          swipe or tap arrows to navigate
        </p>
      </div>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNextSaturday(locale: Locale): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  // ensures "next" Saturday, not today if it's already Saturday

  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + daysUntilSaturday);

  return nextSaturday.toLocaleDateString(locale === "id" ? "id-ID" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────

const Rundown = () => {
  const { locale, messages: t } = useLanguage();
  const [openSheet, setOpenSheet] = useState<number | null>(null);
  // isMobile starts false (matches SSR) and is updated after mount via MediaQueryList.
  // This avoids a hydration mismatch while still adapting to the real screen size.
  const [isMobile, setIsMobile] = useState(false);

  const scrollStackRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  // Manual scroll tracking — more reliable than useScroll({target}) when the
  // scroll stack lives outside a constrained parent container.
  const rawProgress = useMotionValue(0);
  const smoothScrollProgress = useSpring(rawProgress, {
    stiffness: 60,
    damping: 22,
    mass: 0.9,
  });

  useEffect(() => {
    const handleScroll = () => {
      const el = scrollStackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      // scrolled = how far the element's top has moved above the viewport top
      const scrolled = -rect.top;
      rawProgress.set(total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // seed initial value
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rawProgress]);

  // DB participant name lookup: service_key -> role_key -> participant_name
  const [dbParticipants, setDbParticipants] = useState<Record<string, Record<string, string>>>({});
  // DB sabbath moments (images from storage)
  const [dbMoments, setDbMoments] = useState<ScrollMoment[] | null>(null);

  useEffect(() => {
    const supabase = createClient();
    // Fetch participant names
    supabase.from("rundown_participants").select("service_key,role_key,participant_name").then(({ data }) => {
      if (!data) return;
      const lookup: Record<string, Record<string, string>> = {};
      for (const row of data) {
        if (!lookup[row.service_key]) lookup[row.service_key] = {};
        lookup[row.service_key][row.role_key] = row.participant_name;
      }
      setDbParticipants(lookup);
    });
    // Fetch sabbath moments
    supabase
      .from("sabbath_moments")
      .select("label,title,description,public_url")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDbMoments(
            data.map((row) => ({
              label: row.label,
              title: row.title,
              description: row.description,
              image: row.public_url,
            })),
          );
        }
      });
  }, []);

  // Detect mobile breakpoint (< 640px = Tailwind's `sm`) after mount.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const rundownItems = RUNDOWN_ITEMS.map((item, index) => {
    const sk = toKey(item.title);
    return {
      ...item,
      ...t.rundown.items[index],
      participants: item.participants.map((participant, participantIndex) => {
        const rk = toKey(participant.rundown);
        return {
          ...participant,
          rundown: t.rundown.items[index].participants[participantIndex],
          // Use DB name if available, otherwise fall back to constant
          participant: dbParticipants[sk]?.[rk] ?? participant.participant,
        };
      }),
    };
  });

  const scrollMoments = (dbMoments ?? SCROLL_MOMENTS).map((moment, index) => ({
    ...moment,
    // Only overlay i18n text if using fallback static moments
    ...(dbMoments ? {} : t.rundown.moments[index]),
  }));

  return (
    <div id="rundown" className="mb-48 scroll-mt-24">
      <motion.h2
        className="scroll-m-20 text-5xl font-extrabold tracking-tight text-center text-primary px-2 mb-6"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {t.rundown.titleStart}
        <span className="text-secondary">{t.rundown.titleEmphasis}</span>
      </motion.h2>

      <div className="my-12">
        <div className="relative mx-auto max-w-6xl">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/20 via-secondary/60 to-primary/20 lg:block" />

          <motion.div
            key={locale}
            className="flex flex-col gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {rundownItems.map((item, index) => {
              const isEven = index % 2 === 0;
              const isLast = index === RUNDOWN_ITEMS.length - 1;
              const Icon = RUNDOWN_ICON_MAP[item.icon] ?? IconSparkles;

              return (
                <Fragment key={item.title}>
                  <SideSheet
                    open={openSheet === index}
                    onClose={() => setOpenSheet(null)}
                    title={item.title}
                    width="w-full sm:max-w-lg"
                  >
                    <div className="space-y-1 p-5">
                      <p className="text-base font-medium text-foreground dark:text-white">
                        {t.rundown.sabbath}, {getNextSaturday(locale)}
                      </p>
                      <p className="text-sm text-foreground dark:text-white mb-4">
                        {item.time}
                      </p>
                      <Accordion variant="bordered" isCompact className="!my-4">
                        <AccordionItem
                          aria-label={item.title}
                          title={
                            <span className="text-sm font-medium">
                              {t.rundown.serviceQuestion}
                            </span>
                          }
                        >
                          <div className="flex flex-col gap-3 pb-2 text-xs">
                            <p>{item.subdetail}</p>
                            {item.image && (
                              <img
                                src={item.image}
                                alt={`${item.title} situation`}
                                className="w-full rounded-xl object-cover max-h-40"
                                loading="lazy"
                              />
                            )}
                          </div>
                        </AccordionItem>
                      </Accordion>
                      <div className="space-y-3 mt-6">
                        {item.participants.length > 0 && (
                          item.participants.map((p) => {
                            const ParticipantIcon = RUNDOWN_ICON_MAP[p.icon] ?? IconSparkles;
                            return (
                              <div
                                key={p.rundown}
                                className="flex items-center gap-3 rounded-lg border border-border hover:border-l-4 hover:border-l-primary p-3 pl-4 transition-colors duration-300"
                              >
                                <ParticipantIcon size={16} />
                                <div>
                                  <p className="text-sm font-medium text-foreground dark:text-white">
                                    {p.rundown}
                                  </p>
                                  <p className="text-xs text-foreground dark:text-white mt-0.5">
                                    {p.participant}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </SideSheet>
                  <motion.div
                    variants={staggerItem}
                    className={`group relative flex w-full ${
                      isEven ? "lg:justify-start" : "lg:justify-end"
                    }`}
                  >
                    {!isLast ? (
                      <div className="pointer-events-none absolute left-5 top-16 h-[calc(100%+1.5rem)] w-px bg-gradient-to-b from-secondary/70 to-primary/20 lg:hidden" />
                    ) : null}

                    <div className="pointer-events-none absolute left-5 top-14 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-4 border-background bg-secondary shadow-[0_0_0_8px_rgba(248,167,36,0.14)] transition-all duration-300 group-hover:scale-110 group-hover:bg-primary lg:left-1/2" />

                    <div className="ml-12 w-full lg:ml-0 lg:w-[calc(50%-3rem)]">
                      <div className="relative flex min-h-[220px] w-full flex-col justify-between overflow-hidden rounded-[28px] border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,255,255,0.72))] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_26px_65px_rgba(1,75,63,0.18)] dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,167,36,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(1,75,63,0.12),transparent_32%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                        <div className="relative z-10 flex items-start justify-between gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-secondary">
                            <Icon size={28} />
                          </div>

                          <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setOpenSheet(index)}
                          >
                            {t.rundown.viewDetail} <IconScanPosition />
                          </Button>
                        </div>

                        <div className="relative z-10 mt-6 space-y-3">
                          <h2 className="text-2xl font-bold text-primary dark:text-white">
                            {item.title}
                          </h2>
                          <p className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-sm font-semibold text-primary dark:border-white/10 dark:bg-white/5 dark:text-secondary">
                            <IconSparkles size={16} />
                            {item.time}
                          </p>
                          <p className="max-w-md text-sm leading-6 text-foreground dark:text-white">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Fragment>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className="mt-28">
        {/* Heading stays within the narrow centred column */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0">
          <motion.div
            className="space-y-3 text-center w-full"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
              {t.rundown.momentsLabel}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-primary dark:text-white">
              {t.rundown.momentsTitle}
            </h2>
          </motion.div>
        </div>

        {/* Mobile: swipeable carousel */}
        {isMobile ? (
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0">
            <MobileCardCarousel
              moments={scrollMoments}
              reduceMotion={shouldReduceMotion}
            />
          </div>
        ) : (
          /* Desktop: scroll-driven stack — intentionally full-width */
          <div
            ref={scrollStackRef}
            className="relative mt-10 h-[320vh] sm:h-[380vh] lg:h-[440vh]"
          >
            <div className="sticky top-0 flex h-screen items-center justify-center">
              {/* Fills nearly the full viewport width; height driven by 16/9 ratio */}
              <div className="relative w-full max-w-[95vw] xl:max-w-7xl px-2 sm:px-4">
                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                  {scrollMoments.map((item, index) => (
                    <ScrollStackCard
                      key={item.label}
                      item={item}
                      index={index}
                      total={SCROLL_MOMENTS.length}
                      progress={smoothScrollProgress}
                      reduceMotion={shouldReduceMotion}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rundown;
