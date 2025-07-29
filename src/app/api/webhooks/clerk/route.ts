import { headers } from "next/headers";

import { type WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Webhook } from "svix";

import { env } from "@/env";
import { generateUniqueUsername } from "@/lib/username";
import { db } from "@/server/db";
import { comments, itineraries, likes, posts, users } from "@/server/db/schema";

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
        try {
          // Use database transaction to ensure atomicity
          await db.transaction(async (tx) => {
            // Generate unique username for new user
            const username = await generateUniqueUsername(name);

            // Update username in clerk user data
            const clerk = await clerkClient();
            await clerk.users.updateUser(evt.data.id, {
              username,
            });

            // Insert new user into database
            await tx.insert(users).values({
              clerkUserId: evt.data.id,
              email,
              name,
              username,
              image: evt.data.image_url,
            });
          });
        } catch (error) {
          console.error("Error creating user:", error);
          return new Response("Error: Failed to create user", {
            status: 500,
          });
        }
      } else {
        if (!evt.data.username)
          return new Response("Error: No username found", { status: 400 });

        try {
          // Check if user exists before updating
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.clerkUserId, evt.data.id))
            .limit(1);

          if (existingUser.length === 0) {
            return new Response("Error: User not found", {
              status: 404,
            });
          }

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
        } catch (error) {
          console.error("Error updating user:", error);
          return new Response("Error: Failed to update user", {
            status: 500,
          });
        }
      }
      break;
    }
    case "user.deleted": {
      if (!evt.data.id) {
        return new Response("Error: Invalid user ID", { status: 400 });
      }

      try {
        // Delete user from database
        const user = await db.query.users.findFirst({
          where: eq(users.clerkUserId, evt.data.id),
        });
        if (!user) {
          return new Response("User not found", {
            status: 404,
          });
        }
        const userId = user.id;
        // Use a transaction to ensure all deletions succeed or fail together
        await db.transaction(async (trx) => {
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
          await trx.delete(users).where(eq(users.id, userId));
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        return new Response("Error: Failed to delete user", {
          status: 500,
        });
      }
      break;
    }
  }

  return new Response("", { status: 200 });
}
