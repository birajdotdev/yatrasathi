import { CustomerPortal } from "@polar-sh/nextjs";

import { env } from "@/env";
import { api } from "@/trpc/server";

export const GET = CustomerPortal({
  accessToken: env.POLAR_ACCESS_TOKEN,
  getCustomerId: async () => {
    const user = await api.user.getCurrentUser();
    if (!user?.polarCustomerId) {
      throw new Error("User customer id not found");
    }
    return user.polarCustomerId;
  },
  server: "sandbox", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
});
