import { TRPCError } from "@trpc/server";
import { and, eq, gt, lt } from "drizzle-orm";
import { z } from "zod";

import { itineraryFormSchema } from "@/lib/schemas/itinerary";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  accommodations,
  activities,
  destinations,
  itineraries,
  transportation,
} from "@/server/db/schema/itinerary";

export const itineraryRouter = createTRPCRouter({
  // Create new itinerary
  create: protectedProcedure
    .input(itineraryFormSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // Create the main itinerary
        const [itinerary] = await tx
          .insert(itineraries)
          .values({
            tripTitle: input.tripTitle,
            tripType: input.tripType,
            coverImage: input.coverImage ?? null,
            startDate: input.startDate,
            endDate: input.endDate,
            timeZone: input.timeZone,
            generalNotes: input.generalNotes ?? null,
            attachments: input.attachments ?? null,
            createdById: ctx.session.user.dbId,
          })
          .returning();

        if (!itinerary) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create itinerary",
          });
        }

        // Insert destinations if any
        if (input.destinations.length > 0) {
          await tx.insert(destinations).values(
            input.destinations.map((dest) => ({
              itineraryId: itinerary.id,
              location: dest.location,
              arrivalDateTime: dest.arrivalDateTime,
              departureDateTime: dest.departureDateTime,
              notes: dest.notes ?? null,
            }))
          );
        }

        // Insert transportation if any
        if (input.transportation.length > 0) {
          await tx.insert(transportation).values(
            input.transportation.map((trans) => ({
              itineraryId: itinerary.id,
              mode: trans.mode,
              departureDateTime: trans.departureDateTime,
              arrivalDateTime: trans.arrivalDateTime,
              bookingReference: trans.bookingReference ?? null,
              attachments: Array.isArray(trans.attachments)
                ? trans.attachments
                : null,
            }))
          );
        }

        // Insert accommodations if any
        if (input.accommodations.length > 0) {
          await tx.insert(accommodations).values(
            input.accommodations.map((acc) => ({
              itineraryId: itinerary.id,
              name: acc.name,
              checkInDateTime: acc.checkInDateTime,
              checkOutDateTime: acc.checkOutDateTime,
              address: acc.address,
              confirmationNumber: acc.confirmationNumber ?? null,
            }))
          );
        }

        // Insert activities if any
        if (input.activities.length > 0) {
          await tx.insert(activities).values(
            input.activities.map((act) => ({
              itineraryId: itinerary.id,
              name: act.name,
              dateTime: act.dateTime,
              location: act.location,
              notes: act.notes ?? null,
              attachments: Array.isArray(act.attachments)
                ? act.attachments
                : null,
            }))
          );
        }

        return itinerary;
      });
    }),

  // Get all itineraries for the current user
  getAll: protectedProcedure
    .input(z.enum(["all", "upcoming", "past"]).default("all"))
    .query(async ({ ctx, input }) => {
      const baseQuery = {
        where: eq(itineraries.createdById, ctx.session.user.dbId),
      };

      switch (input) {
        case "upcoming":
          return await ctx.db.query.itineraries.findMany({
            ...baseQuery,
            where: and(baseQuery.where, gt(itineraries.startDate, new Date())),
            orderBy: (itineraries, { asc }) => [asc(itineraries.startDate)],
          });
        case "past":
          return await ctx.db.query.itineraries.findMany({
            ...baseQuery,
            where: and(baseQuery.where, lt(itineraries.endDate, new Date())),
            orderBy: (itineraries, { desc }) => [desc(itineraries.endDate)],
          });
        default: // 'all'
          return await ctx.db.query.itineraries.findMany({
            ...baseQuery,
            orderBy: (itineraries, { desc }) => [desc(itineraries.createdAt)],
          });
      }
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

      if (itinerary.createdById !== ctx.session.user.dbId) {
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
        data: itineraryFormSchema,
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

      if (existing.createdById !== ctx.session.user.dbId) {
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
            coverImage: input.data.coverImage ?? null,
            startDate: input.data.startDate,
            endDate: input.data.endDate,
            timeZone: input.data.timeZone,
            generalNotes: input.data.generalNotes ?? null,
            attachments: input.data.attachments ?? null,
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
              itineraryId: input.id,
              location: dest.location,
              arrivalDateTime: dest.arrivalDateTime,
              departureDateTime: dest.departureDateTime,
              notes: dest.notes ?? null,
            }))
          );
        }

        if (input.data.transportation.length > 0) {
          await tx.insert(transportation).values(
            input.data.transportation.map((trans) => ({
              itineraryId: input.id,
              mode: trans.mode,
              departureDateTime: trans.departureDateTime,
              arrivalDateTime: trans.arrivalDateTime,
              bookingReference: trans.bookingReference ?? null,
              attachments: Array.isArray(trans.attachments)
                ? trans.attachments
                : null,
            }))
          );
        }

        if (input.data.accommodations.length > 0) {
          await tx.insert(accommodations).values(
            input.data.accommodations.map((acc) => ({
              itineraryId: input.id,
              name: acc.name,
              checkInDateTime: acc.checkInDateTime,
              checkOutDateTime: acc.checkOutDateTime,
              address: acc.address,
              confirmationNumber: acc.confirmationNumber ?? null,
            }))
          );
        }

        if (input.data.activities.length > 0) {
          await tx.insert(activities).values(
            input.data.activities.map((act) => ({
              itineraryId: input.id,
              name: act.name,
              dateTime: act.dateTime,
              location: act.location,
              notes: act.notes ?? null,
              attachments: Array.isArray(act.attachments)
                ? act.attachments
                : null,
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

      if (itinerary.createdById !== ctx.session.user.dbId) {
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
