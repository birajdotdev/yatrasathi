import { currentUser } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { reminderPreferences, users } from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  getReminderPreferences: protectedProcedure.query(async ({ ctx }) => {
    // Get the current user's database ID from the session
    const userId = ctx.user.id;

    // Look up the user's reminder preferences
    const preferences = await ctx.db.query.reminderPreferences.findFirst({
      where: eq(reminderPreferences.userId, userId),
    });

    // Return the preferences or default values if none exist
    return (
      preferences ?? {
        optOut: false,
        daysBefore: 7,
      }
    );
  }),

  updateReminderPreferences: protectedProcedure
    .input(
      z.object({
        optOut: z.boolean(),
        daysBefore: z.number().int().min(1).max(30),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Check if preferences already exist
      const existing = await ctx.db.query.reminderPreferences.findFirst({
        where: eq(reminderPreferences.userId, userId),
      });

      if (existing) {
        // Update existing preferences
        const [updated] = await ctx.db
          .update(reminderPreferences)
          .set({
            optOut: input.optOut,
            daysBefore: input.daysBefore,
            updatedAt: new Date(),
          })
          .where(eq(reminderPreferences.userId, userId))
          .returning();

        return updated;
      } else {
        // Create new preferences
        const [created] = await ctx.db
          .insert(reminderPreferences)
          .values({
            userId: userId,
            optOut: input.optOut,
            daysBefore: input.daysBefore,
          })
          .returning();

        return created;
      }
    }),

  // Get user by id
  getUserById: publicProcedure
    .input(createSelectSchema(users).pick({ id: true }))
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, input.id),
        });
        return user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get user by id",
          cause: error,
        });
      }
    }),

  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  getUserStats: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    const clerkUser = await currentUser();

    // Get first name only
    const firstName = user.name.split(" ")[0];

    // Count upcoming trips (startDate strictly in the future)
    const now = new Date();
    const upcomingTrips = await ctx.db.query.itineraries.findMany({
      where: (itinerary, { and, gt }) =>
        and(eq(itinerary.createdById, user.id), gt(itinerary.startDate, now)),
    });
    const upcomingTripsCount = upcomingTrips.length;

    // Find next trip (soonest startDate in the future)
    let nextTripDays: string | null = null;
    if (upcomingTrips.length > 0) {
      const nextTrip = upcomingTrips.reduce((min, curr) =>
        curr.startDate < min.startDate ? curr : min
      );
      const diffDays = Math.ceil(
        (nextTrip.startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      nextTripDays = `${diffDays}d`;
    }

    // Count blog posts
    const blogPosts = await ctx.db.query.posts.findMany({
      where: (post) => eq(post.authorId, user.id),
    });
    const blogPostsCount = blogPosts.length;

    // Clerk first login logic
    const isFirstLogIn =
      !!clerkUser?.createdAt &&
      !!clerkUser?.lastSignInAt &&
      Math.abs(
        new Date(clerkUser.createdAt).getTime() -
          new Date(clerkUser.lastSignInAt).getTime()
      ) <
        60 * 1000;
    return {
      firstName,
      isFirstLogIn,
      upcomingTripsCount,
      blogPostsCount,
      nextTripDays,
    };
  }),
});
