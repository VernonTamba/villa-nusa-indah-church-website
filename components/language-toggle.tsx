"use client";

import clsx from "clsx";

import { useLanguage } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      aria-label="Choose language"
      className="inline-flex h-8 items-center rounded-full bg-default-100 px-2 text-xs font-bold uppercase text-default-500"
      role="group"
    >
      <button
        aria-pressed={locale === "id"}
        className={clsx(
          "px-1.5 transition-colors cursor-pointer",
          locale === "id" ? "text-primary" : "hover:text-foreground",
        )}
        type="button"
        onClick={() => setLocale("id")}
      >
        ID
      </button>
      <span className="text-default-300" aria-hidden="true">
        |
      </span>
      <button
        aria-pressed={locale === "en"}
        className={clsx(
          "px-1.5 transition-colors cursor-pointer",
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
