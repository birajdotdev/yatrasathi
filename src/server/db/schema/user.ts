import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "../schema-helpers";
import { reminderLogs, reminderPreferences } from "./reminder";

export const userRoles = ["admin", "user"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_role", userRoles);

// export const users = pgTable("user", {
//   id,
//   clerkUserId: text().notNull().unique(),
//   name: text().notNull(),
//   email: text().notNull(),
//   role: userRoleEnum().notNull().default("user"),
//   image: text(),
//   createdAt,
//   updatedAt,
// });

export const users = pgTable("user", {
  id,
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt,
  updatedAt,
});

export const userRelations = relations(users, ({ one, many }) => ({
  reminderPreference: one(reminderPreferences),
  reminderLogs: many(reminderLogs),
}));
