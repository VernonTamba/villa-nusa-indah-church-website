import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import MembersManager from "./members-manager";

export const metadata: Metadata = {
  title: "Anggota — Admin VNI",
};

export type MemberRow = {
  id: string;
  name: string;
  position: string;
  image_url: string | null;
  display_order: number;
};

export default async function AdminMembersPage() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("display_order", { ascending: true });

  return <MembersManager initialMembers={members ?? []} />;
}
