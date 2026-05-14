"use client";

import { Fragment, useRef, useState } from "react";
import { IconScanPosition, IconSparkles } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import SideSheet from "./ui/side-sheet";
import { Accordion, AccordionItem } from "@heroui/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  RUNDOWN_ITEMS,
  SCROLL_MOMENTS,
  type ScrollMoment,
} from "@/constants/rundown";
import { useLanguage, type Locale } from "@/lib/i18n";

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
      className="absolute inset-0 mx-auto h-full w-full max-w-4xl origin-top transform-gpu will-change-transform"
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

const Rundown = () => {
  const { locale, messages: t } = useLanguage();
  const [openSheet, setOpenSheet] = useState<number | null>(null);
  const scrollStackRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: scrollStackRef,
    offset: ["start start", "end end"],
  });
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.35,
  });
  const rundownItems = RUNDOWN_ITEMS.map((item, index) => ({
    ...item,
    ...t.rundown.items[index],
    participants: item.participants.map((participant, participantIndex) => ({
      ...participant,
      rundown: t.rundown.items[index].participants[participantIndex],
    })),
  }));
  const scrollMoments = SCROLL_MOMENTS.map((moment, index) => ({
    ...moment,
    ...t.rundown.moments[index],
  }));

  return (
    <div id="rundown" className="mb-48 scroll-mt-24">
      <h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight text-center text-primary px-2 mb-6">
        {t.rundown.titleStart}
        <span className="text-secondary">{t.rundown.titleEmphasis}</span>
      </h1>

      <div className="my-12">
        <div className="relative mx-auto max-w-6xl">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/20 via-secondary/60 to-primary/20 lg:block" />

          <div className="flex flex-col gap-6">
            {rundownItems.map((item, index) => {
              const isEven = index % 2 === 0;
              const isLast = index === RUNDOWN_ITEMS.length - 1;
              const Icon = item.icon;

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
                          <div className="flex items-start gap-2 pb-2 text-xs">
                            <p>{item.subdetail}</p>
                          </div>
                        </AccordionItem>
                      </Accordion>
                      <div className="space-y-3 mt-6">
                        {item.participants.map((p) => (
                          <div
                            key={p.rundown}
                            className="flex items-center gap-3 rounded-lg border border-border hover:border-l-4 hover:border-l-primary p-3 pl-4 transition-colors duration-300"
                          >
                            {p.icon}
                            <div>
                              <p className="text-sm font-medium text-foreground dark:text-white">
                                {p.rundown}
                              </p>
                              <p className="text-xs text-foreground dark:text-white mt-0.5">
                                {p.participant}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SideSheet>
                  <div
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
                            {t.rundown.viewParticipants} <IconScanPosition />
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
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0">
          <div className="space-y-3 text-center w-full">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
              {t.rundown.momentsLabel}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-primary dark:text-white">
              {t.rundown.momentsTitle}
            </h2>
          </div>

          <div
            ref={scrollStackRef}
            className="relative mt-10 h-[260vh] sm:h-[300vh] lg:h-[340vh]"
          >
            <div className="sticky top-16 flex h-[76vh] items-center justify-center">
              <div className="relative h-full w-full px-2 sm:px-4">
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
      </div>
    </div>
  );
};

export default Rundown;
