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
  role_label?: string;
};

export default async function AdminRundownPage() {
  const supabase = await createClient();
  const { data: participants } = await supabase
    .from("rundown_participants")
    .select("*");

  // Build participant name lookup: service_key -> role_key -> participant_name
  const lookup: Record<string, Record<string, string>> = {};
  // Build role label lookup: service_key -> role_key -> role_label
  const labelLookup: Record<string, Record<string, string>> = {};

  for (const row of participants ?? []) {
    if (!lookup[row.service_key]) lookup[row.service_key] = {};
    lookup[row.service_key][row.role_key] = row.participant_name;

    if (row.role_label) {
      if (!labelLookup[row.service_key]) labelLookup[row.service_key] = {};
      labelLookup[row.service_key][row.role_key] = row.role_label;
    }
  }

  return (
    <RundownForm
      rundownItems={RUNDOWN_ITEMS}
      dbLookup={lookup}
      labelLookup={labelLookup}
    />
  );
}
