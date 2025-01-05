import { redirect } from "next/navigation";

import UserDashboard from "@/components/dashboards/user-dashboard";
import { auth } from "@/server/auth";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) redirect("/signin");

  return <UserDashboard user={session.user} />;
}
