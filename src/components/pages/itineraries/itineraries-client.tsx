"use client";

import { CalendarX, PlusCircle } from "lucide-react";

import { ItineraryCard } from "@/components/pages/itineraries";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/trpc/react";

interface ItinerariesClientProps {
  filter?: "upcoming" | "past" | "all";
  limit?: number;
}

export default function ItinerariesClient({
  filter = "all",
  limit,
}: ItinerariesClientProps) {
  const [itineraries] = api.itinerary.getAll.useSuspenseQuery({
    type: filter,
    limit,
  });

  if (itineraries.length === 0) {
    return (
      <EmptyState
        icon={CalendarX}
        title="No itineraries found"
        description={
          filter === "upcoming"
            ? "You don't have any upcoming trips planned."
            : filter === "past"
              ? "You haven't completed any trips yet."
              : "Get started by creating your first travel itinerary."
        }
        action={{
          label: "Create Itinerary",
          href: "/itineraries/create",
          icon: PlusCircle,
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {itineraries.map((itinerary) => (
        <ItineraryCard key={itinerary.id} itinerary={itinerary} />
      ))}
    </div>
  );
}
