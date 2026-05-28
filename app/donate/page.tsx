"use client";

import { useState } from "react";
import {
  IconCheck,
  IconCopy,
  IconHeartHandshake,
  IconInfoCircle,
  IconMapPin,
  IconSparkles,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  viewport,
} from "@/lib/animations";

type CopiedState = Record<number, boolean>;

export default function DonatePage() {
  const { messages: t } = useLanguage();
  const [copied, setCopied] = useState<CopiedState>({});

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [index]: false }));
      }, 2000);
    });
  };

  const accounts = t.donate.accounts;

  return (
    <>
      {/* Hero banner – full-width breakout from container */}
      <section className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden -mt-16 pt-28 pb-24">
 

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.p
            className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 dark:border-white/20 dark:bg-secondary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-secondary backdrop-blur-md"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <IconSparkles size={14} />
            {t.donate.eyebrow}
          </motion.p>

          <motion.h1
            className="mt-6 text-5xl font-black tracking-tight text-primary dark:text-white sm:text-6xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            {t.donate.titleStart}
            <span className="text-secondary">{t.donate.titleEmphasis}</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-2xl mx-auto text-base leading-7 text-foreground/70 dark:text-white/60 sm:text-lg"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.18 }}
          >
            {t.donate.description}
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl pb-20">
        {/* Building Location section */}
        <motion.section
          aria-labelledby="location-heading"
          className="mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div variants={fadeUp} className="mb-6 text-center">
            <h2
              id="location-heading"
              className="text-3xl font-bold text-primary dark:text-white"
            >
              {t.donate.locationTitle}
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-col gap-6 overflow-hidden rounded-[28px] border border-primary/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(248,167,36,0.08),rgba(1,75,63,0.06))] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.28)]"
          >
            {/* Address row */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary">
                <IconMapPin size={22} />
              </div>
              <div>
                <p className="text-base font-bold text-primary dark:text-white">
                  {t.donate.locationAddress}
                </p>
                <p className="mt-1 text-sm leading-6 text-foreground/70 dark:text-white/60">
                  {t.donate.locationDescription}
                </p>
              </div>
            </div>

            {/* Map embed */}
            <div className="h-[300px] w-full overflow-hidden rounded-2xl sm:h-[380px]">
              <iframe
                title="Church construction site location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.86229404395326!2d106.96870872975651!3d-6.2904297320883025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d86449bc63b%3A0x9d3b307c8eb065db!2swarung%20sosis%20nayla!5e0!3m2!1sen!2sid!4v1779878557799!5m2!1sen!2sid"
                className="h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </motion.section>

        {/* Account cards */}
        <motion.section
          aria-labelledby="accounts-heading"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <h2
              id="accounts-heading"
              className="text-3xl font-bold text-primary dark:text-white"
            >
              {t.donate.accountTitle}
            </h2>
            <p className="mt-2 text-sm text-foreground/70 dark:text-white/60">
              {t.donate.accountSubtitle}
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {accounts.map((account, index) => (
              <motion.div
                key={account.bank}
                variants={staggerItem}
                className="group relative overflow-hidden rounded-[28px] border border-primary/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(248,167,36,0.08),rgba(1,75,63,0.06))] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(1,75,63,0.14)] dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.28)]"
              >
                {/* Shimmer overlay */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,167,36,0.14),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(1,75,63,0.08),transparent_36%)]" />

                <div className="relative">
                  {/* Bank badge */}
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_8px_20px_rgba(1,75,63,0.28)] transition-transform duration-300 group-hover:scale-105 dark:bg-secondary dark:text-secondary-foreground">
                      <IconHeartHandshake size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary/60 dark:text-white/50">
                        {t.donate.bankLabel}
                      </p>
                      <p className="text-base font-bold text-primary dark:text-white">
                        {account.bank}
                      </p>
                    </div>
                  </div>

                  {/* Account details */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/50 dark:text-white/40">
                        {t.donate.accountNumberLabel}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between gap-3">
                        <p className="text-2xl font-black tracking-wider text-primary dark:text-secondary">
                          {account.accountNumber}
                        </p>
                        <button
                          id={`copy-account-${index}`}
                          onClick={() =>
                            handleCopy(account.accountNumber, index)
                          }
                          className="flex shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white dark:border-white/20 dark:bg-white/8 dark:text-secondary dark:hover:bg-secondary dark:hover:text-secondary-foreground"
                          aria-label={`Copy account number for ${account.bank}`}
                        >
                          {copied[index] ? (
                            <>
                              <IconCheck size={13} />
                              {t.donate.copiedButton}
                            </>
                          ) : (
                            <>
                              <IconCopy size={13} />
                              {t.donate.copyButton}
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/50 dark:text-white/40">
                        {t.donate.accountHolderLabel}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground dark:text-white">
                        {account.accountHolder}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Notes section */}
        <motion.section
          aria-labelledby="notes-heading"
          className="mt-14 rounded-[24px] border border-secondary/30 bg-secondary/8 p-6 dark:border-white/10 dark:bg-white/5"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/20 text-secondary dark:bg-secondary/15">
              <IconInfoCircle size={22} />
            </div>
            <div>
              <h3
                id="notes-heading"
                className="text-base font-bold text-primary dark:text-white"
              >
                {t.donate.noteTitle}
              </h3>
              <ul className="mt-3 space-y-2">
                {t.donate.notes.map((note, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-6 text-foreground/80 dark:text-white/70"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
}
