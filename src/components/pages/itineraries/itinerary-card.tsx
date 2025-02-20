import Image from "next/image";
import Link from "next/link";

import { type RouterOutputs } from "@/trpc/react";

import ActionButton from "./action-button";

type Itinerary = RouterOutputs["itinerary"]["getAll"][0];

export default function ItineraryCard({ itinerary }: { itinerary: Itinerary }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/95 transition-all hover:border-primary/20 hover:shadow-[0_0_1rem_-0.25rem] hover:shadow-primary/20 dark:from-card/95 dark:to-card dark:hover:shadow-primary/10">
      <div className="relative">
        <div className="relative aspect-video w-full overflow-hidden">
          {/* Action button */}
          <div className="absolute right-4 top-4 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 [&:has([data-state=open])]:opacity-100">
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
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-75 dark:from-background dark:via-background/80" />

            {/* Overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
                {itinerary.tripTitle}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm transition-colors dark:bg-primary/20 dark:text-primary/90 group-hover:bg-primary/15 dark:group-hover:bg-primary/25">
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
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/90"
                >
                  <div className="h-1 w-1 rounded-full bg-primary/40 dark:bg-primary/30"></div>
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
