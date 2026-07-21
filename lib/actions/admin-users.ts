"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserWithRole } from "@/lib/get-current-user-role";
import { revalidatePath } from "next/cache";

export async function updateUserRole(
  targetUserId: string,
  newRole: "super_admin" | "template_admin" | "customer_support" | "user"
) {
  const auth = await getCurrentUserWithRole();
  if (!auth || auth.role !== "super_admin") {
    throw new Error("Hanya super admin yang bisa mengubah role.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", targetUserId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}
