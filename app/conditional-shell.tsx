"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import PageLoader from "@/components/page-loader";

const BARE_PATHS = ["/login", "/admin"];

export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBare = BARE_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (isBare) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      <PageLoader />
      <Navbar />
      <main className="container mx-auto max-w-9xl pt-16 px-6 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
