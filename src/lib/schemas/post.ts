import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { posts } from "@/server/db/schema/blog";

import { blockNoteDocumentSchema } from "./blocknote";

// Insert schema for creating a post
export const postInsertSchema = createInsertSchema(posts, {
  title: (schema) => schema.min(1),
  content: () => blockNoteDocumentSchema.min(1),
});

// Update schema for updating a post
export const postUpdateSchema = createUpdateSchema(posts, {
  title: (schema) => schema.min(1).optional(),
  content: () => blockNoteDocumentSchema.optional(),
});
