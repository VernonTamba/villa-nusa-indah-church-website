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
  let members: MemberRow[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[AdminMembersPage] Supabase error:", error.message);
    } else {
      members = data ?? [];
    }
  } catch (err) {
    console.error("[AdminMembersPage] Unexpected error:", err);
  }

  return <MembersManager initialMembers={members} />;
}
