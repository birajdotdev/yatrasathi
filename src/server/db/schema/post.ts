import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "@/server/db/schema-helpers";

import { users } from "./user";

export const posts = pgTable(
  "post",
  {
    id,
    name: varchar("name", { length: 256 }),
    createdById: uuid()
      .notNull()
      .references(() => users.id),
    createdAt,
    updatedAt,
  },
  (example) => [
    index("created_by_idx").on(example.createdById),
    index("name_idx").on(example.name),
  ]
);
