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
import { comments, likes, posts } from "@/server/db/schema/blog";
import { itineraries } from "@/server/db/schema/itinerary";

const userSchema = createSelectSchema(users);
const userCreateSchema = userSchema.omit({
  id: true,
  role: true,
  updatedAt: true,
  createdAt: true,
});
const userUpdateSchema = userCreateSchema
  .partial()
  .required({ clerkUserId: true });

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(userCreateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const [newUser] = await ctx.db
          .insert(users)
          .values(input)
          .returning()
          .onConflictDoUpdate({
            target: [users.clerkUserId],
            set: input,
          });

        if (!newUser) {
          throw new Error(
            "User creation failed - no user returned from database"
          );
        }

        return newUser;
      } catch (error) {
        throw new Error(
          `Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  update: publicProcedure
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      if (Object.keys(input).length === 0) {
        throw new Error("At least one field must be provided for update");
      }

      try {
        const [updatedUser] = await ctx.db
          .update(users)
          .set(input)
          .where(eq(users.clerkUserId, input.clerkUserId))
          .returning();

        if (!updatedUser) {
          throw new Error("User not found or update failed");
        }

        return updatedUser;
      } catch (error) {
        throw new Error(
          `Failed to update user: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  delete: publicProcedure
    .input(userSchema.pick({ clerkUserId: true }))
    .mutation(async ({ ctx, input }) => {
      // Find the user by clerkUserId to get the internal user id
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.clerkUserId, input.clerkUserId),
      });
      if (!user) {
        throw new Error("User not found");
      }
      const userId = user.id;
      // Use a transaction to ensure all deletions succeed or fail together
      const deletedUser = await ctx.db.transaction(async (trx) => {
        // Delete likes
        await trx.delete(likes).where(eq(likes.userId, userId));
        // Delete comments
        await trx.delete(comments).where(eq(comments.authorId, userId));
        // Delete posts
        await trx.delete(posts).where(eq(posts.authorId, userId));
        // Delete itineraries
        await trx
          .delete(itineraries)
          .where(eq(itineraries.createdById, userId));
        // reminderPreferences and reminderLogs are handled by DB cascade
        // Finally, delete the user
        const [deleted] = await trx
          .delete(users)
          .where(eq(users.id, userId))
          .returning();
        if (!deleted) {
          throw new Error("User not found or already deleted");
        }
        return deleted;
      });
      return deletedUser;
    }),

  getReminderPreferences: protectedProcedure.query(async ({ ctx }) => {
    // Get the current user's database ID from the session
    const userId = ctx.session.user.dbId;

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
      const userId = ctx.session.user.dbId;

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
    .input(z.object({ id: z.string() }))
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
    try {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.dbId),
      });
      return user;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get current user",
        cause: error,
      });
    }
  }),

  getUserStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.dbId;
    const clerkUser = await currentUser();

    // Get user info
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user)
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

    // Get first name only
    const firstName = user.name.split(" ")[0];

    // Count upcoming trips (startDate strictly in the future)
    const now = new Date();
    const upcomingTrips = await ctx.db.query.itineraries.findMany({
      where: (itinerary, { and, gt }) =>
        and(eq(itinerary.createdById, userId), gt(itinerary.startDate, now)),
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
      where: (post) => eq(post.authorId, userId),
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
