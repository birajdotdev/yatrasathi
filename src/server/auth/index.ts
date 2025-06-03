import { cache } from "react";

import { auth as uncachedAuth } from "@clerk/nextjs/server";

export const auth = cache(uncachedAuth);
