import { headers } from "next/headers";

import { type WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Webhook } from "svix";

import { env } from "@/env";
import { clerk } from "@/lib/clerk";
import { generateUniqueUsername } from "@/lib/username";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { api } from "@/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Create new Svix instance with secret
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = (await req.json()) as Record<string, unknown>;
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated": {
      const email = evt.data.email_addresses.find(
        (email) => email.id === evt.data.primary_email_address_id
      )?.email_address;
      const name = `${evt.data.first_name} ${evt.data.last_name}`.trim();
      if (!email) return new Response("Error: No email found", { status: 400 });
      if (name === "")
        return new Response("Error: No name found", { status: 400 });

      if (evt.type === "user.created") {
        // Generate unique username for new user
        const username = await generateUniqueUsername(name);

        // Update username in clerk user data
        await clerk.users.updateUser(evt.data.id, {
          username,
        });

        // Insert new user into database
        await db.insert(users).values({
          clerkUserId: evt.data.id,
          email,
          name,
          username,
          image: evt.data.image_url,
        });
      } else {
        if (!evt.data.username)
          return new Response("Error: No username found", { status: 400 });

        // Update existing user with new details
        await db
          .update(users)
          .set({
            email,
            name,
            username: evt.data.username,
            image: evt.data.image_url,
          })
          .where(eq(users.clerkUserId, evt.data.id));
      }
      break;
    }
    case "user.deleted": {
      if (evt.data.id !== null) {
        // Delete user from database
        await api.user.delete({ clerkUserId: evt.data.id! });
      }
      break;
    }
  }

  return new Response("", { status: 200 });
}
