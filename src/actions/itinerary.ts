"use server";

import { z } from "zod";

const createItinerarySchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  location: z.string(),
  budget: z.string(),
  numberOfPeople: z.string(),
});

export async function createItinerary(
  data: z.infer<typeof createItinerarySchema>
) {
  // Add your database logic here
  // Example: await db.itinerary.create({ data })
  return data;
}
