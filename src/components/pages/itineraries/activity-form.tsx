"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { type Activity } from "@/types/itinerary";

const activityFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  date: z.date({ required_error: "Date is required" }),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

interface ActivityFormProps {
  activity?: Activity;
  selectedDayDate?: Date;
  onComplete?: () => void;
}

export default function ActivityForm({
  activity,
  selectedDayDate,
  onComplete,
}: ActivityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const utils = api.useUtils();
  const params = useParams();
  const itineraryId = params.id as string;
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  // Setup API mutations
  const createActivityMutation = api.itinerary.createActivity.useMutation({
    onSuccess: async () => {
      toast.success("Activity added successfully", {
        description: "Your itinerary has been updated",
      });

      if (itineraryId) {
        // Force refetch the itinerary data
        await utils.itinerary.getById.invalidate(itineraryId);
        // Explicitly trigger a refetch
        await utils.itinerary.getById.fetch(itineraryId);
      }

      // Force page refresh to ensure updated data is shown
      router.refresh();

      if (dialogCloseRef.current) {
        dialogCloseRef.current.click();
      }

      if (onComplete) onComplete();
    },
    onError: (error) => {
      toast.error("Failed to add activity", {
        description: error.message || "An unknown error occurred",
      });
      setIsSubmitting(false);
    },
  });

  const updateActivityMutation = api.itinerary.updateActivity.useMutation({
    onSuccess: async () => {
      toast.success("Activity updated successfully", {
        description: "Your changes have been saved",
      });

      if (itineraryId) {
        // Force refetch the itinerary data
        await utils.itinerary.getById.invalidate(itineraryId);
        // Explicitly trigger a refetch
        await utils.itinerary.getById.fetch(itineraryId);
      }

      // Force page refresh to ensure updated data is shown
      router.refresh();

      if (dialogCloseRef.current) {
        dialogCloseRef.current.click();
      }

      if (onComplete) onComplete();
    },
    onError: (error) => {
      toast.error("Failed to update activity", {
        description: error.message || "An unknown error occurred",
      });
      setIsSubmitting(false);
    },
  });

  const deleteActivityMutation = api.itinerary.deleteActivity.useMutation({
    onSuccess: async () => {
      toast.success("Activity deleted", {
        description: "The activity has been removed from your itinerary",
      });

      if (itineraryId) {
        // Force refetch the itinerary data
        await utils.itinerary.getById.invalidate(itineraryId);
        // Explicitly trigger a refetch
        await utils.itinerary.getById.fetch(itineraryId);
      }

      // Force page refresh to ensure updated data is shown
      router.refresh();

      if (dialogCloseRef.current) {
        dialogCloseRef.current.click();
      }

      if (onComplete) onComplete();
    },
    onError: (error) => {
      toast.error("Failed to delete activity", {
        description: error.message || "An unknown error occurred",
      });
    },
  });

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: activity
      ? {
          title: activity.title,
          description: activity.description,
          location: activity.location,
          startTime: activity.startTime,
          endTime: activity.endTime,
          date: selectedDayDate,
        }
      : {
          title: "",
          description: "",
          location: "",
          startTime: "",
          endTime: "",
          date: selectedDayDate,
        },
  });

  const onSubmit = async (data: ActivityFormValues) => {
    setIsSubmitting(true);

    try {
      if (activity) {
        await updateActivityMutation.mutateAsync({
          activityId: activity.id,
          data,
        });
      } else {
        await createActivityMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error("Error processing activity:", error);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!activity) return;

    if (window.confirm("Are you sure you want to delete this activity?")) {
      await deleteActivityMutation.mutateAsync(activity.id);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px] rounded-xl">
      <DialogHeader>
        <DialogTitle>
          {activity ? "Edit Activity" : "Add New Activity"}
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g., Visit the Eiffel Tower"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} setDate={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      placeholder="Address or place name"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide details about this activity..."
                    className="resize-none min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="flex justify-between">
            {activity && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteActivityMutation.isPending}
              >
                {deleteActivityMutation.isPending
                  ? "Deleting..."
                  : "Delete Activity"}
              </Button>
            )}
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" ref={dialogCloseRef}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : activity
                    ? "Update Activity"
                    : "Add Activity"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
