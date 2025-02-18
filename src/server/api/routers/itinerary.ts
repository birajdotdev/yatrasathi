import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  accommodations,
  activities,
  destinations,
  itineraries,
  transportation,
} from "@/server/db/schema/itinerary";

// Create base insert schemas
const destinationInsertSchema = createInsertSchema(destinations, {
  location: z.string().min(2, "Location is required"),
}).omit({
  id: true,
  itineraryId: true,
  createdAt: true,
  updatedAt: true,
});

const transportationInsertSchema = createInsertSchema(transportation).omit({
  id: true,
  itineraryId: true,
  createdAt: true,
  updatedAt: true,
});

const accommodationInsertSchema = createInsertSchema(accommodations, {
  name: z.string().min(2, "Accommodation name is required"),
}).omit({
  id: true,
  itineraryId: true,
  createdAt: true,
  updatedAt: true,
});

const activityInsertSchema = createInsertSchema(activities, {
  name: z.string().min(2, "Activity name is required"),
}).omit({
  id: true,
  itineraryId: true,
  createdAt: true,
  updatedAt: true,
});

const createItinerarySchema = createInsertSchema(itineraries, {
  tripTitle: z.string().min(3, "Trip title must be at least 3 characters"),
})
  .omit({
    id: true,
    createdById: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    destinations: z.array(destinationInsertSchema),
    transportation: z.array(transportationInsertSchema),
    accommodations: z.array(accommodationInsertSchema),
    activities: z.array(activityInsertSchema),
  });

export const itineraryRouter = createTRPCRouter({
  // Create new itinerary
  create: protectedProcedure
    .input(createItinerarySchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const [itinerary] = await tx
          .insert(itineraries)
          .values([
            {
              tripTitle: input.tripTitle,
              tripType: input.tripType,
              coverImage: input.coverImage,
              startDate: input.startDate,
              endDate: input.endDate,
              timeZone: input.timeZone,
              generalNotes: input.generalNotes,
              attachments: input.attachments as string[] | null,
              createdById: ctx.session.user.id,
            },
          ])
          .returning();

        if (!itinerary) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create itinerary",
          });
        }

        if (input.destinations.length > 0) {
          await tx.insert(destinations).values(
            input.destinations.map((dest) => ({
              ...dest,
              itineraryId: itinerary.id,
            }))
          );
        }

        if (input.transportation.length > 0) {
          await tx.insert(transportation).values(
            input.transportation.map((trans) => ({
              ...trans,
              itineraryId: itinerary.id,
              attachments: trans.attachments as string[] | null,
            }))
          );
        }

        if (input.accommodations.length > 0) {
          await tx.insert(accommodations).values(
            input.accommodations.map((acc) => ({
              ...acc,
              itineraryId: itinerary.id,
            }))
          );
        }

        if (input.activities.length > 0) {
          await tx.insert(activities).values(
            input.activities.map((act) => ({
              ...act,
              itineraryId: itinerary.id,
              attachments: act.attachments as string[] | null,
            }))
          );
        }

        return itinerary;
      });
    }),

  // Get all itineraries for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.itineraries.findMany({
      where: eq(itineraries.createdById, ctx.session.user.id),
      with: {
        destinations: true,
        transportation: true,
        accommodations: true,
        activities: true,
      },
      orderBy: (itineraries, { desc }) => [desc(itineraries.createdAt)],
    });
  }),

  // Get single itinerary by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const itinerary = await ctx.db.query.itineraries.findFirst({
        where: eq(itineraries.id, input.id),
        with: {
          destinations: true,
          transportation: true,
          accommodations: true,
          activities: true,
        },
      });

      if (!itinerary) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Itinerary not found",
        });
      }

      if (itinerary.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to access this itinerary",
        });
      }

      return itinerary;
    }),

  // Update itinerary
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: createItinerarySchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.itineraries.findFirst({
        where: eq(itineraries.id, input.id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Itinerary not found",
        });
      }

      if (existing.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to update this itinerary",
        });
      }

      return await ctx.db.transaction(async (tx) => {
        const [updated] = await tx
          .update(itineraries)
          .set({
            tripTitle: input.data.tripTitle,
            tripType: input.data.tripType,
            coverImage: input.data.coverImage,
            startDate: input.data.startDate,
            endDate: input.data.endDate,
            timeZone: input.data.timeZone,
            generalNotes: input.data.generalNotes,
            attachments: input.data.attachments as string[] | null,
          })
          .where(eq(itineraries.id, input.id))
          .returning();

        if (!updated) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update itinerary",
          });
        }

        // Delete existing related records
        await tx
          .delete(destinations)
          .where(eq(destinations.itineraryId, input.id));
        await tx
          .delete(transportation)
          .where(eq(transportation.itineraryId, input.id));
        await tx
          .delete(accommodations)
          .where(eq(accommodations.itineraryId, input.id));
        await tx.delete(activities).where(eq(activities.itineraryId, input.id));

        // Insert new related records
        if (input.data.destinations.length > 0) {
          await tx.insert(destinations).values(
            input.data.destinations.map((dest) => ({
              ...dest,
              itineraryId: input.id,
            }))
          );
        }

        if (input.data.transportation.length > 0) {
          await tx.insert(transportation).values(
            input.data.transportation.map((trans) => ({
              ...trans,
              itineraryId: input.id,
              attachments: trans.attachments as string[] | null,
            }))
          );
        }

        if (input.data.accommodations.length > 0) {
          await tx.insert(accommodations).values(
            input.data.accommodations.map((acc) => ({
              ...acc,
              itineraryId: input.id,
            }))
          );
        }

        if (input.data.activities.length > 0) {
          await tx.insert(activities).values(
            input.data.activities.map((act) => ({
              ...act,
              itineraryId: input.id,
              attachments: act.attachments as string[] | null,
            }))
          );
        }

        return updated;
      });
    }),

  // Delete itinerary
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const itinerary = await ctx.db.query.itineraries.findFirst({
        where: eq(itineraries.id, input.id),
      });

      if (!itinerary) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Itinerary not found",
        });
      }

      if (itinerary.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to delete this itinerary",
        });
      }

      const [deleted] = await ctx.db
        .delete(itineraries)
        .where(eq(itineraries.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete itinerary",
        });
      }

      return deleted;
    }),
});
