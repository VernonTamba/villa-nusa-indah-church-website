"use client";

import { FAQ_ITEMS } from "@/constants/faq";
import { Accordion, AccordionItem } from "@heroui/react";

const Faq = () => {
  return (
    <div className="mb-48 flex flex-col items-center gap-10 px-2">
      <div className="w-full max-w-3xl text-center">
        <h1 className="scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-tight text-secondary">
          Frequently Asked <span className="text-primary">Questions</span>
        </h1>
      </div>
      <Accordion className="w-full max-w-3xl px-0" variant="splitted">
        {FAQ_ITEMS.map((item, index) => (
          <AccordionItem key={index} aria-label={item.title} title={item.title}>
            <div className="flex items-start gap-2 pb-2">
              <p className="text-sm leading-6 text-foreground dark:text-white">
                {item.content}
              </p>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Faq;
