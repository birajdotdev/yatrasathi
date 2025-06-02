"use client";

import { CalendarX, PlusCircle } from "lucide-react";
import { useInView } from "react-intersection-observer";

import {
  ItinerariesSkeleton,
  ItineraryCard,
} from "@/components/pages/itineraries";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

interface ItinerariesClientProps {
  filter?: "upcoming" | "past" | "all";
  limit?: number;
  infinite?: boolean;
}

export default function ItinerariesClient({
  filter = "all",
  limit = 9,
  infinite = true,
}: ItinerariesClientProps) {
  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
  });

  // Use regular query if infinite scrolling is disabled
  if (!infinite) {
    const [{ items: itineraries }] = api.itinerary.getAll.useSuspenseQuery({
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

  // Use infinite query if infinite scrolling is enabled
  const [data, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
    api.itinerary.getAll.useSuspenseInfiniteQuery(
      {
        type: filter,
        limit,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  console.log(hasNextPage, isFetchingNextPage);

  const itineraries = data.pages.flatMap((page) => page.items);

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
      {hasNextPage || isFetchingNextPage ? (
        <ItinerariesSkeleton className="col-span-full" />
      ) : (
        <div
          ref={ref}
          className={cn("h-8 w-full", !hasNextPage && "hidden")}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
