"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { Calendar, ImageIcon, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { splitStringByWords } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type Itinerary } from "@/types/itinerary";

import CoverImageDialog from "./cover-image-dialog";

interface ItineraryHeaderProps {
  itinerary: Itinerary;
}

export default function ItineraryHeader({ itinerary }: ItineraryHeaderProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const [text, highlight] = splitStringByWords(itinerary.title);

  // Format dates
  const startDateObj = itinerary.startDate;
  const endDateObj = itinerary.endDate;
  const formattedStartDate = format(startDateObj, "MMM d");
  // If there's an end date, format it and create a range, otherwise just show the start date with year
  const formattedEndDate = endDateObj ? format(endDateObj, "MMM d, yyyy") : "";
  const dateRange = endDateObj
    ? `${formattedStartDate} - ${formattedEndDate}`
    : format(startDateObj, "MMM d, yyyy");

  // Calculate trip duration in days
  const tripDurationMs = endDateObj
    ? endDateObj.getTime() - startDateObj.getTime()
    : 0;
  // Add 1 to include both start and end dates (inclusive count)
  const tripDurationDays = endDateObj
    ? Math.ceil(tripDurationMs / (1000 * 60 * 60 * 24)) + 1
    : 1; // If no end date, it's a one-day trip
  const durationText = `${tripDurationDays} ${tripDurationDays === 1 ? "day" : "days"} trip`;

  const { mutateAsync: updateCoverImage, isPending } =
    api.itinerary.updateCoverImage.useMutation({
      onMutate: () => {
        toast.loading("Updating cover image...");
      },
      onSuccess: async () => {
        // Update the cover image in the itinerary state
        await utils.itinerary.getById.invalidate(itinerary.id);

        // Refresh the page to update server-rendered content
        router.refresh();
        toast.dismiss(); // Dismiss the loading toast
        toast.success("Cover image updated successfully!");
      },
      onError: (error) => {
        toast.dismiss(); // Dismiss the loading toast
        toast.error(error.message);
      },
    });

  const handleCoverImageUpdate = async (imageUrl: string) => {
    await updateCoverImage({
      itineraryId: itinerary.id,
      imageUrl,
    });
  };

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
                <div className="flex items-start gap-2 text-muted-foreground">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mt-1">
                    <MapPin className="size-5 text-primary" />
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

                <div className="flex items-start gap-2 text-muted-foreground">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mt-1">
                    <Calendar className="size-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {endDateObj ? "Dates" : "Date"}
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
              <CoverImageDialog
                onImageSelected={handleCoverImageUpdate}
                isSubmitting={isPending}
                defaultSearchQuery={itinerary.destination.name}
              >
                <Button
                  className="bg-white/15 backdrop-blur-md hover:bg-white/25 cursor-pointer rounded-full border-none transition-all duration-200 shadow-md"
                  aria-label="Edit cover image"
                  type="button"
                  size="icon"
                  variant="outline"
                >
                  <ImageIcon className="h-4 w-4 text-white" />
                </Button>
              </CoverImageDialog>
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
