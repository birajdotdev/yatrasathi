import { type Metadata } from "next";

import UserDashboard from "@/components/pages/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View an overview of your travel plans and activities",
};

export default function DashboardPage() {
  return <UserDashboard />;
}
