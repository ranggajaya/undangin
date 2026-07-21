import { redirect } from "next/navigation";
import { getCurrentUserWithRole } from "@/lib/get-current-user-role";

export default async function AdminIndexPage() {
  const auth = await getCurrentUserWithRole();

  if (auth?.role === "super_admin" || auth?.role === "template_admin") {
    redirect("/admin/templates");
  }
  if (auth?.role === "customer_support") {
    redirect("/admin/support");
  }

  redirect("/dashboard");
}
