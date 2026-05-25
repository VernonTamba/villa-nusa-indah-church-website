import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { RUNDOWN_ITEMS } from "@/constants/rundown";
import RundownForm from "./rundown-form";

export const metadata: Metadata = {
  title: "Rundown — Admin VNI",
};

export type RundownParticipantRow = {
  id: string;
  service_key: string;
  role_key: string;
  participant_name: string;
};

export default async function AdminRundownPage() {
  const supabase = await createClient();
  const { data: participants } = await supabase
    .from("rundown_participants")
    .select("*");

  // Build lookup: service_key -> role_key -> participant_name
  const lookup: Record<string, Record<string, string>> = {};
  for (const row of participants ?? []) {
    if (!lookup[row.service_key]) lookup[row.service_key] = {};
    lookup[row.service_key][row.role_key] = row.participant_name;
  }

  return <RundownForm rundownItems={RUNDOWN_ITEMS} dbLookup={lookup} />;
}
