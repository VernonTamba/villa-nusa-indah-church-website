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

import { Accordion, AccordionItem } from "@heroui/react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import SideSheet from "./ui/side-sheet";

import { Button } from "@/components/ui/button";
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  viewport,
} from "@/lib/animations";
import {
  RUNDOWN_ITEMS,
  SCROLL_MOMENTS,
  type ScrollMoment,
} from "@/constants/rundown";
import { useLanguage, type Locale } from "@/lib/i18n";
import { createClient } from "@/utils/supabase/client";

// Derive the same snake_case key used in the admin panel
function toKey(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
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
  const settle = start + segment * 0.3;
  const hold = start + segment * 0.76;
  const end = start + segment;
  const enter = start - segment * 0.65;
  const exit = end + segment * 0.55;
  const direction = index % 2 === 0 ? 1 : -1;
  const scale = useTransform(
    progress,
    [enter, start, hold, end, exit],
    reduceMotion ? [1.03, 1, 1, 0.97, 0.94] : [1.1, 1, 1, 0.92, 0.86],
  );
  const y = useTransform(
    progress,
    [enter, start, settle, end, exit],
    reduceMotion ? [20, 0, 0, -6, -14] : [72, 0, 0, -14, -42],
  );
  const opacity = useTransform(
    progress,
    [enter, start, hold, exit],
    reduceMotion ? [0, 1, 1, 0.78] : [0, 1, 1, 0.45],
  );
  const rotate = useTransform(
    progress,
    [enter, start, exit],
    reduceMotion ? [0, 0, 0] : [1.5 * direction, 0, -1 * direction],
  );
  const imageScale = useTransform(
    progress,
    [start, hold, exit],
    reduceMotion ? [1.02, 1.01, 1] : [1.05, 1.02, 1],
  );
  const contentOpacity = useTransform(
    progress,
    [enter, start, end],
    reduceMotion ? [0.85, 1, 0.95] : [0.55, 1, 0.88],
  );

  return (
    <motion.figure
      className="absolute inset-0 w-full origin-top transform-gpu will-change-transform"
      style={{ scale, y, opacity, rotate, zIndex: index + 1 }}
    >
      <div className="ns-feature relative flex h-full overflow-hidden border border-border bg-surface">
        <motion.img
          className="h-full w-full object-cover"
          alt={item.title}
          // Eagerly load only the first card; all others are deferred until
          // the user scrolls the rundown section into view.
          decoding="async"
          loading={index === 0 ? "eager" : "lazy"}
          src={item.image}
          style={{ scale: imageScale }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/20"
        />

        <motion.figcaption
          className="absolute inset-x-0 bottom-0 space-y-4 p-5 sm:p-8 md:p-10"
          style={{ opacity: contentOpacity }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-semibold text-white">
              {item.label}
            </span>
            <span className="text-sm font-semibold tabular-nums text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="max-w-2xl space-y-3">
            <h3 className="ns-card-title text-white">{item.title}</h3>
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

const MobileCardCarousel = ({
  moments,
  reduceMotion,
}: MobileCardCarouselProps) => {
  const { messages: t } = useLanguage();
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
        <div className="ns-feature absolute inset-0 overflow-hidden border border-border bg-surface">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.figure
              key={activeIndex}
              animate={reduceMotion ? { opacity: 1 } : "center"}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              custom={direction}
              drag={!reduceMotion ? "x" : undefined}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              exit={reduceMotion ? { opacity: 0 } : "exit"}
              initial={reduceMotion ? { opacity: 0 } : "enter"}
              style={{ touchAction: "pan-y" }}
              variants={reduceMotion ? undefined : cardVariants}
              onDragEnd={(_, info) => {
                const THRESHOLD = 48;

                if (info.offset.x < -THRESHOLD && activeIndex < total - 1) {
                  goTo(activeIndex + 1);
                } else if (info.offset.x > THRESHOLD && activeIndex > 0) {
                  goTo(activeIndex - 1);
                }
              }}
            >
              {/* Clean image — no caption overlay */}
              <img
                alt={current.title}
                className="h-full w-full object-cover pointer-events-none"
                decoding="async"
                draggable={false}
                loading="lazy"
                src={current.image}
              />
            </motion.figure>
          </AnimatePresence>

          {/* Prev arrow */}
          <button
            aria-label={t.gallery.lightbox.prev}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-xl border border-control-border bg-surface text-foreground hover:bg-card disabled:opacity-0 disabled:pointer-events-none"
            disabled={activeIndex === 0}
            onClick={() => goTo(activeIndex - 1)}
          >
            <IconChevronLeft size={16} stroke={2.5} />
          </button>

          {/* Next arrow */}
          <button
            aria-label={t.gallery.lightbox.next}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-xl border border-control-border bg-surface text-foreground hover:bg-card disabled:opacity-0 disabled:pointer-events-none"
            disabled={activeIndex === total - 1}
            onClick={() => goTo(activeIndex + 1)}
          >
            <IconChevronRight size={16} stroke={2.5} />
          </button>
        </div>
      </div>

      {/* ── Text content below the image ─────────────────────────────────── */}
      <div className="mt-4 px-1">
        {/* Label row + counter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <AnimatePresence mode="wait">
            <motion.span
              key={`label-${activeIndex}`}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-semibold text-secondary"
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}
            >
              {current.label}
            </motion.span>
          </AnimatePresence>

          {/* Dot indicators */}
          <div
            aria-label={t.common.slide.replace(
              "{count}",
              String(activeIndex + 1),
            )}
            className="flex max-w-full flex-wrap items-center gap-1"
            role="group"
          >
            {moments.map((_, i) => (
              <button
                key={i}
                aria-label={t.common.slide.replace("{count}", String(i + 1))}
                aria-pressed={i === activeIndex}
                className={`relative h-11 w-11 rounded-lg after:absolute after:inset-x-3 after:top-5 after:h-1 after:rounded-full ${i === activeIndex ? "after:bg-secondary" : "after:bg-muted-foreground"}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>

        {/* Title + description — animate on slide change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${activeIndex}`}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 space-y-1"
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            transition={{
              duration: reduceMotion ? 0 : 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h3 className="ns-card-title">{current.title}</h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>
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

  // useScroll tracks scroll progress against the sticky section — RAF-synced,
  // no layout thrashing. offset: ["start start", "end end"] means 0 when the
  // element top hits the viewport top, 1 when the element bottom hits the bottom.
  const { scrollYProgress } = useScroll({
    target: scrollStackRef,
    offset: ["start start", "end end"],
  });
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.5,
  });

  // DB participant name lookup: service_key -> role_key -> participant_name
  const [dbParticipants, setDbParticipants] = useState<
    Record<string, Record<string, string>>
  >({});
  // DB sabbath moments (images from storage)
  const [dbMoments, setDbMoments] = useState<ScrollMoment[] | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Fetch participant names
    supabase
      .from("rundown_participants")
      .select("service_key,role_key,participant_name")
      .then(({ data }) => {
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
    <section
      aria-labelledby="rundown-heading"
      className="ns-section ns-container"
      id="rundown"
    >
      <motion.h2
        animate="visible"
        className="ns-heading text-center mb-6"
        id="rundown-heading"
        initial={false}
        variants={fadeUp}
        viewport={viewport}
      >
        {t.rundown.titleStart}
        <span className="text-secondary">{t.rundown.titleEmphasis}</span>
      </motion.h2>

      <div className="my-8">
        <div className="relative mx-auto max-w-6xl">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full border-l border-border -translate-x-1/2 lg:block" />

          <motion.div
            key={locale}
            animate="visible"
            className="flex flex-col gap-6"
            initial={false}
            variants={staggerContainer}
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
                    title={item.title}
                    width="w-full sm:max-w-lg"
                    onClose={() => setOpenSheet(null)}
                  >
                    <div className="ns-dialog-body space-y-1">
                      <p className="text-base font-medium text-foreground dark:text-white">
                        {t.rundown.sabbath}, {getNextSaturday(locale)}
                      </p>
                      <p className="text-sm text-foreground dark:text-white mb-4">
                        {item.time}
                      </p>
                      <Accordion isCompact className="!my-4" variant="bordered">
                        <AccordionItem
                          aria-label={item.title}
                          title={
                            <span className="text-sm font-medium">
                              {t.rundown.serviceQuestion}
                            </span>
                          }
                        >
                          <div className="flex flex-col gap-3 pb-2 text-sm">
                            <p>{item.subdetail}</p>
                            {item.image && (
                              <img
                                alt={`${item.title} situation`}
                                className="w-full rounded-xl object-cover max-h-40"
                                loading="lazy"
                                src={item.image}
                              />
                            )}
                          </div>
                        </AccordionItem>
                      </Accordion>
                      <div className="space-y-3 mt-6">
                        {item.participants.length > 0 &&
                          item.participants.map((p) => {
                            const ParticipantIcon =
                              RUNDOWN_ICON_MAP[p.icon] ?? IconSparkles;

                            return (
                              <div
                                key={p.rundown}
                                className="flex items-center gap-3 rounded-xl border border-border p-3 pl-4"
                              >
                                <ParticipantIcon
                                  aria-hidden="true"
                                  className="shrink-0 text-secondary"
                                  size={16}
                                />
                                <div>
                                  <p className="text-sm font-medium text-foreground dark:text-white">
                                    {p.rundown}
                                  </p>
                                  <p className="text-sm text-foreground dark:text-white mt-0.5">
                                    {p.participant}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </SideSheet>
                  <motion.div
                    className={`group relative flex w-full ${
                      isEven ? "lg:justify-start" : "lg:justify-end"
                    }`}
                    variants={staggerItem}
                  >
                    {!isLast ? (
                      <div className="pointer-events-none absolute left-2 sm:left-5 top-16 h-[calc(100%+1.5rem)] border-l border-border lg:hidden" />
                    ) : null}

                    <div className="pointer-events-none absolute left-2 sm:left-5 top-14 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-background bg-secondary lg:left-1/2" />

                    <div className="ml-6 min-w-0 w-full sm:ml-12 lg:ml-0 lg:w-[calc(50%-3rem)]">
                      <div className="ns-surface relative flex w-full flex-col justify-between">
                        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center text-secondary">
                            <Icon size={28} />
                          </div>

                          <Button
                            className="border-control-border focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-4"
                            size="public"
                            variant="public-secondary"
                            onClick={() => setOpenSheet(index)}
                          >
                            {t.rundown.viewDetail} <IconScanPosition />
                          </Button>
                        </div>

                        <div className="relative z-10 mt-6 space-y-3">
                          <h3 className="ns-card-title">{item.title}</h3>
                          <p className="text-sm font-semibold tabular-nums text-secondary">
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

      <div className="mt-12 md:mt-16">
        {/* Heading stays within the narrow centred column */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0">
          <motion.div
            animate="visible"
            className="space-y-3 text-center w-full"
            initial={false}
            variants={fadeUp}
            viewport={viewport}
          >
            <h2 className="ns-heading">{t.rundown.momentsTitle}</h2>
          </motion.div>
        </div>

        {/* Mobile: swipeable carousel */}
        {isMobile || shouldReduceMotion ? (
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
            className="relative mt-10 h-[220vh] lg:h-[260vh]"
          >
            <div className="sticky top-0 flex h-screen items-center justify-center">
              {/* Fills nearly the full viewport width; height driven by 16/9 ratio */}
              <div className="relative w-full max-w-[72vw] xl:max-w-5xl px-3 sm:px-6">
                <div
                  className="relative w-full"
                  style={{ aspectRatio: "16/9", maxHeight: "72vh" }}
                >
                  {scrollMoments.map((item, index) => (
                    <ScrollStackCard
                      key={item.label}
                      index={index}
                      item={item}
                      progress={smoothScrollProgress}
                      reduceMotion={shouldReduceMotion}
                      total={scrollMoments.length}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Rundown;
