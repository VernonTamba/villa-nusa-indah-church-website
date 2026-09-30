"use client";

import { IconBookmarkQuestion } from "@tabler/icons-react";

import { BELIEFS } from "@/constants/core-beliefs";
import { useLanguage } from "@/lib/i18n";

export default function CoreBeliefs() {
  const { messages: t } = useLanguage();

  return (
    <section
      aria-labelledby="core-beliefs-heading"
      className="ns-section ns-container border-t border-border"
      id="core-beliefs"
    >
      <div className="max-w-2xl">
        <h2 className="ns-heading" id="core-beliefs-heading">
          {t.coreBeliefs.titleStart}
          <span className="text-secondary">{t.coreBeliefs.titleEmphasis}</span>
        </h2>
        <p className="ns-copy mt-4">{t.coreBeliefs.description}</p>
      </div>
      <div className="mt-8 grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
        {BELIEFS.map((belief, index) => {
          const content = t.coreBeliefs.items[index];
          const Icon = belief.icon;

          return (
            <article key={belief.title} className="border-t border-border py-5">
              <Icon
                aria-hidden="true"
                className="mb-4 text-secondary"
                size={24}
              />
              <h3 className="ns-card-title">{content.title}</h3>
              <p className="mt-3 text-sm font-medium text-secondary">
                {content.highlight}
              </p>
              <p className="ns-copy mt-2">{content.summary}</p>
            </article>
          );
        })}
      </div>
      <a
        className="ns-secondary mt-6"
        href="https://adventist.org/beliefs"
        rel="noopener noreferrer"
        target="_blank"
      >
        {t.coreBeliefs.readMore}
        <IconBookmarkQuestion size={20} />
      </a>
    </section>
  );
}
