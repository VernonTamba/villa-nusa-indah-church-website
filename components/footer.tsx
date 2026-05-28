"use client";

import AdventistLogo from "@/public/icons/advent.svg";
import { CONTACT_DETAILS } from "@/constants/contact-details";
import { WORSHIP_SCHEDULES } from "@/constants/footer";
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
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import { fadeUp, fadeIn, staggerContainer, staggerItem, viewport } from "@/lib/animations";
import { siteConfig } from "@/config/site";

const Footer = () => {
  const { messages: t } = useLanguage();
  const schedules = WORSHIP_SCHEDULES.map((item, index) => ({
    ...item,
    ...t.footer.schedules[index],
  }));

  return (
    <div className="container mx-auto max-w-9xl px-6">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.div variants={staggerItem} className="flex flex-col gap-2 px-4 py-6">
          <div className="flex items-center gap-3 max-w-fit">
            <span className="flex items-center justify-center rounded-md bg-white p-1">
              <Image
                src={AdventistLogo}
                alt="Adventist Logo"
                height={30}
                width={30}
              />
            </span>
            <p className="font-bold text-inherit leading-4">
              GMAHK Villa Nusa Indah
            </p>
          </div>

          <p className="text-sm">
            {t.footer.description}
          </p>

          <div className="flex items-center justify-start gap-4 mt-3">
            <Button
              isIconOnly
              variant="solid"
              as="a"
              href={siteConfig.links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="bg-primary text-primary-foreground"
            >
              <IconBrandFacebook />
            </Button>
            <Button
              isIconOnly
              variant="solid"
              as="a"
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="bg-primary text-primary-foreground"
            >
              <IconBrandInstagram />
            </Button>
            <Button
              isIconOnly
              variant="solid"
              as="a"
              href={siteConfig.links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="bg-primary text-primary-foreground"
            >
              <IconBrandYoutube />
            </Button>
          </div>
        </motion.div>
        <motion.div variants={staggerItem} className="px-4 py-6">
          <p className="font-semibold my-2">{t.footer.contact}</p>
          <div className="flex flex-col gap-2 mt-3">
            <p className="text-sm flex items-center gap-2">
              <IconMapPinFilled size={24} className="text-primary" />
              {t.footer.address}
            </p>
            <p className="text-sm flex items-center gap-2">
              <IconPhoneFilled size={24} className="text-primary" />
              {CONTACT_DETAILS.phone}
            </p>
            <p className="text-sm flex items-center gap-2">
              <IconMailFilled size={24} className="text-primary" />
              {CONTACT_DETAILS.email}
            </p>
          </div>
        </motion.div>
        <motion.div variants={staggerItem} className="px-4 py-6">
          <p className="font-semibold my-2">{t.footer.schedule}</p>
          <div className="flex flex-col gap-4 mt-4">
            {schedules.map((item) => (
              <Card key={item.title} className="w-full max-w-[400px] p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-default-500">{item.time}</p>
                  </div>

                  {item.icon}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
      <motion.footer
        className="w-full flex items-center justify-center gap-12 py-6 border-t border-primary/50"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <p className="text-sm">
          &copy; {new Date().getFullYear()} GMAHK Villa Nusa Indah.{" "}
          {t.footer.copyright}
        </p>

        <p className="text-sm ml-4">
          {t.footer.built}
        </p>
      </motion.footer>
    </div>
  );
};

export default Footer;
