import { ItinerariesSkeleton } from "@/components/pages/itineraries";
import { Skeleton } from "@/components/ui/skeleton";

export default function ItinerariesPageSkeletonLoading() {
  return (
    <main className="container mx-auto p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Banner Skeleton */}
      <div className="rounded-3xl bg-linear-to-r from-primary/5 via-background/50 to-background dark:from-primary/10 dark:via-background/90 dark:to-background p-6 sm:p-8 lg:p-12">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-6 w-48" /> {/* Badge */}
        </div>
        <Skeleton className="h-8 w-64 mb-4" /> {/* Title */}
        <Skeleton className="h-6 w-3/4" /> {/* Description */}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-2">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" /> /* Tab triggers */
          ))}
        </div>

        {/* Content Skeleton */}
        <ItinerariesSkeleton count={6} />
      </div>
    </main>
  );
}
