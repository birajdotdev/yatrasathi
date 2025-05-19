import { BlogsSkeleton } from "@/components/pages/blogs";
import { ItinerariesSkeleton } from "@/components/pages/itineraries";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDashboardSkeletonLoading() {
  return (
    <main className="container mx-auto p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Welcome Banner Skeleton */}
      <div className="rounded-3xl bg-linear-to-r from-primary/5 via-background/50 to-background dark:from-primary/10 dark:via-background/90 dark:to-background">
        <div className="p-6 sm:p-8 lg:p-12">
          <Skeleton className="mb-4 h-6 w-40" />
          <Skeleton className="mb-4 h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="grid grid-cols-1 divide-y divide-primary/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-primary/20">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="p-4 sm:p-6 lg:p-8">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Itineraries Skeleton */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <ItinerariesSkeleton />
      </div>

      {/* Blog Recommendations Skeleton */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <BlogsSkeleton />
      </div>
    </main>
  );
}
