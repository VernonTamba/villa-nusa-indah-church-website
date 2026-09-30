"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionItem } from "@heroui/react";

import { useLanguage } from "@/lib/i18n";
import { fadeUp, staggerContainer, viewport } from "@/lib/animations";

const Faq = () => {
  const { locale, messages: t } = useLanguage();

  return (
    <section
      aria-labelledby="faq-heading"
      className="ns-section ns-container flex flex-col items-center gap-8 border-t border-border"
    >
      {/* Section heading */}
      <motion.div
        animate="visible"
        className="w-full max-w-3xl text-center"
        initial={false}
        variants={fadeUp}
        viewport={viewport}
      >
        <h2 className="ns-heading" id="faq-heading">
          {t.faq.titleStart}
          <span className="text-secondary">{t.faq.titleEmphasis}</span>
        </h2>
      </motion.div>

      {/* FAQ accordion – staggered entrance */}
      <motion.div
        key={locale}
        animate="visible"
        className="w-full max-w-3xl"
        initial={false}
        variants={staggerContainer}
        viewport={viewport}
      >
        <Accordion
          className="w-full px-0"
          itemClasses={{
            base: "border-b border-border",
            trigger: "min-h-14 py-4",
            title: "text-base font-semibold",
            content: "pb-5 text-base text-muted-foreground",
          }}
          variant="light"
        >
          {t.faq.items.map((item, index) => (
            <AccordionItem
              key={`${locale}-${index}`}
              aria-label={item.title}
              title={item.title}
            >
              <div className="flex items-start gap-2 pb-2">
                <p className="text-base leading-relaxed text-muted-foreground">
                  {item.content}
                </p>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
};

export default Faq;
