"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import DestinationSearch from "@/components/pages/itineraries/destination-search";
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

// Helper to normalize date for comparison (strip time)
const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

// Get today's date normalized
const getTodayNormalized = (): Date => {
  return normalizeDate(new Date());
};

// Schema definition
const formSchema = z.object({
  destination: z.string().min(1, { message: "Destination is required" }),
  dateRange: z
    .object(
      {
        from: z.date({ required_error: "Start date is required" }),
        to: z.date().optional(),
      },
      { required_error: "Date range is required" }
    )
    .superRefine((data, ctx) => {
      const today = getTodayNormalized();
      const startDate = normalizeDate(data.from);

      if (startDate < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Date cannot be in the past. Please select a current or future date.",
          path: [],
        });
        return;
      }
    }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CreateItineraryForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      dateRange: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = (data: FormSchema) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-3xl">
        <Card className="rounded-2xl w-full border p-6 mb-8">
          {/* Destination Field */}
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Where to?</FormLabel>
                <FormControl>
                  <DestinationSearch />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Range Field */}
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  When are you traveling?
                </FormLabel>
                <FormControl>
                  <DatePickerWithRange
                    date={field.value}
                    setDate={field.onChange}
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
