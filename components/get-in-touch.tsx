"use client";

import { motion } from "framer-motion";

import { CONTACT_OPTIONS } from "@/constants/get-in-touch";
import { useLanguage } from "@/lib/i18n";
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  viewport,
} from "@/lib/animations";

const GetInTouch = () => {
  const { messages: t } = useLanguage();

  return (
    <div
      id="get-in-touch"
      className="mb-48 flex scroll-mt-24 flex-col items-center gap-10 px-2"
    >
      {/* Section heading */}
      <motion.div
        className="text-center mx-auto max-w-4xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <div className="space-y-6">
          <div className="space-y-6">
            <h2
              id="get-in-touch-heading"
              className="text-5xl font-black tracking-tight text-primary"
            >
              {t.contact.titleStart}
              <span className="text-secondary">{t.contact.titleEmphasis}</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-foreground dark:text-white sm:text-base">
              {t.contact.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contact rows – staggered entrance */}
      <motion.div
        className="flex w-full max-w-3xl flex-col gap-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {CONTACT_OPTIONS.map(({ label, description, href, linkLabel, icon: Icon }) => (
          <motion.a
            key={`${linkLabel}-${description}`}
            variants={staggerItem}
            aria-label={linkLabel}
            className="group flex min-h-20 items-center gap-5 rounded-2xl border-2 border-primary/30 bg-background px-6 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_12px_32px_rgba(1,75,63,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:hover:shadow-[0_12px_32px_rgba(248,167,36,0.12)]"
            href={href}
            rel="noreferrer"
            target="_blank"
          >
            {/* Left: label + description */}
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="text-base font-bold leading-tight text-foreground dark:text-white">
                {label}
              </p>
              <p className="mt-0.5 truncate text-sm text-foreground/60 transition-colors duration-300 group-hover:text-foreground/80 dark:text-white/60 dark:group-hover:text-white/80">
                {description}
              </p>
            </div>

            {/* Right: fade-in visit hint + icon pill */}
            <div className="flex shrink-0 items-center gap-3">
              <span className="flex items-center gap-1 text-xs font-semibold text-primary/60 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:text-white/60">
                {t.contact.visitLabel}
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M7 17L17 7M17 7H7M17 7v10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-muted text-primary shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_8px_24px_rgba(1,75,63,0.22)] dark:border-white/20 dark:text-white dark:group-hover:border-secondary dark:group-hover:bg-secondary dark:group-hover:text-secondary-foreground dark:group-hover:shadow-[0_8px_24px_rgba(248,167,36,0.22)]">
                <Icon
                  size={22}
                  stroke={1.75}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
};

export default GetInTouch;
