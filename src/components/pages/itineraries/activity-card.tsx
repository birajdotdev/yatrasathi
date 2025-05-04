"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { Edit, ImageIcon, Trash } from "lucide-react";
import { toast } from "sonner";

import ActivityDialogForm from "@/components/pages/itineraries/activity-dialog-form";
import LocationPin from "@/components/pages/itineraries/location-pin";
import TimeIndicator from "@/components/pages/itineraries/time-indicator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { type Activity, type ItineraryDay } from "@/types/itinerary";

import CoverImageDialog from "./cover-image-dialog";

interface ActivityCardProps {
  activity: Activity;
  day: ItineraryDay;
  itineraryDates: {
    startDate: Date;
    endDate: Date | null;
  };
}

export default function ActivityCard({
  activity,
  day,
  itineraryDates,
}: ActivityCardProps) {
  const utils = api.useUtils();
  const params = useParams();
  const router = useRouter();
  const itineraryId = params.id as string;

  const updateActivityImageMutation =
    api.itinerary.updateActivityImage.useMutation({
      onMutate: () => {
        toast.loading("Updating activity image...");
      },
      onSuccess: () => {
        // Invalidate the specific itinerary data
        void utils.itinerary.getById.invalidate(itineraryId);

        router.refresh();
        toast.dismiss(); // Dismiss the loading toast
        toast.success("Activity image updated successfully");
      },
      onError: (error) => {
        toast.dismiss(); // Dismiss the loading toast
        toast.error("Failed to update activity image", {
          description: error.message || "An unknown error occurred",
        });
      },
    });

  const deleteActivityMutation = api.itinerary.deleteActivity.useMutation({
    onMutate: () => {
      toast.loading("Deleting activity...");
    },
    onSuccess: () => {
      // Invalidate the specific itinerary data
      void utils.itinerary.getById.invalidate(itineraryId);

      router.refresh();
      toast.dismiss(); // Dismiss the loading toast
      toast.success("Activity deleted successfully");
    },
    onError: (error) => {
      toast.dismiss(); // Dismiss the loading toast
      toast.error("Failed to delete activity", {
        description: error.message || "An unknown error occurred",
      });
    },
  });

  const handleDelete = async () => {
    await deleteActivityMutation.mutateAsync(activity.id);
  };

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
            <div className="flex">
              <ActivityDialogForm
                activity={activity}
                selectedDayDate={day.date}
                itineraryDates={itineraryDates}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-primary"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit activity</span>
                </Button>
              </ActivityDialogForm>

              <CoverImageDialog
                defaultSearchQuery={activity.location}
                onImageSelected={async (imageUrl) => {
                  await updateActivityImageMutation.mutateAsync({
                    activityId: activity.id,
                    imageUrl,
                  });
                }}
                asChild
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-primary"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span className="sr-only">Change cover image</span>
                </Button>
              </CoverImageDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete activity</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this activity?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All data related to this
                      activity will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleteActivityMutation.isPending}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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
