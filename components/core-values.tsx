"use client";

import { motion } from "framer-motion";

import { IDENTITY_PILLARS } from "@/constants/core-values";
import { useLanguage } from "@/lib/i18n";
import {
  fadeUp,
  slideLeft,
  slideRight,
  staggerContainer,
  viewport,
} from "@/lib/animations";

type PillarCardProps = {
  number: string;
  title: string;
  descriptor: string;
  description: string;
  icon: (typeof IDENTITY_PILLARS)[number]["icon"];
  cardClassName: string;
  iconClassName: string;
  footer: string;
};

const PillarCard = ({
  number,
  title,
  descriptor,
  description,
  icon: Icon,
  cardClassName,
  iconClassName,
  footer,
}: PillarCardProps) => {
  return (
    <article
      className={`group relative h-full overflow-hidden rounded-[30px] border border-primary/10 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(1,75,63,0.14)] dark:border-white/10 dark:shadow-[0_22px_55px_rgba(2,6,23,0.28)] ${cardClassName}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.34),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(1,75,63,0.08),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(248,167,36,0.08),transparent_34%)]" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/60 dark:text-white">
              {number}
            </p>
            <h3 className="mt-3 text-2xl font-bold text-primary dark:text-white">
              {title}
            </h3>
          </div>

          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110 ${iconClassName}`}
          >
            <Icon size={28} stroke={1.7} />
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary dark:text-primary">
            {descriptor}
          </p>
          <p className="text-sm leading-7 text-foreground dark:text-white">
            {description}
          </p>
        </div>

        <div className="mt-6">
          <span className="inline-flex rounded-full border border-primary/10 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/70 backdrop-blur-sm dark:border-white/10 dark:bg-white/8 dark:text-white">
            {footer}
          </span>
        </div>
      </div>
    </article>
  );
};

const CoreValues = () => {
  const { messages: t } = useLanguage();
  const pillars = IDENTITY_PILLARS.map((pillar, index) => ({
    ...pillar,
    ...t.coreValues.pillars[index],
  }));
  const [visionPillar, missionPillar] = pillars;

  return (
    <div id="core-values" className="mb-48 space-y-10">
      <section
        aria-labelledby="core-values-heading"
        className="px-4 py-16 sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-6xl">
          {/* Section heading */}
          <motion.div
            className="text-center mx-auto max-w-3xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <h1
                  id="core-values-heading"
                  className="text-5xl font-black tracking-tight text-primary"
                >
                  {t.coreValues.titleStart}
                  <span className="text-secondary">
                    {t.coreValues.titleMiddle}
                  </span>
                  {t.coreValues.titleEnd}
                </h1>
                <p className="mt-4 text-sm leading-7 text-foreground dark:text-white sm:text-base">
                  {t.coreValues.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Two pillar cards with slide-in from opposite sides */}
          <motion.div
            className="mt-12 grid gap-5 lg:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.div variants={slideLeft}>
              <PillarCard {...visionPillar} />
            </motion.div>
            <motion.div variants={slideRight}>
              <PillarCard {...missionPillar} />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CoreValues;
