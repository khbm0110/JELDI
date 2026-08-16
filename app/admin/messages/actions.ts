"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { ContactMessageStatus } from "@/lib/database.types";

const STATUSES: ContactMessageStatus[] = ["new", "read", "replied"];

export async function updateMessageStatus(id: string, formData: FormData) {
  const status = String(formData.get("status") ?? "");
  if (!STATUSES.includes(status as ContactMessageStatus)) {
    throw new Error("Invalid status.");
  }

  const { error } = await supabaseAdmin
    .from("contact_messages")
    .update({ status: status as ContactMessageStatus })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
