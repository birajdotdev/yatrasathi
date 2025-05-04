import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { reminderPreferences, users } from "@/server/db/schema";

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
      try {
        const [deletedUser] = await ctx.db
          .delete(users)
          .where(eq(users.clerkUserId, input.clerkUserId))
          .returning();

        if (!deletedUser) {
          throw new Error("User not found or already deleted");
        }

        return deletedUser;
      } catch (error) {
        throw new Error(
          `Failed to delete user: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
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
});
