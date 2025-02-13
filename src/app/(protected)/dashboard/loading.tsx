import { Skeleton } from "@/components/ui/skeleton";

export default function UserDashboardSkeletonLoading() {
  return (
    <main>
      {/* Welcome Banner Skeleton */}
      <div className="mb-12 rounded-3xl bg-gradient-to-r from-primary/5 via-background/50 to-background dark:from-primary/10 dark:via-background/90 dark:to-background">
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
      <div className="mb-12">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border/50">
              <Skeleton className="aspect-video w-full" />
              <div className="p-5">
                <Skeleton className="mb-3 h-6 w-3/4" />
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Recommendations Skeleton */}
      <div>
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border/50">
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="p-5">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="mb-4 h-4 w-full" />
                <Skeleton className="mb-4 h-4 w-full" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="mb-1 h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
