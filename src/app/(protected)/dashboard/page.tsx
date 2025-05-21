import { type Metadata } from "next";

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
  const userStats = await api.user.getUserStats();

  await Promise.all([
    void api.itinerary.getAll.prefetch({ type: "upcoming", limit: 3 }),
    void api.blog.getUserPosts.prefetch({ status: "published", limit: 3 }),
  ]);

  const welcomeMessage = userStats.isFirstLogIn
    ? `Welcome, ${userStats.firstName}!`
    : `Welcome back, ${userStats.firstName}!`;

  return (
    <HydrateClient>
      <main className="container mx-auto p-6 lg:p-8 space-y-6 lg:space-y-8">
        <Banner
          badgeText="Dashboard Overview"
          title={welcomeMessage}
          description="Here's an overview of your travel plans and activities."
          icon={Home}
          quickStats={{
            upcomingTrips: userStats.upcomingTripsCount,
            blogPosts: userStats.blogPostsCount,
            nextTripDays: userStats.nextTripDays ?? "--",
          }}
        />
        <ItinerariesSection />
        <BlogSection />
      </main>
    </HydrateClient>
  );
}
