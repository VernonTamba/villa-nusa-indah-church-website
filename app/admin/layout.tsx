import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminShell from "./admin-shell";

export const metadata: Metadata = {
  title: "Admin Panel — VNI Church",
  description: "Content management for GMAHK Villa Nusa Indah website.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
