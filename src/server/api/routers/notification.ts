import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { posts } from "@/server/db/schema/blog";
import { notifications } from "@/server/db/schema/notification";
import { users } from "@/server/db/schema/user";

export const notificationRouter = createTRPCRouter({
  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.dbId;
    // Join notifications with fromUser and post, include postSlug
    const result = await ctx.db
      .select({
        id: notifications.id,
        type: notifications.type,
        read: notifications.read,
        createdAt: notifications.createdAt,
        fromUser: {
          name: users.name,
          image: users.image,
        },
        target: posts.title,
        postSlug: posts.slug,
      })
      .from(notifications)
      .leftJoin(users, eq(notifications.fromUserId, users.id))
      .leftJoin(posts, eq(notifications.postId, posts.id))
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
    return result;
  }),
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.dbId;
    await ctx.db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, userId));
    return { success: true };
  }),
  markAsRead: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(notifications)
        .set({ read: true })
        .where(eq(notifications.id, input.id));
      return { success: true };
    }),
});
