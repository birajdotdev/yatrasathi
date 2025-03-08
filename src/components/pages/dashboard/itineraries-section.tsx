"use client";

import Link from "next/link";

import { Plus } from "lucide-react";

import { ItineraryCard } from "@/components/pages/itineraries";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

export function ItinerariesSection() {
  const [itineraries] = api.itinerary.getAll.useSuspenseQuery();

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Your
          </span>{" "}
          <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Itineraries
          </span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="group relative overflow-hidden rounded-full border-primary/50 px-6 transition-all hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
          asChild
        >
          <Link href="/itineraries/create">
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              <span>Create New</span>
            </span>
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {itineraries.slice(0, 3).map((itinerary) => (
          <ItineraryCard key={itinerary.id} itinerary={itinerary} />
        ))}
      </div>
    </section>
  );
}
