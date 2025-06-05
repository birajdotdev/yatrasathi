import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "@/server/db/schema-helpers";

import { itineraries } from "./itinerary";
import { users } from "./user";

// Reminder preferences table
export const reminderPreferences = pgTable(
  "reminder_preference",
  {
    id,
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    optOut: boolean("opt_out").notNull().default(false),
    daysBefore: integer("days_before").notNull().default(7),
    createdAt,
    updatedAt,
  },
  (reminderPreference) => [
    index("reminder_preference_user_idx").on(reminderPreference.userId),
  ]
);

// Reminder logs table
export const reminderLogs = pgTable(
  "reminder_log",
  {
    id,
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itineraryId: uuid("itinerary_id")
      .notNull()
      .references(() => itineraries.id, { onDelete: "cascade" }),
    sentAt: timestamp("sent_at").notNull(),
    emailId: text("email_id"),
    status: text("status").notNull(), // "sent", "failed", etc.
    createdAt,
  },
  (reminderLog) => [
    index("reminder_log_user_idx").on(reminderLog.userId),
    index("reminder_log_itinerary_idx").on(reminderLog.itineraryId),
  ]
);

// Relations
export const reminderPreferenceRelations = relations(
  reminderPreferences,
  ({ one }) => ({
    user: one(users, {
      fields: [reminderPreferences.userId],
      references: [users.id],
    }),
  })
);

export const reminderLogRelations = relations(reminderLogs, ({ one }) => ({
  user: one(users, {
    fields: [reminderLogs.userId],
    references: [users.id],
  }),
  itinerary: one(itineraries, {
    fields: [reminderLogs.itineraryId],
    references: [itineraries.id],
  }),
}));
