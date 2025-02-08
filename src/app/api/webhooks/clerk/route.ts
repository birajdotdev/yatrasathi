import { headers } from "next/headers";

import { type WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

import { env } from "@/env";
import { syncClerkUserMetadata } from "@/server/auth";
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
        const user = await api.user.create({
          clerkUserId: evt.data.id,
          email,
          name,
          image: evt.data.image_url,
        });

        await syncClerkUserMetadata(user);
      } else {
        // Update user in database
        await api.user.update({
          clerkUserId: evt.data.id,
          email,
          name,
          image: evt.data.image_url,
        });
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
