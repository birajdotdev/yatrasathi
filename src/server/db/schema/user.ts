import { pgEnum, pgTable, text } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "@/server/db/schema-helpers";

export const userRoles = ["admin", "user"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_role", userRoles);

export const users = pgTable("user", {
  id,
  clerkUserId: text().notNull().unique(),
  name: text().notNull(),
  email: text().notNull(),
  role: userRoleEnum().notNull().default("user"),
  image: text(),
  createdAt,
  updatedAt,
});
