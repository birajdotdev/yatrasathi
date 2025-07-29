import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { categoryValues } from "@/const/blog";
import { createdAt, id, updatedAt } from "@/server/db/schema-helpers";

import { users } from "./user";

// Post status enum
export const postStatusValues = ["draft", "published"] as const;
export type PostStatus = (typeof postStatusValues)[number];
export const postStatusEnum = pgEnum("post_status", postStatusValues);

// Category enum - using imported values
export const categoryEnum = pgEnum("category_type", categoryValues);

// Re-export type for convenience
export type { CategoryType } from "@/const/blog";

// Posts table
export const posts = pgTable(
  "post",
  {
    id,
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: jsonb("content").notNull(),
    excerpt: text("excerpt"),
    featuredImage: text("featured_image").default(
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ),
    status: postStatusEnum("status").notNull().default("draft"),
    category: categoryEnum("category").default("other"),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id),
    createdAt,
    updatedAt,
  },
  (post) => [
    index("post_slug_idx").on(post.slug),
    index("post_author_idx").on(post.authorId),
    index("post_category_idx").on(post.category),
    index("post_status_idx").on(post.status),
  ]
);

// Comments table
export const comments = pgTable(
  "comment",
  {
    id,
    content: text("content").notNull(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id),
    createdAt,
    updatedAt,
  },
  (comment) => [
    index("comment_post_idx").on(comment.postId),
    index("comment_author_idx").on(comment.authorId),
  ]
);

// Likes table
export const likes = pgTable(
  "like",
  {
    id,
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    createdAt,
  },
  (like) => [
    index("like_post_idx").on(like.postId),
    index("like_user_idx").on(like.userId),
    // Ensure a user can only like a post once
    unique().on(like.postId, like.userId),
  ]
);

// Relations
export const postRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
}));

export const commentRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
}));

export const likeRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));
