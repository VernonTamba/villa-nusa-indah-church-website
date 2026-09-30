"use client";

import clsx from "clsx";

import { useLanguage } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, setLocale, messages: t } = useLanguage();

  return (
    <div
      aria-label={t.common.language}
      className="inline-flex items-center rounded-xl border border-border bg-surface text-sm font-semibold text-muted-foreground"
      role="group"
    >
      <button
        aria-label="Bahasa Indonesia"
        aria-pressed={locale === "id"}
        className={clsx(
          "min-h-11 min-w-11 rounded-lg transition-colors cursor-pointer",
          locale === "id" ? "text-primary" : "hover:text-foreground",
        )}
        type="button"
        onClick={() => setLocale("id")}
      >
        ID
      </button>
      <button
        aria-label="English"
        aria-pressed={locale === "en"}
        className={clsx(
          "min-h-11 min-w-11 rounded-lg transition-colors cursor-pointer",
          locale === "en" ? "text-primary" : "hover:text-foreground",
        )}
        type="button"
        onClick={() => setLocale("en")}
      >
        EN
      </button>
    </div>
  );
}
