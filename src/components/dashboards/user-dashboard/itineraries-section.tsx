"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";

import { type ItemVariants } from "@/components/dashboards/user-dashboard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ItinerariesSectionProps {
  variants: ItemVariants;
}

export function ItinerariesSection({ variants }: ItinerariesSectionProps) {
  return (
    <motion.div variants={variants} className="mb-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Your
          </span>{" "}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Itineraries
          </span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="group relative overflow-hidden rounded-full border-primary/50 px-6 transition-all hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            <span>Create New</span>
          </span>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {itineraries.map((itinerary) => (
          <ItineraryCard
            key={itinerary.title}
            itinerary={itinerary}
            variants={variants}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ItineraryCard({
  itinerary,
  variants,
}: {
  itinerary: (typeof itineraries)[0];
  variants: ItemVariants;
}) {
  return (
    <motion.div
      variants={variants}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/95 transition-all hover:border-primary/20 hover:shadow-[0_0_1rem_-0.25rem] hover:shadow-primary/20 dark:from-card/95 dark:to-card dark:hover:shadow-primary/10"
    >
      <div className="relative">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={itinerary.image}
            alt={itinerary.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-75 dark:from-background dark:via-background/80" />

          {/* Overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
              {itinerary.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm transition-colors dark:bg-primary/20 dark:text-primary/90 group-hover:bg-primary/15 dark:group-hover:bg-primary/25">
                {itinerary.remainingDays} days
              </div>
              <time
                dateTime={itinerary.date}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/90"
              >
                <div className="h-1 w-1 rounded-full bg-primary/40 dark:bg-primary/30"></div>
                Starting {itinerary.date}
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
                <DropdownMenuItem className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                  <Trash className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const itineraries = [
  {
    title: "Nepal Adventure",
    remainingDays: 10,
    date: "June 15",
    image:
      "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "Tokyo Exploration",
    remainingDays: 7,
    date: "August 3",
    image:
      "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "European Tour",
    remainingDays: 14,
    date: "September 20",
    image:
      "https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];
