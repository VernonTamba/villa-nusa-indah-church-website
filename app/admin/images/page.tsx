import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ImagesManager from "./images-manager";

export const metadata: Metadata = {
  title: "Gambar — Admin VNI",
};

export type HeroImageRow = {
  id: string;
  storage_path: string;
  public_url: string;
  display_order: number;
};

export type SabbathMomentRow = {
  id: string;
  storage_path: string;
  public_url: string;
  label: string;
  title: string;
  description: string;
  display_order: number;
};

export default async function AdminImagesPage() {
  const supabase = await createClient();

  const [{ data: heroImages }, { data: sabbathMoments }] = await Promise.all([
    supabase.from("hero_images").select("*").order("display_order", { ascending: true }),
    supabase.from("sabbath_moments").select("*").order("display_order", { ascending: true }),
  ]);

  return (
    <ImagesManager
      initialHeroImages={heroImages ?? []}
      initialSabbathMoments={sabbathMoments ?? []}
    />
  );
}
