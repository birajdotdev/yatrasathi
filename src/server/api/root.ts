import { itineraryRouter } from "@/server/api/routers/itinerary";
import { placesRouter } from "@/server/api/routers/places";
import { userRouter } from "@/server/api/routers/user";
import { blogRouter } from "@/server/api/routers/blog";
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
  blog: blogRouter,
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
