import { auth } from "@/server/auth";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  apiTrpcPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Group related route checks together
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiTrpcRoute = nextUrl.pathname.startsWith(apiTrpcPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Early return for API routes
  if (isApiAuthRoute || isApiTrpcRoute) return;

  // Handle auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Handle protected routes
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/signin", nextUrl));
  }

  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
