import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./user";

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  excerpt: text("excerpt"),
  authorId: text("author_id").notNull(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogRelations = relations(blogs, ({ one, many }) => ({
  author: one(users, {
    fields: [blogs.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
}));

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  blogId: integer("blog_id").notNull(),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commentRelations = relations(comments, ({ one }) => ({
  blog: one(blogs, {
    fields: [comments.blogId],
    references: [blogs.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
}));

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  blogId: integer("blog_id").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const likeRelations = relations(likes, ({ one }) => ({
  blog: one(blogs, {
    fields: [likes.blogId],
    references: [blogs.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertBlogSchema = createInsertSchema(blogs);
export const selectBlogSchema = createSelectSchema(blogs);
export const insertCommentSchema = createInsertSchema(comments);
export const insertLikeSchema = createInsertSchema(likes);

// Blog form schema (for client-side validation)
export const blogFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  excerpt: z.string().max(200).optional(),
  featuredImage: z.string().url().optional().nullable(),
  isPublished: z.boolean().default(false),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
