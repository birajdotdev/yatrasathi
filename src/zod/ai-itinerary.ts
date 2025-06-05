import { z } from "zod";

// Schema for a single activity in the itinerary
export const activitySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .describe(
      "A concise, descriptive title for the activity (e.g., 'Visit Durbar Square', 'Sunrise Trek')"
    ),
  description: z
    .string()
    .min(1, "Description is required")
    .describe(
      "A detailed 2-3 sentence description of the activity, including what visitors will see or experience"
    ),
  location: z
    .string()
    .min(1, "Location is required")
    .describe(
      "The specific location where the activity takes place (e.g., landmark name, area, restaurant name)"
    ),
  startTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Start time must be in 24-hour format (HH:MM)"
    )
    .describe("The starting time of the activity in 24-hour format (HH:MM)"),
  endTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "End time must be in 24-hour format (HH:MM)"
    )
    .describe("The ending time of the activity in 24-hour format (HH:MM)"),
});

// Schema for a single day in the itinerary
export const daySchema = z.object({
  dayNumber: z
    .number()
    .int()
    .positive()
    .describe(
      "The sequential day number in the itinerary (1 for first day, 2 for second day, etc.)"
    ),
  date: z
    .union([
      z.date(),
      z.string().transform((str) => new Date(str)), // Handle ISO date strings
    ])
    .describe(
      "The calendar date for this day of the itinerary (YYYY-MM-DD format)"
    ),
  activities: z
    .array(activitySchema)
    .min(1, "At least one activity is required")
    .describe("A chronological list of 3-4 activities planned for this day"),
});

// Schema for the complete AI-generated itinerary
export const aiGeneratedItinerarySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .describe(
      "A catchy, descriptive title for the entire itinerary (e.g., 'Cultural Exploration of Kathmandu', 'Himalayan Adventure')"
    ),
  summary: z
    .string()
    .min(1, "Summary is required")
    .describe(
      "A 1-2 sentence overview of the entire itinerary, highlighting key experiences"
    ),
  days: z
    .array(daySchema)
    .min(1, "At least one day is required")
    .describe(
      "The day-by-day breakdown of the itinerary, ordered chronologically"
    ),
});

export type AIGeneratedActivity = z.infer<typeof activitySchema>;
export type AIGeneratedDay = z.infer<typeof daySchema>;
export type AIGeneratedItinerary = z.infer<typeof aiGeneratedItinerarySchema>;
