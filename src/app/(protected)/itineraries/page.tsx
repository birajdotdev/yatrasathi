import { Suspense } from "react";

import { CalendarDays } from "lucide-react";

import {
  ItinerariesClient,
  ItinerariesSkeleton,
} from "@/components/pages/itineraries";
import { Banner } from "@/components/ui/banner";
import { ErrorBoundaryWrapper } from "@/components/ui/error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HydrateClient, api } from "@/trpc/server";

export default async function ItinerariesPage() {
  // Prefetch all data in parallel
  await Promise.all([
    api.itinerary.getAll.prefetch("all"),
    api.itinerary.getAll.prefetch("upcoming"),
    api.itinerary.getAll.prefetch("past"),
  ]);

  const tabOptions = [
    { value: "all", label: "All" },
    { value: "upcoming", label: "Upcoming" },
    { value: "past", label: "Past" },
  ] as const;

  return (
    <HydrateClient>
      <main className="space-y-6 lg:space-y-8">
        <Banner
          title="Your Itineraries"
          description="Manage and organize all your upcoming adventures in one place."
          badgeText="Travel Plans"
          icon={CalendarDays}
        />
        <Tabs defaultValue="all">
          <TabsList>
            {tabOptions.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabOptions.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <Suspense fallback={<ItinerariesSkeleton />}>
                <ErrorBoundaryWrapper fallbackMessage="Failed to load itineraries. Please try again later.">
                  <ItinerariesClient
                    filter={tab.value === "all" ? "all" : tab.value}
                  />
                </ErrorBoundaryWrapper>
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </HydrateClient>
  );
}
