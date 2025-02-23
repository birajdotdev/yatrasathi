import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import {
  accommodations,
  activities,
  destinations,
  itineraries,
  transportation,
  transportationModeEnum,
  tripTypeEnum,
} from "@/server/db/schema/itinerary";

// Export enums for use in components
export const tripTypes = tripTypeEnum.enumValues;
export const transportationModes = transportationModeEnum.enumValues;

// Generate base schemas from Drizzle tables
const baseDestinationSchema = createInsertSchema(destinations, {
  arrivalDateTime: z.coerce.date(),
  departureDateTime: z.coerce.date(),
  notes: z.string().nullable().optional(),
});

const baseTransportationSchema = createInsertSchema(transportation, {
  departureDateTime: z.coerce.date(),
  arrivalDateTime: z.coerce.date(),
  bookingReference: z.string().nullable().optional(),
  attachments: z.array(z.string()).nullable().optional(),
});

const baseAccommodationSchema = createInsertSchema(accommodations, {
  checkInDateTime: z.coerce.date(),
  checkOutDateTime: z.coerce.date(),
  confirmationNumber: z.string().nullable().optional(),
});

const baseActivitySchema = createInsertSchema(activities, {
  dateTime: z.coerce.date(),
  notes: z.string().nullable().optional(),
  attachments: z.array(z.string()).nullable().optional(),
});

// Remove auto-generated fields and add specific validations
export const destinationSchema = baseDestinationSchema
  .omit({
    id: true,
    itineraryId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    location: z.string().min(2, "Location is required"),
  });

export const transportationSchema = baseTransportationSchema.omit({
  id: true,
  itineraryId: true,
  createdAt: true,
  updatedAt: true,
});

export const accommodationSchema = baseAccommodationSchema
  .omit({
    id: true,
    itineraryId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    name: z.string().min(2, "Accommodation name is required"),
    address: z.string().min(2, "Address is required"),
  });

export const activitySchema = baseActivitySchema
  .omit({
    id: true,
    itineraryId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    name: z.string().min(2, "Activity name is required"),
    location: z.string().min(2, "Location is required"),
  });

// Main itinerary form schema
const baseItinerarySchema = createInsertSchema(itineraries, {
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  coverImage: z.string().nullable().optional(),
  generalNotes: z.string().nullable().optional(),
  attachments: z.array(z.string()).nullable().optional(),
});

export const itineraryFormSchema = baseItinerarySchema
  .omit({
    id: true,
    createdById: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    tripTitle: z.string().min(3, "Trip title must be at least 3 characters"),
    destinations: z.array(destinationSchema),
    transportation: z.array(transportationSchema),
    accommodations: z.array(accommodationSchema),
    activities: z.array(activitySchema),
  });

export type ItineraryFormValues = z.infer<typeof itineraryFormSchema>;
