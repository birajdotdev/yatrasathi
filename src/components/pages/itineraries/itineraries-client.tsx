"use client";

import { ItineraryCard } from "@/components/pages/itineraries";
import { api } from "@/trpc/react";

export default function ItinerariesClient() {
  const [itineraries] = api.itinerary.getAll.useSuspenseQuery();
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {itineraries
        .filter((i) => i.startDate > new Date())
        .map((itinerary) => (
          <ItineraryCard key={itinerary.id} itinerary={itinerary} />
        ))}
    </div>
  );
}
