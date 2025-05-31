import { cn } from "@/lib/utils";

import ItinerarySkeleton from "./itinerary-skeleton";

interface ItinerariesSkeletonProps {
  count?: number;
  className?: string;
}

export default function ItinerariesSkeleton({
  count = 3,
  className,
}: ItinerariesSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ItinerarySkeleton key={index} />
      ))}
    </div>
  );
}
