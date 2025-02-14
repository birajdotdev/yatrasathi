import { CalendarDays } from "lucide-react";

import { ItineraryCard } from "@/components/pages/itineraries/itinerary-card";
import { Banner } from "@/components/ui/banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { itineraries } from "@/data/itineraries";

export default function ItinerariesPage() {
  return (
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {itineraries
              .filter((i) => i.status === "upcoming")
              .map((itinerary) => (
                <ItineraryCard key={itinerary.title} itinerary={itinerary} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {itineraries
              .filter((i) => i.status === "past")
              .map((itinerary) => (
                <ItineraryCard key={itinerary.title} itinerary={itinerary} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="drafts">
          <p className="text-muted-foreground">
            You don&apos;t have any draft itineraries.
          </p>
        </TabsContent>
      </Tabs>
    </main>
  );
}
