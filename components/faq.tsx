"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionItem } from "@heroui/react";

import { useLanguage } from "@/lib/i18n";
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  viewport,
} from "@/lib/animations";

const Faq = () => {
  const { messages: t } = useLanguage();

  return (
    <div className="mb-48 flex flex-col items-center gap-10 px-2">
      {/* Section heading */}
      <motion.div
        className="w-full max-w-3xl text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <h1 className="scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-tight text-secondary">
          {t.faq.titleStart}
          <span className="text-primary">{t.faq.titleEmphasis}</span>
        </h1>
      </motion.div>

      {/* FAQ accordion – staggered entrance */}
      <motion.div
        className="w-full max-w-3xl"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <Accordion className="w-full px-0" variant="splitted">
          {t.faq.items.map((item, index) => (
            <AccordionItem
              key={index}
              aria-label={item.title}
              title={
                <motion.span variants={staggerItem}>{item.title}</motion.span>
              }
            >
              <div className="flex items-start gap-2 pb-2">
                <p className="text-sm leading-6 text-foreground dark:text-white">
                  {item.content}
                </p>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
};

export default Faq;
