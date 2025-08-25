import { type Metadata } from "next";
import { Suspense } from "react";

import { BlogSection } from "@/components/pages/dashboard/blog-section";
import { ItinerariesSection } from "@/components/pages/dashboard/itineraries-section";
import { ErrorBoundaryWrapper } from "@/components/ui/error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
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
        <ErrorBoundaryWrapper fallbackMessage="Failed to load your stats">
          <Suspense
            fallback={
              <Skeleton className="aspect-[9/16] max-h-[467px] w-full rounded-3xl md:aspect-[16/9] md:max-h-[353px]" />
            }
          >
            <BannerClient />
          </Suspense>
        </ErrorBoundaryWrapper>
        <ItinerariesSection />
        <BlogSection />
      </main>
    </HydrateClient>
  );
}
