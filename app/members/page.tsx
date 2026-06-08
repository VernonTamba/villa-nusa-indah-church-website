import type { Metadata } from "next";

import MembersDirectory from "./members-directory";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Anggota Jemaat",
  description: "Direktori anggota GMAHK Villa Nusa Indah.",
};

export default async function MembersPage() {
  let members: { id: string; name: string; position: string; image_url: string | null }[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("members")
      .select("id, name, position, image_url")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[MembersPage] Supabase error:", error.message);
    } else {
      members = data ?? [];
    }
  } catch (err) {
    console.error("[MembersPage] Unexpected error:", err);
  }

  return <MembersDirectory dbMembers={members} />;
}
