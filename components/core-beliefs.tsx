"use client";

import { IconBookmarkQuestion } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { BELIEFS } from "@/constants/core-beliefs";
import { useLanguage } from "@/lib/i18n";

const CoreBeliefs = () => {
  const { messages: t } = useLanguage();
  const beliefs = BELIEFS.map((belief, index) => ({
    ...belief,
    ...t.coreBeliefs.items[index],
  }));

  return (
    <div id="core-beliefs" className="mb-48 space-y-10">
      <section
        aria-labelledby="core-beliefs-heading"
        className="px-4 py-16 sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              id="core-beliefs-heading"
              className="mt-6 text-5xl font-black tracking-tight text-secondary"
            >
              {t.coreBeliefs.titleStart}
              <span className="text-primary">{t.coreBeliefs.titleEmphasis}</span>
            </h1>
            <p className="mt-4 text-sm leading-7 text-foreground dark:text-white sm:text-base">
              {t.coreBeliefs.description}
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:auto-rows-[minmax(220px,1fr)]">
            {beliefs.map((belief) => {
              const Icon = belief.icon;

              return (
                <article
                  key={belief.title}
                  className={`group relative overflow-hidden rounded-[30px] border border-primary/10 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(1,75,63,0.14)] dark:border-white/10 dark:shadow-[0_22px_55px_rgba(2,6,23,0.28)] ${belief.className}`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.34),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(1,75,63,0.08),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(248,167,36,0.08),transparent_34%)]" />

                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/60 dark:text-white">
                          {belief.number}
                        </p>
                        <h2 className="mt-3 text-2xl font-bold text-primary dark:text-white">
                          {belief.title}
                        </h2>
                      </div>

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-white/70 text-primary backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 dark:border-white/10 dark:bg-white/10 dark:text-secondary">
                        <Icon size={28} stroke={1.7} />
                      </div>
                    </div>

                    <div className="mt-8 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary dark:text-primary">
                        {belief.highlight}
                      </p>
                      <p className="text-sm leading-7 text-foreground dark:text-white">
                        {belief.summary}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full px-6 text-sm font-semibold shadow-[0_16px_40px_rgba(1,75,63,0.16)]"
            >
              <a
                href="https://example.com/28-doktrin-advent"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.coreBeliefs.readMore}
                <IconBookmarkQuestion />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoreBeliefs;
