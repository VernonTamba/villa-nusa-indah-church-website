"use client";

import { IDENTITY_PILLARS } from "@/constants/core-values";
import { useLanguage } from "@/lib/i18n";

export default function CoreValues() {
  const { messages: t } = useLanguage();

  return (
    <section
      aria-labelledby="core-values-heading"
      className="ns-section ns-container"
      id="core-values"
    >
      <div className="max-w-2xl">
        <h2 className="ns-heading" id="core-values-heading">
          {t.coreValues.titleStart}
          <span className="text-secondary">{t.coreValues.titleMiddle}</span>
          {t.coreValues.titleEnd}
        </h2>
        <p className="ns-copy mt-4">{t.coreValues.description}</p>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {IDENTITY_PILLARS.map((pillar, index) => {
          const content = t.coreValues.pillars[index];
          const Icon = pillar.icon;

          return (
            <article key={pillar.title} className="ns-surface">
              <div className="flex items-center gap-3">
                <Icon aria-hidden="true" className="text-secondary" size={24} />
                <h3 className="ns-card-title">{content.title}</h3>
              </div>
              <p className="mt-5 text-base font-medium text-secondary">
                {content.descriptor}
              </p>
              <p className="ns-copy mt-2">{content.description}</p>
              <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
                {content.footer}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
