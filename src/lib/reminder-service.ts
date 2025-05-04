import { and, eq, gt, inArray, lt, not, sql } from "drizzle-orm";
import { Resend } from "resend";

import { ItineraryReminderEmail } from "@/emails/templates/itinerary-reminder-email";
import { env } from "@/env";
import { db } from "@/server/db";
import {
  destinations,
  itineraries,
  reminderLogs,
  reminderPreferences,
  users,
} from "@/server/db/schema";

const resend = new Resend(env.RESEND_API_KEY);

interface SendReminderEmailParams {
  userId: string;
  userName: string;
  userEmail: string;
  itineraryId: string;
  itineraryTitle: string;
  destination: string;
  startDate: Date;
}

export async function sendReminderEmail({
  userId,
  userName,
  userEmail,
  itineraryId,
  itineraryTitle,
  destination,
  startDate,
}: SendReminderEmailParams) {
  const itineraryLink = `${env.NEXT_PUBLIC_BASE_URL}/itineraries/${itineraryId}`;

  // Pass the React component directly to Resend instead of pre-rendering to HTML
  const { data, error } = await resend.emails.send({
    from: "YatraSathi <trips@yatrasathi.tech>",
    to: [userEmail],
    subject: `Reminder: Your trip to ${destination} is coming soon!`,
    react: ItineraryReminderEmail({
      username: userName,
      itineraryTitle,
      destination,
      startDate,
      itineraryLink,
    }),
  });

  if (error) {
    console.error("Failed to send reminder email:", error);
    throw new Error(`Failed to send reminder email: ${error.message}`);
  }

  // Log that email was sent
  await db.insert(reminderLogs).values({
    userId,
    itineraryId,
    sentAt: new Date(),
    emailId: data?.id ?? "", // Using nullish coalescing
    status: "sent",
  });

  return data;
}

export async function processUpcomingItineraryReminders() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  // Find all reminder logs to exclude itineraries that already have reminders sent
  const existingReminderLogs = await db
    .select({
      itineraryId: reminderLogs.itineraryId,
    })
    .from(reminderLogs);

  const reminderSentItineraryIds = existingReminderLogs.map(
    (log) => log.itineraryId
  );

  // Find itineraries starting in the next week
  const upcomingItineraries = await db
    .select({
      id: itineraries.id,
      title: itineraries.title,
      startDate: itineraries.startDate,
      userId: users.id,
      userName: users.name,
      userEmail: users.email,
      destinationName: destinations.name,
      optOut: reminderPreferences.optOut,
      daysBefore: reminderPreferences.daysBefore,
    })
    .from(itineraries)
    .innerJoin(users, eq(itineraries.createdById, users.id))
    .innerJoin(destinations, eq(destinations.itineraryId, itineraries.id))
    .leftJoin(reminderPreferences, eq(reminderPreferences.userId, users.id))
    .where(
      and(
        // Itineraries starting soon
        gt(itineraries.startDate, tomorrow),
        lt(itineraries.startDate, weekFromNow),
        // No reminder sent yet
        reminderSentItineraryIds.length > 0
          ? not(inArray(itineraries.id, reminderSentItineraryIds))
          : sql`1=1` // Always true if no reminders have been sent yet
      )
    );

  console.log(
    `Processing ${upcomingItineraries.length} upcoming itineraries for reminders`
  );

  // Send reminders for each upcoming itinerary
  let sentCount = 0;
  for (const itinerary of upcomingItineraries) {
    // Skip if user has opted out of reminders
    if (itinerary.optOut) {
      continue;
    }

    // Calculate days until trip
    const daysUntilTrip = Math.ceil(
      (itinerary.startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Default reminder days (if no user preference)
    const reminderDays = itinerary.daysBefore ?? 7;

    // Send reminder if it's the right time
    if (daysUntilTrip <= reminderDays) {
      console.log(
        `Sending reminder for itinerary ${itinerary.id} (${daysUntilTrip} days before trip)`
      );

      try {
        await sendReminderEmail({
          userId: itinerary.userId,
          userName: itinerary.userName ?? "Traveler",
          userEmail: itinerary.userEmail,
          itineraryId: itinerary.id,
          itineraryTitle: itinerary.title,
          destination: itinerary.destinationName,
          startDate: itinerary.startDate,
        });

        sentCount++;
      } catch (error) {
        console.error(
          `Failed to send reminder for itinerary ${itinerary.id}:`,
          error
        );
      }
    }
  }

  return { processed: upcomingItineraries.length, sent: sentCount };
}
