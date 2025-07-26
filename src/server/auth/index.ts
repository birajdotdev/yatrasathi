import { cache } from "react";

import {
  auth as uncachedAuth,
  currentUser as uncachedCurrentUser,
} from "@clerk/nextjs/server";

export const auth = cache(uncachedAuth);
export const currentUser = cache(uncachedCurrentUser);
