"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DestinationCombobox } from "@/components/pages/itineraries/destination-combobox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  type ItineraryFormSchema,
  itineraryFormSchema,
} from "@/lib/schemas/itinerary";
import type { Place } from "@/server/api/routers/places";
import { api } from "@/trpc/react";

// The form submission data type with properly typed destination
type ItineraryFormData = {
  destination: Place; // Using the imported Place type
  dateRange: {
    from: Date;
    to?: Date;
  };
};

export default function CreateItineraryForm() {
  const router = useRouter();
  const createItinerary = api.itinerary.create.useMutation({
    onSuccess: (data) => {
      router.push(`/itineraries/${data.id}`);
      toast.success("Itinerary created", {
        description: "Your itinerary has been created",
      });
    },
    onError: (error) => {
      toast.error("Error creating itinerary", {
        description: error.message,
      });
    },
  });

  const form = useForm<ItineraryFormSchema>({
    resolver: zodResolver(itineraryFormSchema),
    defaultValues: {
      destination: undefined, // Use undefined instead of null for compatibility
      dateRange: undefined,
    } as unknown as ItineraryFormData, // Type assertion to resolve the type check issue
    mode: "onChange",
  });

  const onSubmit = (data: ItineraryFormSchema) => {
    // We can safely assert non-null because of the schema refinement
    const formData: ItineraryFormData = {
      destination: data.destination as Place,
      dateRange: data.dateRange,
    };

    console.log("Submitting to itinerary.createSimple:", formData);
    createItinerary.mutate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-3xl">
        <Card className="rounded-2xl w-full border p-6 mb-8">
          {/* Destination Field */}
          <FormField
            control={form.control}
            name="destination"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Where to?</FormLabel>
                <FormControl>
                  <DestinationCombobox
                    value={
                      field.value || null
                    } /* Ensure null is passed when undefined */
                    onChange={(place) => {
                      field.onChange(place);
                    }}
                    error={!!fieldState.error}
                    placeholder="Enter a city or popular destination"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Range Field */}
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  When are you traveling?
                </FormLabel>
                <FormControl>
                  <DatePickerWithRange
                    date={field.value}
                    setDate={field.onChange}
                    error={!!fieldState.error}
                    disablePastDates={true}
                    placeholder="Choose your travel dates"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            type="submit"
            size="lg"
            className="rounded-full group w-full sm:w-auto"
            disabled={createItinerary.isPending}
          >
            {createItinerary.isPending ? "Creating..." : "Start planning"}
            <ArrowRight className="transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
          </Button>

          <Button
            type="button"
            size="lg"
            variant="outline"
            className="rounded-full w-full sm:w-auto"
            disabled
          >
            <Sparkles />
            Generate with AI
          </Button>
        </div>
      </form>
    </Form>
  );
}
