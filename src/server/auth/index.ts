import { cache } from "react";

import { clerkClient, auth as uncachedAuth } from "@clerk/nextjs/server";

import { type UserRole } from "@/server/db/schema";

const client = await clerkClient();

// export async function getCurrentUser() {
//   const { userId, redirectToSignIn } = await auth();
//   if (!userId) throw new Error("User not logged in!!");
//   const { privateMetadata } = await client.users.getUser(userId);
//   return {
//     clerkUserId: userId,
//     dbId: privateMetadata?.dbId,
//     role: privateMetadata?.role,
//     redirectToSignIn,
//   };
// }

export const auth = cache(uncachedAuth);

export function syncClerkUserMetadata(user: {
  id: string;
  clerkUserId: string;
  role: UserRole;
}) {
  return client.users.updateUserMetadata(user.clerkUserId, {
    privateMetadata: {
      dbId: user.id,
      role: user.role,
    },
  });
}
