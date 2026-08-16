"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function updateStoryContent(id: string, formData: FormData) {
  const content = String(formData.get("content") ?? "");
  if (!content.trim()) {
    throw new Error("Content can't be empty.");
  }

  const { error } = await supabaseAdmin
    .from("story_content")
    .update({ content })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/story");
  revalidatePath("/our-story");
}
