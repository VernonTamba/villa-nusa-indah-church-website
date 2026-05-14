"use client";

import {
  IconClockHour8Filled,
  IconLocationFilled,
  IconMapPinFilled,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { Button } from "@heroui/react";
import { CHURCH_LOCATION } from "@/constants/location";

const ChurchMap = dynamic(() => import("@/components/ui/map"), { ssr: false });

const Location = () => {
  return (
    <div id="location" className="mb-48 scroll-mt-24">
      <div className="text-center mx-auto max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-6">
            <h1
              id="core-values-heading"
              className="text-5xl font-black tracking-tight text-primary"
            >
              Our <span className="text-secondary">Location</span>
            </h1>
            <p className="mt-4 text-sm leading-7 text-foreground dark:text-white sm:text-base">
              We warmly welcome you to visit us in person! Below, you'll find
              our church's location and worship hours. We look forward to seeing
              you and sharing in fellowship together!
            </p>
          </div>
        </div>
      </div>

      <div className="my-12 flex flex-col gap-8 overflow-x-hidden lg:flex-row lg:items-stretch">
        <div className="flex flex-1 flex-col justify-center gap-6 rounded-2xl border border-primary/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(248,167,36,0.16),rgba(1,75,63,0.08))] p-6 shadow-[0_18px_50px_rgba(1,75,63,0.16)] backdrop-blur-2xl dark:border-white/20 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] dark:shadow-[0_8px_32px_rgba(15,23,42,0.18)] lg:max-w-none">
          <div className="flex items-start justify-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center">
              <IconMapPinFilled size={40} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Address:</h2>
              <p className="text-sm mb-4">{CHURCH_LOCATION.address}</p>
            </div>
          </div>

          <div className="flex items-start justify-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center">
              <IconClockHour8Filled size={40} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Worship Hours:</h2>
              <p className="text-sm mb-4">Every Saturday, 8:30 AM - 18:00 PM</p>
            </div>
          </div>

          <div className="flex items-center justify-start sm:ml-20">
            <div className="inline-flex pr-20 sm:pr-24">
              <div className="relative inline-flex items-center">
                <Button
                  as="a"
                  href={CHURCH_LOCATION.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 bg-secondary text-secondary-foreground font-semibold"
                  startContent={<IconLocationFilled />}
                >
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <ChurchMap />
        </div>
      </div>
    </div>
  );
};

export default Location;
