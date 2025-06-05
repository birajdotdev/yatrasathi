import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { createdAt } from "@/server/db/schema-helpers";

import { comments, posts } from "./blog";
import { users } from "./user";

export const notifications = pgTable(
  "notification",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // e.g., "like", "comment"
    postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
    commentId: uuid("comment_id").references(() => comments.id, {
      onDelete: "cascade",
    }),
    fromUserId: text("from_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    read: boolean("read").notNull().default(false),
    createdAt,
  },
  (notification) => [
    index("notification_user_idx").on(notification.userId),
    index("notification_post_idx").on(notification.postId),
    index("notification_read_idx").on(notification.read),
  ]
);

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  fromUser: one(users, {
    fields: [notifications.fromUserId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [notifications.postId],
    references: [posts.id],
  }),
  comment: one(comments, {
    fields: [notifications.commentId],
    references: [comments.id],
  }),
}));
