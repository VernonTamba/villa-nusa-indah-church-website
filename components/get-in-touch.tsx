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
    <section
      aria-labelledby="get-in-touch-heading"
      className="ns-section ns-container flex flex-col items-center gap-8"
      id="get-in-touch"
    >
      {/* Section heading */}
      <motion.div
        animate="visible"
        className="text-center mx-auto max-w-4xl"
        initial={false}
        variants={fadeUp}
        viewport={viewport}
      >
        <h2 className="ns-heading" id="get-in-touch-heading">
          {t.contact.titleStart}
          <span className="text-secondary">{t.contact.titleEmphasis}</span>
        </h2>
        <p className="mt-4 ns-copy">{t.contact.description}</p>
      </motion.div>

      {/* Contact rows – staggered entrance */}
      <motion.div
        animate="visible"
        className="flex w-full max-w-3xl flex-col gap-4"
        initial={false}
        variants={staggerContainer}
        viewport={viewport}
      >
        {CONTACT_OPTIONS.map(
          ({ label, description, href, linkLabel, icon: Icon }) => (
            <motion.a
              key={`${linkLabel}-${description}`}
              aria-label={linkLabel}
              className={
                "group flex items-center gap-4 rounded-xl border border-border px-5 py-4 transition-colors hover:bg-card " +
                (["Gmail", "WhatsApp"].includes(label)
                  ? "bg-card min-h-20"
                  : "bg-background min-h-16")
              }
              href={href}
              rel="noreferrer"
              target="_blank"
              variants={staggerItem}
            >
              {/* Left: label + description */}
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-base font-bold leading-tight text-foreground dark:text-white">
                  {label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground break-words">
                  {description}
                </p>
              </div>

              {/* Right: fade-in visit hint + icon pill */}
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
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
                <div className="flex h-11 w-11 shrink-0 items-center justify-center text-secondary">
                  <Icon
                    className="transition-transform duration-300 group-hover:scale-105"
                    size={22}
                    stroke={1.75}
                  />
                </div>
              </div>
            </motion.a>
          ),
        )}
      </motion.div>
    </section>
  );
};

export default GetInTouch;
