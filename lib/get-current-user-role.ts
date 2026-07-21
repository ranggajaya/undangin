import { createClient } from "@/lib/supabase/server";

export type UserRole =
  | "super_admin"
  | "template_admin"
  | "customer_support"
  | "user";

export async function getCurrentUserWithRole() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    user,
    role: (profile?.role ?? "user") as UserRole,
  };
}
