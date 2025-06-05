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
import type { Place } from "@/server/api/routers/places";
import { api } from "@/trpc/react";
import { type ItineraryFormSchema, itineraryFormSchema } from "@/zod/itinerary";

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

  // Create itinerary mutation
  const createItinerary = api.itinerary.create.useMutation({
    onMutate: () => {
      toast.loading("Creating your itinerary", {
        description: "You'll be redirected to your itinerary shortly...",
      });
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Itinerary created", {
        description: "Your itinerary has been created",
      });
      router.push(`/itineraries/${data.id}`);
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error creating itinerary", {
        description: error.message,
      });
    },
  });

  // Generate with AI mutation
  const generateWithAI = api.itinerary.generateWithAI.useMutation({
    onMutate: () => {
      toast.loading("Generating your itinerary", {
        description: "This may take up to a minute...",
      });
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("AI Itinerary generated", {
        description: "Your AI-powered itinerary has been created",
      });
      router.push(`/itineraries/${data.id}`);
    },
    onError: (error) => {
      toast.dismiss();
      // If the error is a usage limit (FORBIDDEN), show upgrade toast
      if (error.data?.code === "FORBIDDEN") {
        toast.error("Daily AI usage limit reached", {
          description: "Upgrade to Pro for unlimited access.",
          action: {
            label: "Upgrade",
            onClick: () => router.push("/subscription"),
          },
        });
      } else {
        toast.error("Error generating itinerary with AI", {
          description: error.message,
        });
      }
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

    createItinerary.mutate(formData);
  };

  const isButtonDisabled =
    createItinerary.isPending ||
    generateWithAI.isPending ||
    !form.formState.isValid;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-3xl">
        <Card className="mb-8 w-full rounded-2xl border p-6">
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
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            type="submit"
            size="lg"
            className="group w-full rounded-full sm:w-auto"
            disabled={isButtonDisabled}
          >
            Start planning
            <ArrowRight className="transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
          </Button>

          <Button
            type="button"
            size="lg"
            variant="outline"
            className="w-full rounded-full sm:w-auto"
            disabled={isButtonDisabled}
            onClick={() => {
              // Get form data
              const formData = form.getValues();
              generateWithAI.mutate(formData as ItineraryFormData);
            }}
          >
            <Sparkles />
            Generate with AI
          </Button>
        </div>
      </form>
    </Form>
  );
}
