"use client";

import { useState } from "react";
import {
  IconCheck,
  IconCopy,
  IconHeartHandshake,
  IconInfoCircle,
  IconMapPin,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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
  const [copyError, setCopyError] = useState(false);
  const [copied, setCopied] = useState<CopiedState>({});

  const handleCopy = (text: string, index: number) => {
    setCopyError(false);
    if (!navigator.clipboard) {
      setCopyError(true);

      return;
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied((prev) => ({ ...prev, [index]: true }));
        setTimeout(() => {
          setCopied((prev) => ({ ...prev, [index]: false }));
        }, 2000);
      })
      .catch(() => setCopyError(true));
  };

  const accounts = t.donate.accounts;

  return (
    <>
      <section
        aria-labelledby="donate-heading"
        className="ns-section ns-container pb-8 md:pb-12"
      >
        <div className="max-w-3xl">
          <motion.h1
            animate="visible"
            className="ns-title"
            id="donate-heading"
            initial={false}
            transition={{ delay: 0.1 }}
            variants={fadeUp}
          >
            {t.donate.titleStart}
            <span className="text-secondary">{t.donate.titleEmphasis}</span>
          </motion.h1>

          <motion.p
            animate="visible"
            className="ns-copy mt-4"
            initial={false}
            transition={{ delay: 0.18 }}
            variants={fadeUp}
          >
            {t.donate.description}
          </motion.p>
        </div>
      </section>

      <div className="ns-container pb-12 md:pb-20">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
          {/* Account cards */}
          <motion.section
            animate="visible"
            aria-labelledby="accounts-heading"
            initial={false}
            variants={staggerContainer}
            viewport={viewport}
          >
            <motion.div className="mb-6" variants={fadeUp}>
              <h2 className="ns-heading" id="accounts-heading">
                {t.donate.accountTitle}
              </h2>
              <p className="ns-copy mt-3">{t.donate.accountSubtitle}</p>
            </motion.div>

            <div className="grid gap-4">
              {accounts.map((account, index) => (
                <motion.div
                  key={account.bank}
                  className="ns-surface min-w-0"
                  variants={staggerItem}
                >
                  <div>
                    {/* Bank badge */}
                    <div className="mb-6 flex items-center gap-3">
                      <IconHeartHandshake
                        aria-hidden="true"
                        className="shrink-0 text-secondary"
                        size={24}
                      />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t.donate.bankLabel}
                        </p>
                        <h3 className="ns-card-title">{account.bank}</h3>
                      </div>
                    </div>

                    {/* Account details */}
                    <dl className="space-y-6">
                      <div>
                        <dt className="ns-caption">
                          {t.donate.accountNumberLabel}
                        </dt>
                        <dd className="mt-2 flex flex-wrap items-center justify-between gap-4">
                          <span className="min-w-0 break-all select-all text-2xl font-semibold tabular-nums text-secondary sm:text-3xl">
                            {account.accountNumber}
                          </span>
                          <Button
                            aria-label={`${t.donate.copyButton}: ${account.bank}`}
                            className="focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-4"
                            id={`copy-account-${index}`}
                            size="public"
                            type="button"
                            variant="public-primary"
                            onClick={() =>
                              handleCopy(account.accountNumber, index)
                            }
                          >
                            {copied[index] ? (
                              <>
                                <IconCheck aria-hidden="true" />
                                {t.donate.copiedButton}
                              </>
                            ) : (
                              <>
                                <IconCopy aria-hidden="true" />
                                {t.donate.copyButton}
                              </>
                            )}
                          </Button>
                          <span className="sr-only" role="status">
                            {copied[index]
                              ? `${account.bank}: ${t.donate.copiedButton}`
                              : ""}
                          </span>
                        </dd>
                      </div>

                      <div>
                        <dt className="ns-caption">
                          {t.donate.accountHolderLabel}
                        </dt>
                        <dd className="mt-1 break-words text-base font-medium">
                          {account.accountHolder}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </motion.div>
              ))}
            </div>
            {copyError && (
              <p className="ns-alert mt-4" role="alert">
                {t.common.copyFailed}
              </p>
            )}
          </motion.section>

          {/* Notes section */}
          <motion.section
            animate="visible"
            aria-labelledby="notes-heading"
            className="border-t border-border pt-6 lg:pt-0 lg:border-t-0"
            initial={false}
            variants={fadeUp}
            viewport={viewport}
          >
            <div>
              <div>
                <h2
                  className="ns-card-title flex items-center gap-3"
                  id="notes-heading"
                >
                  <IconInfoCircle
                    aria-hidden="true"
                    className="shrink-0 text-secondary"
                    size={22}
                  />
                  {t.donate.noteTitle}
                </h2>
                <ul className="mt-4 space-y-4">
                  {/* Note 1 – plain text */}
                  <li className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                    {t.donate.notes[0]}
                  </li>
                  {/* Note 2 – inline link to Get in Touch section */}
                  <li className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                    <span>
                      {t.donate.notes[1]}
                      <Link
                        className="font-semibold text-secondary underline hover:text-foreground"
                        href="/#get-in-touch"
                      >
                        {t.donate.notes[2]}
                      </Link>
                      {t.donate.notes[3]}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Building Location section */}
        <motion.section
          animate="visible"
          aria-labelledby="location-heading"
          className="mt-12 border-t border-border pt-12 md:mt-20 md:pt-20"
          initial={false}
          variants={staggerContainer}
          viewport={viewport}
        >
          <motion.div className="mb-6" variants={fadeUp}>
            <h2 className="ns-heading" id="location-heading">
              {t.donate.locationTitle}
            </h2>
          </motion.div>

          <motion.div
            className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
            variants={fadeUp}
          >
            {/* Address row */}
            <div className="flex items-start gap-4">
              <IconMapPin
                aria-hidden="true"
                className="mt-1 shrink-0 text-secondary"
                size={24}
              />
              <div>
                <p className="ns-card-title">{t.donate.locationAddress}</p>
                <p className="ns-copy mt-3">{t.donate.locationDescription}</p>
              </div>
            </div>

            {/* Map embed */}
            <div className="ns-feature h-[300px] w-full overflow-hidden border border-border bg-surface sm:h-[380px]">
              <iframe
                allowFullScreen
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.86229404395326!2d106.96870872975651!3d-6.2904297320883025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d86449bc63b%3A0x9d3b307c8eb065db!2swarung%20sosis%20nayla!5e0!3m2!1sen!2sid!4v1779878557799!5m2!1sen!2sid"
                title={t.donate.locationTitle}
              />
            </div>
          </motion.div>
        </motion.section>

        {/* Thank you section */}
        <motion.div
          animate="visible"
          className="mt-12 border-t border-border pt-8 text-center md:mt-20"
          initial={false}
          variants={fadeUp}
          viewport={viewport}
        >
          <p className="ns-card-title text-secondary">
            {t.donate.thankYouTitle}
          </p>
          <p className="ns-copy mt-3 mx-auto">{t.donate.thankYouMessage}</p>
        </motion.div>
      </div>
    </>
  );
}
