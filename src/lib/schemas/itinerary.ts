import { z } from "zod";

// Define a Place zod schema that matches the Place type
export const placeSchema = z.object(
  {
    name: z.string(),
    address: z.string(),
  },
  { required_error: "Please select a destination for your trip" }
);

// Schema definition
export const itineraryFormSchema = z.object({
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

export type ItineraryFormSchema = z.infer<typeof itineraryFormSchema>;
