import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login — VNI Church",
  description: "Admin login for GMAHK Villa Nusa Indah website management.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
