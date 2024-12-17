/**
 * Array containing public routes accessible without authentication
 * Contains paths that can be accessed by unauthenticated users
 * @constant
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/", "/demo"];

/**
 * Array of authentication-related route paths.
 * Contains paths that do not require authentication for access.
 *
 * @constant
 * @type {string[]}
 */
export const authRoutes: string[] = ["/login", "/signup"];

/**
 * The prefix for authentication-related API routes.
 * This constant is used to define the base path for all authentication endpoints.
 * @constant
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The prefix used for all tRPC API endpoints.
 * This constant defines the base URL path segment for tRPC API routes.
 * @constant {string}
 */
export const apiTrpcPrefix = "/api/trpc";

/**
 * Default redirect path after successful login.
 * This constant defines the route where users will be redirected
 * after completing the authentication process.
 * @constant
 */
export const DEFAULT_LOGIN_REDIRECT = "/home";
