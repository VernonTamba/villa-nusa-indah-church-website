"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

// ─── Rundown Participants ──────────────────────────────────────────────────────

export async function upsertRundownParticipant(
  serviceKey: string,
  roleKey: string,
  participantName: string,
) {
  const supabase = await createClient();

  // Delete the existing row (if any) then insert the new value.
  await supabase
    .from("rundown_participants")
    .delete()
    .eq("service_key", serviceKey)
    .eq("role_key", roleKey);

  const { error } = await supabase
    .from("rundown_participants")
    .insert({ service_key: serviceKey, role_key: roleKey, participant_name: participantName });

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/rundown");
}

export async function upsertAllRundownParticipants(
  participants: { service_key: string; role_key: string; participant_name: string; role_label?: string }[],
) {
  const supabase = await createClient();

  // Group by service_key so we can delete all existing roles for each
  // affected service in one query, then re-insert.
  const serviceKeys = [...new Set(participants.map((p) => p.service_key))];

  const { error: deleteError } = await supabase
    .from("rundown_participants")
    .delete()
    .in("service_key", serviceKeys);

  if (deleteError) throw new Error(deleteError.message);

  const { error: insertError } = await supabase
    .from("rundown_participants")
    .insert(participants);

  if (insertError) throw new Error(insertError.message);

  revalidatePath("/");
  revalidatePath("/admin/rundown");
}

// ─── Members ──────────────────────────────────────────────────────────────────

export async function addMember(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const imageFile = formData.get("image") as File | null;

  let image_url: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("member-photos")
      .upload(path, imageFile, { contentType: imageFile.type, upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const { data: urlData } = supabase.storage.from("member-photos").getPublicUrl(path);
    image_url = urlData.publicUrl;
  }

  // Calculate the next display_order (append to end of list)
  const { data: existing } = await supabase
    .from("members")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.display_order ?? -1) + 1;

  const { data: inserted, error } = await supabase
    .from("members")
    .insert({ name, position, image_url, display_order: nextOrder })
    .select()
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/members");
  revalidatePath("/admin/members");

  return inserted as { id: string; name: string; position: string; image_url: string | null; display_order: number };
}

export async function updateMember(
  id: string,
  updates: { name?: string; position?: string },
) {
  const supabase = await createClient();
  const { error } = await supabase.from("members").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/members");
  revalidatePath("/admin/members");
}

export async function updateMemberImage(id: string, imageFile: File) {
  const supabase = await createClient();
  const ext = imageFile.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("member-photos")
    .upload(path, imageFile, { contentType: imageFile.type, upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage.from("member-photos").getPublicUrl(path);
  const { error } = await supabase
    .from("members")
    .update({ image_url: urlData.publicUrl })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/members");
  revalidatePath("/admin/members");
}

export async function deleteMember(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/members");
  revalidatePath("/admin/members");
}

export async function updateMembersOrder(
  updates: { id: string; display_order: number }[],
) {
  const supabase = await createClient();
  // Run all updates in parallel
  const results = await Promise.all(
    updates.map(({ id, display_order }) =>
      supabase.from("members").update({ display_order }).eq("id", id),
    ),
  );
  const firstError = results.find((r) => r.error)?.error;
  if (firstError) throw new Error(firstError.message);
  revalidatePath("/members");
  revalidatePath("/admin/members");
}

// ─── Hero Images ──────────────────────────────────────────────────────────────

export async function addHeroImage(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("image") as File;

  if (!file || file.size === 0) throw new Error("No file provided");

  const ext = file.name.split(".").pop();
  const path = `hero-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("hero-images")
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage.from("hero-images").getPublicUrl(path);

  // Get max display_order
  const { data: existing } = await supabase
    .from("hero_images")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.display_order ?? -1) + 1;

  const { error } = await supabase.from("hero_images").insert({
    storage_path: path,
    public_url: urlData.publicUrl,
    display_order: nextOrder,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/images");
}

export async function deleteHeroImage(id: string, storagePath: string) {
  const supabase = await createClient();
  await supabase.storage.from("hero-images").remove([storagePath]);
  const { error } = await supabase.from("hero_images").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/images");
}

export async function updateHeroImageOrder(id: string, displayOrder: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("hero_images")
    .update({ display_order: displayOrder })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/images");
}

// ─── Sabbath Moments ──────────────────────────────────────────────────────────

export async function addSabbathMoment(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("image") as File;
  const label = formData.get("label") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!file || file.size === 0) throw new Error("No file provided");

  const ext = file.name.split(".").pop();
  const path = `moment-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("sabbath-moments")
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage.from("sabbath-moments").getPublicUrl(path);

  const { data: existing } = await supabase
    .from("sabbath_moments")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.display_order ?? -1) + 1;

  const { error } = await supabase.from("sabbath_moments").insert({
    storage_path: path,
    public_url: urlData.publicUrl,
    label,
    title,
    description,
    display_order: nextOrder,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/images");
}

export async function updateSabbathMoment(
  id: string,
  updates: { label?: string; title?: string; description?: string },
) {
  const supabase = await createClient();
  const { error } = await supabase.from("sabbath_moments").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/images");
}

export async function deleteSabbathMoment(id: string, storagePath: string) {
  const supabase = await createClient();
  await supabase.storage.from("sabbath-moments").remove([storagePath]);
  const { error } = await supabase.from("sabbath_moments").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/images");
}
