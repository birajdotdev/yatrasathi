import { NextResponse } from "next/server";

import { env } from "@/env";
import { processUpcomingItineraryReminders } from "@/lib/resend";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  // Optional: Check for a secret to ensure only authorized calls can trigger this endpoint
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // If you decide to use a secret, verify it here
  if (env.CRON_SECRET && secret !== env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Process all reminders
    const result = await processUpcomingItineraryReminders();

    return NextResponse.json(
      {
        success: true,
        message: `Processed ${result.processed} upcoming itineraries.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing itinerary reminders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process itinerary reminders.",
      },
      { status: 500 }
    );
  }
}
