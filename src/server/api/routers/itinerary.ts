import { google } from "@ai-sdk/google";
import { TRPCError } from "@trpc/server";
import { generateObject } from "ai";
import { and, eq, gt, lt } from "drizzle-orm";
import { z } from "zod";

import { fetchImageFromUnsplash } from "@/lib/image-utils";
import { aiGeneratedItinerarySchema } from "@/lib/schemas/ai-itinerary";
import { itineraryFormSchema } from "@/lib/schemas/itinerary";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { aiUsage } from "@/server/db/schema/ai-usage";
import {
  activities,
  days,
  destinations,
  itineraries,
} from "@/server/db/schema/itinerary";
import { users } from "@/server/db/schema/user";

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
    .input(
      z.object({
        type: z.enum(["all", "upcoming", "past"]).default("all"),
        limit: z.number().int().positive().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const baseQuery = {
        where: eq(itineraries.createdById, ctx.session.user.dbId),
      };

      let itinerariesResult;
      const limit = input.limit;
      const type = input.type ?? "all";

      switch (type) {
        case "upcoming":
          itinerariesResult = await ctx.db.query.itineraries.findMany({
            ...baseQuery,
            where: and(baseQuery.where, gt(itineraries.startDate, new Date())),
            orderBy: (itineraries, { asc }) => [asc(itineraries.startDate)],
            ...(limit ? { limit } : {}),
          });
          break;
        case "past":
          itinerariesResult = await ctx.db.query.itineraries.findMany({
            ...baseQuery,
            where: and(baseQuery.where, lt(itineraries.endDate, new Date())),
            orderBy: (itineraries, { desc }) => [desc(itineraries.endDate)],
            ...(limit ? { limit } : {}),
          });
          break;
        default: // 'all'
          itinerariesResult = await ctx.db.query.itineraries.findMany({
            ...baseQuery,
            orderBy: (itineraries, { desc }) => [desc(itineraries.createdAt)],
            ...(limit ? { limit } : {}),
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
  // Delete an itinerary and all related data
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get the itinerary to check ownership
      const itinerary = await ctx.db.query.itineraries.findFirst({
        where: eq(itineraries.id, input.id),
      });

      if (!itinerary) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Itinerary not found",
        });
      }

      // Check if the user owns this itinerary
      if (itinerary.createdById !== ctx.session.user.dbId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this itinerary",
        });
      }

      return await ctx.db.transaction(async (tx) => {
        try {
          // Get all days for this itinerary
          const daysResult = await tx.query.days.findMany({
            where: eq(days.itineraryId, input.id),
          });

          // Delete activities for each day
          for (const day of daysResult) {
            await tx.delete(activities).where(eq(activities.dayId, day.id));
          }

          // Delete all days
          await tx.delete(days).where(eq(days.itineraryId, input.id));

          // Delete destinations
          await tx
            .delete(destinations)
            .where(eq(destinations.itineraryId, input.id));

          // Delete the itinerary
          await tx.delete(itineraries).where(eq(itineraries.id, input.id));

          return { success: true };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete itinerary",
            cause: error,
          });
        }
      });
    }),

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

  // Update itinerary activity image
  updateActivityImage: protectedProcedure
    .input(z.object({ activityId: z.string(), imageUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if the activity exists
      const activity = await ctx.db.query.activities.findFirst({
        where: eq(activities.id, input.activityId),
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

      // Check if the user owns this itinerary
      if (activity.day.itinerary.createdById !== ctx.session.user.dbId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to update this activity",
        });
      }

      // Update the activity image
      const updatedActivity = await ctx.db
        .update(activities)
        .set({ image: input.imageUrl })
        .where(eq(activities.id, input.activityId))
        .returning();

      if (!updatedActivity) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update activity image",
        });
      }
      return updatedActivity;
    }),

  // Update itinerary cover image
  updateCoverImage: protectedProcedure
    .input(z.object({ itineraryId: z.string(), imageUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if the itinerary exists and belongs to the user
      const itinerary = await ctx.db.query.itineraries.findFirst({
        where: eq(itineraries.id, input.itineraryId),
        with: {
          destination: true,
        },
      });
      if (!itinerary) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Itinerary not found",
        });
      }
      if (itinerary.createdById !== ctx.session.user.dbId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to update this itinerary",
        });
      }

      // Check if the destination exists
      if (!itinerary.destination?.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Destination not found for this itinerary",
        });
      }

      // Update the destination image - now we know the ID exists
      const updatedDestination = await ctx.db
        .update(destinations)
        .set({ image: input.imageUrl })
        .where(
          and(
            eq(destinations.itineraryId, itinerary.id),
            eq(destinations.id, itinerary.destination.id)
          )
        )
        .returning();

      if (!updatedDestination) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update cover image",
        });
      }
      return updatedDestination;
    }),

  // Generate itinerary with AI
  generateWithAI: protectedProcedure
    .input(itineraryFormSchema)
    .mutation(async ({ ctx, input }) => {
      // --- AI USAGE LIMIT LOGIC ---
      // Get the user
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.dbId),
      });
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
      // Only limit free users
      if (user.plan === "free") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
        // Find today's usage
        const usage = await ctx.db.query.aiUsage.findFirst({
          where: and(eq(aiUsage.userId, user.id), eq(aiUsage.date, todayStr)),
        });
        if (usage && usage.count >= 3) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Daily AI usage limit reached. Upgrade to Pro for unlimited access.",
          });
        }
        // Increment usage
        if (usage) {
          await ctx.db
            .update(aiUsage)
            .set({ count: usage.count + 1 })
            .where(
              and(eq(aiUsage.userId, user.id), eq(aiUsage.date, todayStr))
            );
        } else {
          await ctx.db
            .insert(aiUsage)
            .values({ userId: user.id, date: todayStr, count: 1 });
        }
      }
      try {
        // Calculate number of days
        const startDate = input.dateRange.from;
        const endDate = input.dateRange.to ?? input.dateRange.from;
        const daysCount =
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;

        // Format dates for the prompt
        const formatDate = (date: Date) => {
          return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        };

        // Create a system prompt for the AI
        const systemPrompt = `You are an expert travel planner. Generate a detailed day-by-day itinerary for a trip to ${input.destination.name}.
        
        Trip details:
        - Destination: ${input.destination.name}
        - Start date: ${formatDate(startDate)}
        - End date: ${formatDate(endDate)}
        - Total days: ${daysCount}
        
        Your task is to create a realistic and enjoyable itinerary with multiple activities each day, including must-see attractions, food recommendations, and practical travel information.`;

        // Initialize the Gemini model
        // API key is automatically picked up from GOOGLE_GENERATIVE_AI_API_KEY environment variable
        const model = google("models/gemini-1.5-flash");

        // Generate structured data using the AI SDK and our Zod schema
        const { object: generatedItinerary } = await generateObject({
          model,
          schema: aiGeneratedItinerarySchema,
          prompt: `Please create a detailed itinerary for my trip to ${input.destination.name} from ${formatDate(startDate)} to ${formatDate(endDate)}. Include 3-4 activities for each day with realistic timings, locations, and descriptions.

${systemPrompt}`,
        });

        // Save the generated itinerary to the database
        return await ctx.db.transaction(async (tx) => {
          // Create the main itinerary
          const [itinerary] = await tx
            .insert(itineraries)
            .values({
              title: generatedItinerary.title,
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
          const imageResult = await fetchImageFromUnsplash({
            query: input.destination.name,
            count: 1,
            orientation: "landscape",
          });

          const [destination] = await tx
            .insert(destinations)
            .values({
              itineraryId: itinerary.id,
              name: input.destination.name,
              address: input.destination.address,
              image: imageResult.url,
            })
            .returning();

          // Create days and activities
          for (const dayData of generatedItinerary.days) {
            // Create the day entry
            const [day] = await tx
              .insert(days)
              .values({
                itineraryId: itinerary.id,
                date: dayData.date,
              })
              .returning();

            if (!day) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create day entry",
              });
            }

            // Create activities for the day
            for (const activityData of dayData.activities) {
              // Get image for the activity
              let activityImage = "";
              try {
                const activityImageResult = await fetchImageFromUnsplash({
                  query: `${activityData.title} ${input.destination.name}`,
                  count: 1,
                  orientation: "landscape",
                });
                activityImage = activityImageResult.url;
              } catch (error) {
                console.error("Failed to fetch activity image:", error);
              }

              await tx.insert(activities).values({
                dayId: day.id,
                title: activityData.title,
                description: activityData.description,
                location: activityData.location,
                startTime: activityData.startTime,
                endTime: activityData.endTime,
                image: activityImage,
              });
            }
          }

          return {
            id: itinerary.id,
            title: itinerary.title,
            destination: destination,
          };
        });
      } catch (error) {
        console.error("Error generating itinerary with AI:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to generate itinerary with AI",
        });
      }
    }),
});
