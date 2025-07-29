import { type Metadata } from "next";

import { BlogSection } from "@/components/pages/dashboard/blog-section";
import { ItinerariesSection } from "@/components/pages/dashboard/itineraries-section";
import { HydrateClient, api } from "@/trpc/server";

import BannerClient from "./banner-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View an overview of your travel plans and activities",
};

export default function DashboardPage() {
  void Promise.all([
    api.user.getUserStats.prefetch(),
    api.itinerary.getAll.prefetch({ type: "upcoming", limit: 3 }),
    api.blog.getUserPosts.prefetch({ status: "published", limit: 3 }),
  ]);

  return (
    <HydrateClient>
      <main className="container mx-auto space-y-6 p-6 lg:space-y-8 lg:p-8">
        <BannerClient />
        <ItinerariesSection />
        <BlogSection />
      </main>
    </HydrateClient>
  );
}
