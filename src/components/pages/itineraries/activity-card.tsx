import Image from "next/image";

import { Edit } from "lucide-react";

import ActivityForm from "@/components/pages/itineraries/activity-form";
import LocationPin from "@/components/pages/itineraries/location-pin";
import TimeIndicator from "@/components/pages/itineraries/time-indicator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { type Activity, type ItineraryDay } from "@/types/itinerary";

interface ActivityCardProps {
  activity: Activity;
  day: ItineraryDay;
}

export default function ActivityCard({ activity, day }: ActivityCardProps) {
  return (
    <Card className="group p-0 overflow-hidden md:h-[180px]">
      <div className="flex flex-col md:flex-row h-full">
        {/* Image section with consistent aspect ratio across all screens */}
        {activity.image ? (
          <div className="relative w-full md:w-1/3 aspect-video overflow-hidden flex-shrink-0">
            <Image
              src={activity.image}
              alt={activity.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={false}
            />
          </div>
        ) : null}

        {/* Content section with padding */}
        <div className="p-4 flex-grow flex flex-col overflow-hidden md:overflow-auto">
          {/* Title and edit button */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-base line-clamp-1">
              {activity.title}
            </h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-primary"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit activity</span>
                </Button>
              </DialogTrigger>
              <ActivityForm activity={activity} selectedDayDate={day.date} />
            </Dialog>
          </div>

          {/* Time and location */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
            <TimeIndicator
              startTime={activity.startTime}
              endTime={activity.endTime}
              className="flex items-center gap-1.5 font-medium"
            />
            <LocationPin
              location={activity.location}
              className="flex items-center gap-1.5 font-medium"
            />
          </div>

          {/* Description (if any) */}
          {activity.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {activity.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
