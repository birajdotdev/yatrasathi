import { date, integer, pgTable, uuid } from "drizzle-orm/pg-core";

import { users } from "./user";

export const aiUsage = pgTable("ai_usage", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  date: date("date").notNull(),
  count: integer("count").notNull().default(0),
});
