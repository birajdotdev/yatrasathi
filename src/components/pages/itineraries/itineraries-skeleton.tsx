import ItinerarySkeleton from "./itinerary-skeleton";

interface ItinerariesSkeletonProps {
  count?: number;
}

export default function ItinerariesSkeleton({
  count = 3,
}: ItinerariesSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ItinerarySkeleton key={index} />
      ))}
    </div>
  );
}
