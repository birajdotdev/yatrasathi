"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

// Define a Place zod schema that matches the Place type
const placeSchema = z.object(
  {
    id: z.string(),
    name: z.string(),
    address: z.string(),
    subcategory: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    state: z.string().optional(),
    country: z.string().optional(),
  },
  { required_error: "Please select a destination for your trip" }
);

// Schema definition
const formSchema = z.object({
  destination: placeSchema.nullable().refine((val) => val !== null, {
    message: "Please select a destination for your trip",
  }),
  dateRange: z.object(
    {
      from: z.date({ required_error: "Start date is required" }),
      to: z.date().optional(),
    },
    { required_error: "Please select your travel dates" }
  ),
});

// Use the inferred type from the schema
type FormSchema = z.infer<typeof formSchema>;

// The form submission data type with properly typed destination
type ItineraryFormData = {
  destination: Place; // Using the imported Place type
  dateRange: {
    from: Date;
    to?: Date;
  };
};

export default function CreateItineraryForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: undefined, // Use undefined instead of null for compatibility
      dateRange: undefined,
    } as unknown as FormSchema, // Type assertion to resolve the type check issue
    mode: "onChange",
  });

  const onSubmit = (data: FormSchema) => {
    // We can safely assert non-null because of the schema refinement
    const formData: ItineraryFormData = {
      destination: data.destination as Place,
      dateRange: data.dateRange,
    };

    console.log("Submitting complete destination data:", formData);
    // Now you have the full Place object with all the necessary data
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
          >
            Start planning
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
