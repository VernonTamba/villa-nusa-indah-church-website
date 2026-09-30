"use client";

import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import PageLoader from "@/components/page-loader";
import { useLanguage } from "@/lib/i18n";

const BARE_PATHS = ["/login", "/admin"];

export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { messages: t } = useLanguage();
  const isBare = BARE_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (isBare) {
    return <>{children}</>;
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="newskin relative flex flex-col min-h-screen">
        <a
          className="fixed left-5 top-2 z-[11000] -translate-y-24 rounded-xl bg-primary px-5 py-3 text-primary-foreground focus:translate-y-0"
          href="#main-content"
        >
          {t.common.skipContent}
        </a>
        <PageLoader />
        <Navbar />
        <main
          className="w-full pt-16 flex-grow"
          id="main-content"
          tabIndex={-1}
        >
          {children}
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
