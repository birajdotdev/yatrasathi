import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ImageGridSkeletonProps {
  count?: number;
  className?: string;
}

export function ImageGridSkeleton({
  count = 12,
  className,
}: ImageGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {" "}
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="relative aspect-video">
          <Skeleton className="absolute inset-0" />
        </div>
      ))}
    </div>
  );
}
