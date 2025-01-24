import { type Metadata } from "next";
import { redirect } from "next/navigation";

import UserDashboard from "@/components/pages/dashboard";
import { auth } from "@/server/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View an overview of your travel plans and activities",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/signin");

  return <UserDashboard user={session.user} />;
}
