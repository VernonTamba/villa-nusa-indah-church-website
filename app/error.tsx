"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

import { useLanguage } from "@/lib/i18n";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const { messages: t } = useLanguage();
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
    heading.current?.focus();
  }, [error]);

  return (
    <section className="newskin ns-container ns-section">
      <h2 ref={heading} className="ns-heading" tabIndex={-1}>
        {t.common.errorTitle}
      </h2>
      <p className="ns-copy mt-4">{t.common.errorDescription}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="ns-primary" onClick={() => reset()}>
          {t.common.retry}
        </button>
        <Link className="ns-secondary" href="/">
          {t.common.home}
        </Link>
      </div>
    </section>
  );
}
