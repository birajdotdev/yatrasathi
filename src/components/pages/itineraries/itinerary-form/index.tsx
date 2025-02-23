"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  type ItineraryFormValues,
  itineraryFormSchema,
} from "@/lib/schemas/itinerary";
import { api } from "@/trpc/react";

import { Accommodations } from "./accommodations";
import { Activities } from "./activities";
import { Destinations } from "./destinations";
import { Notes } from "./notes";
import { Transportation } from "./transportation";
import { TripOverview } from "./trip-overview";

type ItineraryFormProps = {
  mode?: "create" | "update";
  itineraryId?: string;
  defaultValues?: ItineraryFormValues;
};

export default function ItineraryForm({
  mode = "create",
  itineraryId,
  defaultValues,
}: ItineraryFormProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const form = useForm<ItineraryFormValues>({
    resolver: zodResolver(itineraryFormSchema),
    defaultValues: defaultValues ?? {
      tripTitle: "",
      tripType: "Vacation",
      startDate: new Date(),
      endDate: new Date(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      destinations: [],
      transportation: [],
      accommodations: [],
      activities: [],
      attachments: [],
      coverImage: "",
      generalNotes: "",
    },
  });

  // Create mutation
  const createMutation = api.itinerary.create.useMutation({
    onSuccess: (itinerary) => {
      toast.success("Itinerary created successfully!");
      void utils.itinerary.getAll.invalidate();
      router.push(`/itineraries/${itinerary.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Update mutation
  const updateMutation = api.itinerary.update.useMutation({
    onSuccess: (itinerary) => {
      toast.success("Itinerary updated successfully!");
      void utils.itinerary.getAll.invalidate();
      void utils.itinerary.getById.invalidate({ id: itinerary.id });
      router.push(`/itineraries/${itinerary.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(data: ItineraryFormValues) {
    if (mode === "create") {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({
        id: itineraryId!,
        data,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <TripOverview control={form.control} />
        <Destinations control={form.control} />
        <Transportation control={form.control} />
        <Accommodations control={form.control} />
        <Activities control={form.control} />
        <Notes control={form.control} />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/itineraries")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <span>Saving...</span>
            ) : mode === "create" ? (
              "Create Itinerary"
            ) : (
              "Update Itinerary"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
