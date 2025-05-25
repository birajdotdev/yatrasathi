import { blogRouter } from "@/server/api/routers/blog";
import { itineraryRouter } from "@/server/api/routers/itinerary";
import { notificationRouter } from "@/server/api/routers/notification";
import { placesRouter } from "@/server/api/routers/places";
import { unsplashRouter } from "@/server/api/routers/unsplash";
import { userRouter } from "@/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  itinerary: itineraryRouter,
  places: placesRouter,
  unsplash: unsplashRouter,
  blog: blogRouter,
  notification: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
