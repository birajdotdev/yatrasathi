import Image from "next/image";

import { format } from "date-fns";
import { Calendar, ImageIcon, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { splitTitle } from "@/lib/utils";
import { type Itinerary } from "@/types/itinerary";

interface ItineraryHeaderProps {
  itinerary: Itinerary;
}

export default function ItineraryHeader({ itinerary }: ItineraryHeaderProps) {
  const [text, highlight] = splitTitle(itinerary.title);

  // Format dates
  const startDateObj = itinerary.startDate;
  const endDateObj = itinerary.endDate;
  const formattedStartDate = format(startDateObj, "MMM d");
  const formattedEndDate = format(endDateObj, "MMM d, yyyy");
  const dateRange = `${formattedStartDate} - ${formattedEndDate}`;

  // Calculate trip duration in days
  const tripDurationMs = endDateObj.getTime() - startDateObj.getTime();
  const tripDurationDays = Math.ceil(tripDurationMs / (1000 * 60 * 60 * 24));
  const durationText = `${tripDurationDays} ${tripDurationDays === 1 ? "day" : "days"} trip`;

  return (
    <div className="relative mb-8 lg:mb-12 -m-6 lg:-m-8">
      {/* Main hero section with parallax effect */}
      <div className="relative h-[40vh] min-h-[320px] overflow-hidden">
        <Image
          src={itinerary.destination.image}
          alt={itinerary.destination.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
      </div>

      {/* Content card that overlaps with the hero image */}
      <div className="relative px-6 lg:px-8 -mt-24 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 md:p-6">
              <Badge
                variant="outline"
                className="mb-3 rounded-full px-3 py-1 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
              >
                {durationText}
              </Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">
                {text} <span className="text-primary">{highlight}</span>
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-medium">
                      Location
                    </div>
                    <div className="text-foreground">
                      {itinerary.destination.name},{" "}
                      {itinerary.destination.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-medium">
                      Dates
                    </div>
                    <div className="text-foreground">{dateRange}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit button */}
      <div className="absolute top-4 right-4 z-20">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-white/15 backdrop-blur-md hover:bg-white/25 cursor-pointer rounded-full border-none transition-all duration-200 shadow-md"
                aria-label="Edit cover image"
                type="button"
                size="icon"
                variant="outline"
              >
                <ImageIcon className="h-4 w-4 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change cover image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
