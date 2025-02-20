import { Suspense } from "react";

import { CalendarDays } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import {
  ItinerariesClient,
  ItinerariesSkeleton,
} from "@/components/pages/itineraries";
import { Banner } from "@/components/ui/banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HydrateClient, api } from "@/trpc/server";

export default async function ItinerariesPage() {
  void api.itinerary.getAll.prefetch("upcoming");
  void api.itinerary.getAll.prefetch("past");
  void api.itinerary.getAll.prefetch("all");
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
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Suspense fallback={<ItinerariesSkeleton />}>
              <ErrorBoundary fallback={<p>Error</p>}>
                <ItinerariesClient />
              </ErrorBoundary>
            </Suspense>
          </TabsContent>
          <TabsContent value="upcoming">
            <Suspense fallback={<ItinerariesSkeleton />}>
              <ErrorBoundary fallback={<p>Error</p>}>
                <ItinerariesClient filter="upcoming" />
              </ErrorBoundary>
            </Suspense>
          </TabsContent>
          <TabsContent value="past">
            <Suspense fallback={<ItinerariesSkeleton />}>
              <ErrorBoundary fallback={<p>Error</p>}>
                <ItinerariesClient filter="past" />
              </ErrorBoundary>
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </HydrateClient>
  );
}
