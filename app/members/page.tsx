import type { Metadata } from "next";

import MembersDirectory from "./members-directory";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Anggota Jemaat",
  description: "Direktori anggota GMAHK Villa Nusa Indah.",
};

export default async function MembersPage() {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("members")
    .select("id, name, position, image_url")
    .order("display_order", { ascending: true });

  return <MembersDirectory dbMembers={members ?? []} />;
}
