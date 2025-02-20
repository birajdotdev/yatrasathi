import { Skeleton } from "@/components/ui/skeleton";

export default function ItinerarySkeleton() {
  return (
    <div className="rounded-xl">
      <Skeleton className="aspect-video w-full" />
      <div className="p-5">
        <Skeleton className="mb-3 h-6 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </div>
  );
}
