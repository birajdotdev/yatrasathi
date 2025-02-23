import { Skeleton } from "@/components/ui/skeleton";

export default function ItinerarySkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-xl">
      <div className="relative">
        <div className="relative aspect-video w-full overflow-hidden">
          {/* Action button skeleton */}
          <div className="absolute right-4 top-4 z-10">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          {/* Image skeleton */}
          <Skeleton className="h-full w-full" />

          {/* Content skeleton */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <Skeleton className="mb-4 h-7 w-3/4" />
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
