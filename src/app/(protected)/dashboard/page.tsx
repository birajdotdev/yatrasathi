import { type Metadata } from "next";

import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Home } from "lucide-react";

import { BlogSection } from "@/components/pages/dashboard/blog-section";
import { ItinerariesSection } from "@/components/pages/dashboard/itineraries-section";
import { Banner } from "@/components/ui/banner";
import { HydrateClient, api } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View an overview of your travel plans and activities",
};

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) return <RedirectToSignIn />;

  void api.itinerary.getAll.prefetch("upcoming");

  return (
    <HydrateClient>
      <main className="container mx-auto p-6 lg:p-8 space-y-6 lg:space-y-8">
        <Banner
          badgeText="Dashboard Overview"
          title={`Welcome back, ${user.firstName}!`}
          description="Here's an overview of your travel plans and activities."
          icon={Home}
          quickStats
        />
        <ItinerariesSection />
        <BlogSection />
      </main>
    </HydrateClient>
  );
}
