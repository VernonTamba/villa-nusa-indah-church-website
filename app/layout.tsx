import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

import { Providers } from "./providers";
import ConditionalShell from "./conditional-shell";

import { siteConfig } from "@/config/site";
import { fontInter } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: "https://vni-church.vercel.app",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: "/images/hero-1.jpeg",
        width: 1200,
        height: 630,
        alt: "GMAHK Villa Nusa Indah Church",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/images/hero-1.jpeg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: "GMAHK Villa Nusa Indah",
  alternateName: "Gereja Masehi Advent Hari Ketujuh Villa Nusa Indah",
  url: "https://vni-church.vercel.app",
  description:
    "A Seventh-day Adventist church community in Villa Nusa Indah, committed to sharing the love of Christ.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Raya Villa Nusa Indah",
    addressLocality: "Villa Nusa Indah",
    addressCountry: "ID",
  },
  openingHours: "Sa 08:30-18:00",
  sameAs: [
    "https://www.youtube.com/@GMAHKvillanusaindah",
    "https://www.facebook.com/GmahkVillaNusaIndah",
    "https://www.instagram.com/gmahkvni/",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="id" className="overflow-x-hidden">
      <head>
        <Script
          id="json-ld-church"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={clsx(
          "min-h-screen overflow-x-clip text-foreground bg-background font-inter antialiased",
          fontInter.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <ConditionalShell>{children}</ConditionalShell>
        </Providers>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}

