import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  // Redirect bare /admin to the main dashboard
  redirect("/admin/dashboard");
}
