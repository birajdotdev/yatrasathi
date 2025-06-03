import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "@/server/db/schema-helpers";

import { reminderLogs, reminderPreferences } from "./reminder";

export const userRoles = ["admin", "user"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_role", userRoles);

export const users = pgTable(
  "user",
  {
    id,
    clerkUserId: text().notNull().unique(),
    name: text().notNull(),
    email: text().notNull(),
    role: userRoleEnum().notNull().default("user"),
    image: text().notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [uniqueIndex("clerk_user_id_idx").on(t.clerkUserId)]
);

export const userRelations = relations(users, ({ one, many }) => ({
  reminderPreference: one(reminderPreferences),
  reminderLogs: many(reminderLogs),
}));
