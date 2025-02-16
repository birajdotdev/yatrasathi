import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "@/server/db/schema-helpers";

import { users } from "./user";

// Enums
export const tripTypeEnum = pgEnum("trip_type", [
  "Vacation",
  "Business",
  "Family",
  "Adventure",
  "Road Trip",
  "Educational",
  "Other",
]);

export const transportationModeEnum = pgEnum("transportation_mode", [
  "Flight",
  "Train",
  "Car",
  "Bus",
  "Ferry",
  "Other",
]);

// Main itinerary table
export const itineraries = pgTable(
  "itinerary",
  {
    id,
    // Trip Overview
    tripTitle: text("trip_title").notNull(),
    tripType: tripTypeEnum("trip_type").notNull(),
    coverImage: text("cover_image").default(
      "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg"
    ),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    timeZone: text("time_zone").notNull(),

    // Notes & Attachments
    generalNotes: text("general_notes"),
    attachments: jsonb("attachments").$type<string[]>(),

    // Relations
    createdById: uuid("created_by_id")
      .notNull()
      .references(() => users.id),

    // Timestamps
    createdAt,
    updatedAt,
  },
  (itinerary) => [
    index("itinerary_created_by_idx").on(itinerary.createdById),
    index("itinerary_trip_title_idx").on(itinerary.tripTitle),
    index("itinerary_date_idx").on(itinerary.startDate, itinerary.endDate),
  ]
);

// Destinations table
export const destinations = pgTable("destination", {
  id,
  itineraryId: uuid("itinerary_id")
    .notNull()
    .references(() => itineraries.id, { onDelete: "cascade" }),
  location: text("location").notNull(),
  arrivalDateTime: timestamp("arrival_date_time").notNull(),
  departureDateTime: timestamp("departure_date_time").notNull(),
  notes: text("notes"),
  createdAt,
  updatedAt,
});

// Transportation table
export const transportation = pgTable("transportation", {
  id,
  itineraryId: uuid("itinerary_id")
    .notNull()
    .references(() => itineraries.id, { onDelete: "cascade" }),
  mode: transportationModeEnum("mode").notNull(),
  departureDateTime: timestamp("departure_date_time").notNull(),
  arrivalDateTime: timestamp("arrival_date_time").notNull(),
  bookingReference: text("booking_reference"),
  attachments: jsonb("attachments").$type<string[]>(),
  createdAt,
  updatedAt,
});

// Accommodations table
export const accommodations = pgTable("accommodation", {
  id,
  itineraryId: uuid("itinerary_id")
    .notNull()
    .references(() => itineraries.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  checkInDateTime: timestamp("check_in_date_time").notNull(),
  checkOutDateTime: timestamp("check_out_date_time").notNull(),
  address: text("address").notNull(),
  confirmationNumber: text("confirmation_number"),
  createdAt,
  updatedAt,
});

// Activities table
export const activities = pgTable("activity", {
  id,
  itineraryId: uuid("itinerary_id")
    .notNull()
    .references(() => itineraries.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  dateTime: timestamp("date_time").notNull(),
  location: text("location").notNull(),
  notes: text("notes"),
  attachments: jsonb("attachments").$type<string[]>(),
  createdAt,
  updatedAt,
});

// Relations
export const itineraryRelations = relations(itineraries, ({ many, one }) => ({
  destinations: many(destinations),
  transportation: many(transportation),
  accommodations: many(accommodations),
  activities: many(activities),
  createdBy: one(users, {
    fields: [itineraries.createdById],
    references: [users.id],
  }),
}));

// Add relation declarations for each related table
export const destinationRelations = relations(destinations, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [destinations.itineraryId],
    references: [itineraries.id],
  }),
}));

export const transportationRelations = relations(transportation, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [transportation.itineraryId],
    references: [itineraries.id],
  }),
}));

export const accommodationRelations = relations(accommodations, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [accommodations.itineraryId],
    references: [itineraries.id],
  }),
}));

export const activityRelations = relations(activities, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [activities.itineraryId],
    references: [itineraries.id],
  }),
}));
