import { type Metadata } from "next";
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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Itineraries",
  description: "Manage and organize all your upcoming adventures in one place.",
};

export default function ItinerariesPage() {
  void api.itinerary.getAll.prefetchInfinite({
    type: "all",
    limit: 9,
  });

  const tabOptions = [
    { value: "all", label: "All" },
    { value: "upcoming", label: "Upcoming" },
    { value: "past", label: "Past" },
  ] as const;

  return (
    <HydrateClient>
      <main className="container mx-auto space-y-6 p-6 lg:space-y-8 lg:p-8">
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
                  <ItinerariesClient filter={tab.value} />
                </ErrorBoundaryWrapper>
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </HydrateClient>
  );
}
