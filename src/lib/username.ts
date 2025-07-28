import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";

/**
 * Generates a unique username based on the user's name
 * @param name - The user's full name
 * @returns A unique username
 */
export async function generateUniqueUsername(name: string): Promise<string> {
  // Clean and format the base username
  const baseUsername = createBaseUsername(name);

  // Check if the base username is available
  if (await isUsernameAvailable(baseUsername)) {
    return baseUsername;
  }

  // If not available, append numbers until we find a unique one
  let counter = 1;
  let candidate = `${baseUsername}${counter}`;

  while (!(await isUsernameAvailable(candidate))) {
    counter++;
    candidate = `${baseUsername}${counter}`;

    // Prevent infinite loops
    if (counter > 9999) {
      candidate = `${baseUsername}${Date.now()}`;
      break;
    }
  }

  return candidate;
}

/**
 * Creates a base username from a full name
 * @param name - The user's full name
 * @returns A base username
 */
function createBaseUsername(name: string): string {
  if (!name || name.trim() === "") {
    return `user${Date.now()}`;
  }

  // Take the first name and clean it
  const firstName = name.trim().split(" ")[0] ?? "";

  // Remove special characters and convert to lowercase
  let username = firstName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 15); // Limit length

  // If username is empty after cleaning, use fallback
  if (!username) {
    username = `user${Date.now()}`;
  }

  // Ensure minimum length
  if (username.length < 3) {
    username = username + Math.floor(Math.random() * 1000);
  }

  return username;
}

/**
 * Checks if a username is available
 * @param username - The username to check
 * @returns True if available, false if taken
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    return !existingUser;
  } catch (error) {
    console.error("Error checking username availability:", error);
    // In case of error, assume not available to be safe
    return false;
  }
}

/**
 * Validates username format
 * @param username - The username to validate
 * @returns Validation result with error message if invalid
 */
export function validateUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  if (!username || username.trim() === "") {
    return { isValid: false, error: "Username is required" };
  }

  const cleanUsername = username.trim();

  // Check length
  if (cleanUsername.length < 3) {
    return {
      isValid: false,
      error: "Username must be at least 3 characters long",
    };
  }

  if (cleanUsername.length > 30) {
    return {
      isValid: false,
      error: "Username must be no more than 30 characters long",
    };
  }

  // Check format - only letters, numbers, and underscores
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(cleanUsername)) {
    return {
      isValid: false,
      error: "Username can only contain letters, numbers, and underscores",
    };
  }

  // Check if it starts with a letter or number
  if (!/^[a-zA-Z0-9]/.test(cleanUsername)) {
    return {
      isValid: false,
      error: "Username must start with a letter or number",
    };
  }

  return { isValid: true };
}
