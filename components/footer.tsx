"use client";

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import Image from "next/image";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconMailFilled,
  IconMapPinFilled,
  IconPhoneFilled,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

import { useLanguage } from "@/lib/i18n";
import { WORSHIP_SCHEDULES } from "@/constants/footer";
import { CONTACT_DETAILS } from "@/constants/contact-details";
import AdventistLogo from "@/public/icons/advent.svg";
import {
  fadeIn,
  staggerContainer,
  staggerItem,
  viewport,
} from "@/lib/animations";
import { siteConfig } from "@/config/site";

const Footer = () => {
  const { messages: t } = useLanguage();
  const schedules = WORSHIP_SCHEDULES.map((item, index) => ({
    ...item,
    ...t.footer.schedules[index],
  }));

  return (
    <footer className="ns-container border-t border-border pt-12 md:pt-16">
      <motion.div
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 md:gap-12"
        initial={false}
        variants={staggerContainer}
        viewport={viewport}
      >
        <motion.div
          className="flex min-w-0 flex-col gap-4 sm:col-span-2 lg:col-span-1"
          variants={staggerItem}
        >
          <div className="flex items-center gap-3 max-w-fit">
            <span className="flex shrink-0 items-center justify-center rounded-md bg-white p-1">
              <Image
                alt="Adventist Logo"
                height={30}
                src={AdventistLogo}
                width={30}
              />
            </span>
            <p className="font-semibold text-inherit leading-snug">
              GMAHK Villa Nusa Indah
            </p>
          </div>

          <p className="ns-copy">{t.footer.description}</p>

          <div className="ns-actions">
            <Button
              isIconOnly
              aria-label="Facebook"
              as="a"
              className="min-h-11 min-w-11 rounded-xl border border-border bg-surface text-secondary"
              href={siteConfig.links.facebook}
              rel="noopener noreferrer"
              target="_blank"
              variant="solid"
            >
              <IconBrandFacebook />
            </Button>
            <Button
              isIconOnly
              aria-label="Instagram"
              as="a"
              className="min-h-11 min-w-11 rounded-xl border border-border bg-surface text-secondary"
              href={siteConfig.links.instagram}
              rel="noopener noreferrer"
              target="_blank"
              variant="solid"
            >
              <IconBrandInstagram />
            </Button>
            <Button
              isIconOnly
              aria-label="YouTube"
              as="a"
              className="min-h-11 min-w-11 rounded-xl border border-border bg-surface text-secondary"
              href={siteConfig.links.youtube}
              rel="noopener noreferrer"
              target="_blank"
              variant="solid"
            >
              <IconBrandYoutube />
            </Button>
          </div>
        </motion.div>
        <motion.div className="min-w-0" variants={staggerItem}>
          <h2 className="ns-card-title">{t.footer.contact}</h2>
          <div className="flex flex-col gap-4 mt-6">
            <p className="text-sm flex items-start gap-3">
              <IconMapPinFilled className="shrink-0 text-secondary" size={20} />
              {t.footer.address}
            </p>
            <p className="text-sm flex items-start gap-3">
              <IconPhoneFilled className="shrink-0 text-secondary" size={20} />
              {CONTACT_DETAILS.phone}
            </p>
            <p className="text-sm flex items-start gap-3">
              <IconMailFilled className="shrink-0 text-secondary" size={20} />
              {CONTACT_DETAILS.email}
            </p>
          </div>
        </motion.div>
        <motion.div className="min-w-0" variants={staggerItem}>
          <h2 className="ns-card-title">{t.footer.schedule}</h2>
          <div className="flex flex-col gap-4 mt-6">
            {schedules.map((item) => (
              <Card
                key={item.title}
                className="w-full p-4 rounded-xl border border-border bg-surface shadow-none"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>

                  <span aria-hidden="true" className="shrink-0">
                    {item.icon}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        animate="visible"
        className="w-full flex flex-col sm:flex-row flex-wrap items-start justify-between gap-3 py-6 border-t border-border text-muted-foreground"
        initial={false}
        variants={fadeIn}
        viewport={viewport}
      >
        <p className="text-sm">
          &copy; {new Date().getFullYear()} GMAHK Villa Nusa Indah. All rights
          reserved.
        </p>

        <p className="text-sm">
          Built with <span className="text-primary">♥</span> by the VNI Coms
          Team.
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;
