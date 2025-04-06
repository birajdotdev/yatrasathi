import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "@/server/db/schema-helpers";

import { users } from "./user";

// Main itinerary table
export const itineraries = pgTable(
  "itinerary",
  {
    id,
    title: text("title").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),

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
    index("itinerary_title_idx").on(itinerary.title),
    index("itinerary_date_idx").on(itinerary.startDate, itinerary.endDate),
  ]
);

// Destinations table
export const destinations = pgTable("destination", {
  id,
  itineraryId: uuid("itinerary_id")
    .notNull()
    .references(() => itineraries.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  address: text("address").notNull(),
  image: text("image").notNull(),
  createdAt,
  updatedAt,
});

// Days table
export const days = pgTable("day", {
  id,
  itineraryId: uuid("itinerary_id")
    .notNull()
    .references(() => itineraries.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  createdAt,
  updatedAt,
});

// Activities table
export const activities = pgTable(
  "activity",
  {
    id,
    dayId: uuid("day_id")
      .notNull()
      .references(() => days.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    location: text("location").notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    image: text("image").notNull(),
    createdAt,
    updatedAt,
  },
  (activity) => [index("activity_day_idx").on(activity.dayId)]
);

// Relations
export const itineraryRelations = relations(itineraries, ({ many, one }) => ({
  destination: one(destinations),
  days: many(days),
  createdBy: one(users, {
    fields: [itineraries.createdById],
    references: [users.id],
  }),
}));

export const destinationRelations = relations(destinations, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [destinations.itineraryId],
    references: [itineraries.id],
  }),
}));

export const dayRelations = relations(days, ({ one, many }) => ({
  itinerary: one(itineraries, {
    fields: [days.itineraryId],
    references: [itineraries.id],
  }),
  activities: many(activities),
}));

export const activityRelations = relations(activities, ({ one }) => ({
  day: one(days, {
    fields: [activities.dayId],
    references: [days.id],
  }),
}));
