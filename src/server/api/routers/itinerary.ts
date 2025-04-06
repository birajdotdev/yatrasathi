import { TRPCError } from "@trpc/server";
import { and, eq, gt, lt } from "drizzle-orm";
import { z } from "zod";

import { fetchImageFromUnsplash } from "@/lib/image-utils";
import { itineraryFormSchema } from "@/lib/schemas/itinerary";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  activities,
  days,
  destinations,
  itineraries,
} from "@/server/db/schema/itinerary";

// Activity schema for validation
const activityInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  date: z.date({ required_error: "Date is required" }),
  image: z.string().optional(),
});

// Schema for updating an activity
const updateActivitySchema = z.object({
  activityId: z.string(),
  data: activityInputSchema,
});

export const itineraryRouter = createTRPCRouter({
  // Create simple itinerary from the initial form
  create: protectedProcedure
    .input(itineraryFormSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // Generate a title based on the destination name
        const title = `Trip to ${input.destination.name}`;

        // Fetch an image for the destination using our utility function
        const imageResult = await fetchImageFromUnsplash({
          query: input.destination.name,
          count: 1,
          orientation: "landscape",
        });

        // Create the main itinerary
        const [itinerary] = await tx
          .insert(itineraries)
          .values({
            title: title,
            startDate: input.dateRange.from,
            endDate: input.dateRange.to ?? null,
            createdById: ctx.session.user.dbId,
          })
          .returning();

        if (!itinerary) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create itinerary",
          });
        }

        // Create the destination
        const [destination] = await tx
          .insert(destinations)
          .values({
            itineraryId: itinerary.id,
            name: input.destination.name,
            address: input.destination.address,
            image: imageResult.url,
          })
          .returning();

        // Create days between start and end date
        const startDate = new Date(input.dateRange.from);
        const endDate = input.dateRange.to
          ? new Date(input.dateRange.to)
          : new Date(input.dateRange.from);

        // Calculate the number of days
        const daysCount =
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;

        // Create day entries
        for (let i = 0; i < daysCount; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);

          await tx.insert(days).values({
            itineraryId: itinerary.id,
            date: date,
          });
        }

        return {
          id: itinerary.id,
          title: itinerary.title,
          destination: destination,
        };
      });
    }),

  // Get itinerary by id
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      // Get the itinerary with basic information
      const itinerary = await ctx.db.query.itineraries.findFirst({
        where: eq(itineraries.id, input),
      });

      if (!itinerary) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Itinerary not found",
        });
      }

      // Get the destination
      const destination = await ctx.db.query.destinations.findFirst({
        where: eq(destinations.itineraryId, input),
      });

      if (!destination) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Destination not found for this itinerary",
        });
      }

      // Get all days for this itinerary, ordered by date
      const daysResult = await ctx.db.query.days.findMany({
        where: eq(days.itineraryId, input),
        orderBy: (days, { asc }) => [asc(days.date)],
      });

      // Get activities for each day
      const daysWithActivities = await Promise.all(
        daysResult.map(async (day) => {
          const dayActivities = await ctx.db.query.activities.findMany({
            where: eq(activities.dayId, day.id),
            orderBy: (activities, { asc }) => [asc(activities.startTime)],
          });

          return {
            ...day,
            activities: dayActivities,
          };
        })
      );

      // Format the response according to the itinerary.ts format
      return {
        id: itinerary.id,
        title: itinerary.title,
        destination: {
          id: destination.id,
          name: destination.name,
          address: destination.address,
          image: destination.image,
        },
        startDate: itinerary.startDate,
        endDate: itinerary.endDate,
        days: daysWithActivities.map((day) => ({
          date: day.date,
          activities: day.activities.map((activity) => ({
            id: activity.id,
            title: activity.title,
            description: activity.description,
            location: activity.location,
            startTime: activity.startTime,
            endTime: activity.endTime,
            image: activity.image,
          })),
        })),
      };
    }),

  // Get all itineraries for the current user
  getAll: protectedProcedure
    .input(z.enum(["all", "upcoming", "past"]).default("all"))
    .query(async ({ ctx, input }) => {
      const baseQuery = {
        where: eq(itineraries.createdById, ctx.session.user.dbId),
      };

      let itinerariesResult;

      switch (input) {
        case "upcoming":
          itinerariesResult = await ctx.db.query.itineraries.findMany({
            ...baseQuery,
            where: and(baseQuery.where, gt(itineraries.startDate, new Date())),
            orderBy: (itineraries, { asc }) => [asc(itineraries.startDate)],
          });
          break;
        case "past":
          itinerariesResult = await ctx.db.query.itineraries.findMany({
            ...baseQuery,
            where: and(baseQuery.where, lt(itineraries.endDate, new Date())),
            orderBy: (itineraries, { desc }) => [desc(itineraries.endDate)],
          });
          break;
        default: // 'all'
          itinerariesResult = await ctx.db.query.itineraries.findMany({
            ...baseQuery,
            orderBy: (itineraries, { desc }) => [desc(itineraries.createdAt)],
          });
      }

      // Fetch destinations for each itinerary to get the image
      const itinerariesWithCover = await Promise.all(
        itinerariesResult.map(async (itinerary) => {
          const destination = await ctx.db.query.destinations.findFirst({
            where: eq(destinations.itineraryId, itinerary.id),
            columns: {
              image: true,
            },
          });

          return {
            ...itinerary,
            coverImage: destination?.image ?? null,
          };
        })
      );

      return itinerariesWithCover;
    }),

  // Create a new activity
  createActivity: protectedProcedure
    .input(activityInputSchema)
    .mutation(async ({ ctx, input }) => {
      // Find the day entry based on the date
      const day = await ctx.db.query.days.findFirst({
        where: eq(days.date, input.date),
      });

      if (!day) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Day not found for the specified date",
        });
      }

      // Check if user has permission to add to this itinerary
      const itinerary = await ctx.db.query.itineraries.findFirst({
        where: eq(itineraries.id, day.itineraryId),
      });

      if (!itinerary || itinerary.createdById !== ctx.session.user.dbId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to add activities to this itinerary",
        });
      }

      // Fetch an image if not provided
      let imageUrl = input.image;
      if (!imageUrl) {
        try {
          const imageResult = await fetchImageFromUnsplash({
            query: input.title,
            count: 1,
            orientation: "landscape",
          });
          imageUrl = imageResult.url;
        } catch (error) {
          // If image fetch fails, use a default or continue without an image
          console.error("Failed to fetch image for activity:", error);
          imageUrl = ""; // Default empty string or could use a placeholder image
        }
      }

      // Create the activity
      const [activity] = await ctx.db
        .insert(activities)
        .values({
          dayId: day.id,
          title: input.title,
          description: input.description,
          location: input.location,
          startTime: input.startTime,
          endTime: input.endTime,
          image: imageUrl ?? "",
        })
        .returning();

      if (!activity) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create activity",
        });
      }

      return activity;
    }),

  // Update an existing activity
  updateActivity: protectedProcedure
    .input(updateActivitySchema)
    .mutation(async ({ ctx, input }) => {
      // Find the activity
      const existingActivity = await ctx.db.query.activities.findFirst({
        where: eq(activities.id, input.activityId),
        with: {
          day: {
            with: {
              itinerary: true,
            },
          },
        },
      });

      if (!existingActivity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Activity not found",
        });
      }

      // Check if user has permission
      if (
        existingActivity.day.itinerary.createdById !== ctx.session.user.dbId
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to update this activity",
        });
      }

      // If the date has changed, find the new day
      let dayId = existingActivity.dayId;
      if (input.data.date.getTime() !== existingActivity.day.date.getTime()) {
        const newDay = await ctx.db.query.days.findFirst({
          where: eq(days.date, input.data.date),
        });

        if (!newDay) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Day not found for the updated date",
          });
        }

        dayId = newDay.id;
      }

      // Update the activity
      const [updatedActivity] = await ctx.db
        .update(activities)
        .set({
          dayId,
          title: input.data.title,
          description: input.data.description,
          location: input.data.location,
          startTime: input.data.startTime,
          endTime: input.data.endTime,
          image: input.data.image ?? existingActivity.image,
        })
        .where(eq(activities.id, input.activityId))
        .returning();

      if (!updatedActivity) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update activity",
        });
      }

      return updatedActivity;
    }),

  // Delete an activity
  deleteActivity: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Find the activity
      const activity = await ctx.db.query.activities.findFirst({
        where: eq(activities.id, input),
        with: {
          day: {
            with: {
              itinerary: true,
            },
          },
        },
      });

      if (!activity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Activity not found",
        });
      }

      // Check if user has permission
      if (activity.day.itinerary.createdById !== ctx.session.user.dbId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to delete this activity",
        });
      }

      // Delete the activity
      await ctx.db.delete(activities).where(eq(activities.id, input));

      return { success: true };
    }),
});
