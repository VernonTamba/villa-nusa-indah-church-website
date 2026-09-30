"use client";

import {
  IconClockHour8Filled,
  IconLocationFilled,
  IconMapPinFilled,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";

import { CHURCH_LOCATION } from "@/constants/location";
import { useLanguage } from "@/lib/i18n";
import {
  fadeUp,
  slideLeft,
  slideRight,
  staggerContainer,
  viewport,
} from "@/lib/animations";

const ChurchMap = dynamic(() => import("@/components/ui/map"), { ssr: false });

const Location = () => {
  const { messages: t } = useLanguage();

  return (
    <section
      aria-labelledby="location-heading"
      className="ns-section ns-container"
      id="location"
    >
      {/* Section heading */}
      <motion.div
        animate="visible"
        className="max-w-2xl"
        initial={false}
        variants={fadeUp}
        viewport={viewport}
      >
        <h2 className="ns-heading" id="location-heading">
          {t.location.titleStart}
          <span className="text-secondary">{t.location.titleEmphasis}</span>
        </h2>
        <p className="mt-4 ns-copy">{t.location.description}</p>
      </motion.div>

      {/* Info card + map with slide-in from opposite sides */}
      <motion.div
        animate="visible"
        className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-stretch"
        initial={false}
        variants={staggerContainer}
        viewport={viewport}
      >
        <motion.div
          className="ns-surface flex flex-1 flex-col justify-center gap-6 min-w-0"
          variants={slideLeft}
        >
          <div className="flex items-start justify-start gap-4">
            <div className="flex h-7 w-6 shrink-0 items-center justify-center">
              <IconMapPinFilled
                aria-hidden="true"
                className="text-secondary"
                size={24}
              />
            </div>
            <div>
              <h3 className="ns-card-title mb-2">{t.location.address}</h3>
              <p className="text-base text-muted-foreground">
                {CHURCH_LOCATION.address}
              </p>
            </div>
          </div>

          <div className="flex items-start justify-start gap-4">
            <div className="flex h-7 w-6 shrink-0 items-center justify-center">
              <IconClockHour8Filled
                aria-hidden="true"
                className="text-secondary"
                size={24}
              />
            </div>
            <div>
              <h3 className="ns-card-title mb-2">{t.location.worshipHours}</h3>
              <p className="text-base text-muted-foreground">
                {t.location.worshipHoursValue}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-start">
            <div className="inline-flex">
              <div className="relative inline-flex items-center">
                <Button
                  as="a"
                  className="ns-primary bg-primary text-primary-foreground"
                  href={CHURCH_LOCATION.googleMapsDirectionsUrl}
                  rel="noopener noreferrer"
                  startContent={
                    <IconLocationFilled aria-hidden="true" size={20} />
                  }
                  target="_blank"
                >
                  {t.location.directions}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="flex-1 min-w-0" variants={slideRight}>
          <ChurchMap />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Location;
