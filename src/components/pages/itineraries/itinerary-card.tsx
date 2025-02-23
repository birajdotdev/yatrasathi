import Image from "next/image";
import Link from "next/link";

import { type RouterOutputs } from "@/trpc/react";

import ActionButton from "./action-button";

type Itinerary = RouterOutputs["itinerary"]["getAll"][0];

export default function ItineraryCard({ itinerary }: { itinerary: Itinerary }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-card to-card/98 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 dark:from-card/90 dark:to-card/95 dark:hover:shadow-primary/5">
      <div className="relative">
        <div className="relative aspect-video w-full overflow-hidden">
          {/* Action button */}
          <div className="absolute right-4 top-4 z-10 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 [&:has([data-state=open])]:opacity-100">
            <ActionButton itineraryId={itinerary.id} />
          </div>
          <Link href={`/itineraries/${itinerary.id}`} className="block">
            <Image
              src={
                itinerary.coverImage?.length === 0
                  ? "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  : itinerary.coverImage!
              }
              alt={itinerary.tripTitle}
              fill
              className="object-cover transition-all duration-700 will-change-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-60 dark:from-background/95 dark:via-background/75 dark:opacity-80" />

            {/* Overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="mb-4 text-xl font-semibold tracking-tight text-foreground/95 transition-colors group-hover:text-foreground">
                {itinerary.tripTitle}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary/90 backdrop-blur-sm transition-colors group-hover:bg-primary/25 dark:bg-primary/25 dark:text-primary/90 dark:group-hover:bg-primary/30">
                  {Math.max(
                    0,
                    Math.ceil(
                      (itinerary.startDate.getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )
                  )}{" "}
                  days
                </div>
                <time
                  dateTime={itinerary.startDate.toISOString()}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors group-hover:text-muted-foreground/90 dark:text-muted-foreground dark:group-hover:text-muted-foreground/90"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60 dark:bg-primary/40"></div>
                  Starting{" "}
                  {itinerary.startDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
