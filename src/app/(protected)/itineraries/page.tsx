import { Suspense } from "react";

import { CalendarDays } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { ItinerariesSkeleton } from "@/components/pages/itineraries";
import { ItinerariesClient } from "@/components/pages/itineraries";
import { Banner } from "@/components/ui/banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HydrateClient, api } from "@/trpc/server";

export default async function ItinerariesPage() {
  void api.itinerary.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="space-y-6 lg:space-y-8">
        <Banner
          title="Your Itineraries"
          description="Manage and organize all your upcoming adventures in one place."
          badgeText="Travel Plans"
          icon={CalendarDays}
        />
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <Suspense fallback={<ItinerariesSkeleton />}>
              <ErrorBoundary fallback={<p>Error</p>}>
                <ItinerariesClient />
              </ErrorBoundary>
            </Suspense>
          </TabsContent>
          <TabsContent value="past">
            <Suspense fallback={<ItinerariesSkeleton />}>
              <ErrorBoundary fallback={<p>Error</p>}>
                <ItinerariesClient />
              </ErrorBoundary>
            </Suspense>
          </TabsContent>
          <TabsContent value="drafts">
            <p className="text-muted-foreground">
              You don&apos;t have any draft itineraries.
            </p>
          </TabsContent>
        </Tabs>
      </main>
    </HydrateClient>
  );
}
