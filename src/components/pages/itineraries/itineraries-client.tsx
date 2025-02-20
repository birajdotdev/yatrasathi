"use client";

import { ItineraryCard } from "@/components/pages/itineraries";
import { api } from "@/trpc/react";

interface ItinerariesClientProps {
  filter?: "upcoming" | "past" | "all";
}

export default function ItinerariesClient({
  filter = "all",
}: ItinerariesClientProps) {
  const [itineraries] = api.itinerary.getAll.useSuspenseQuery(filter);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {itineraries.map((itinerary) => (
        <ItineraryCard key={itinerary.id} itinerary={itinerary} />
      ))}
    </div>
  );
}
