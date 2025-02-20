import Image from "next/image";
import Link from "next/link";

import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type RouterOutputs } from "@/trpc/react";

type Itinerary = RouterOutputs["itinerary"]["getAll"][0];

export default function ItineraryCard({ itinerary }: { itinerary: Itinerary }) {
  return (
    <Link href={`/itineraries/${itinerary.id}`}>
      <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/95 transition-all hover:border-primary/20 hover:shadow-[0_0_1rem_-0.25rem] hover:shadow-primary/20 dark:from-card/95 dark:to-card dark:hover:shadow-primary/10">
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={itinerary.coverImage ?? ""}
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

            {/* Action button */}
            <div className="absolute right-4 top-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-background/90 dark:bg-background/40 dark:hover:bg-background/50"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[160px] animate-in fade-in-0 zoom-in-95"
                >
                  <Link href={`/itineraries/${itinerary.id}/edit`}>
                    <DropdownMenuItem className="gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                    <Trash className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
