import Link from "next/link";
import { Suspense } from "react";

import { ChevronRight } from "lucide-react";

import {
  ItinerariesClient,
  ItinerariesSkeleton,
} from "@/components/pages/itineraries";
import { Button } from "@/components/ui/button";
import { ErrorBoundaryWrapper } from "@/components/ui/error-boundary";

export function ItinerariesSection() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Upcoming
          </span>{" "}
          <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Trips
          </span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="group relative overflow-hidden rounded-full border-primary/50 px-6 transition-all hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
          asChild
        >
          <Link href="/itineraries">
            <span className="relative z-10 flex items-center gap-2">
              <span>View More</span>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </Button>
      </div>
      <Suspense fallback={<ItinerariesSkeleton />}>
        <ErrorBoundaryWrapper fallbackMessage="Failed to load itineraries. Please try again later.">
          <ItinerariesClient filter="upcoming" limit={3} />
        </ErrorBoundaryWrapper>
      </Suspense>
    </section>
  );
}
