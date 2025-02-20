import ItinerarySkeleton from "./itinerary-skeleton";

export default function ItinerariesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <ItinerarySkeleton key={index} />
      ))}
    </div>
  );
}
