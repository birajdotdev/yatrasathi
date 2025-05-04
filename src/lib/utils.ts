import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

export function splitTitle(
  text: string,
  options?: {
    lastWordCount?: number;
  }
): [string, string] {
  const { lastWordCount = 1 } = options ?? {};
  const words = text.split(" ");
  const lastWords = words.splice(-lastWordCount).join(" ");
  const firstPart = words.join(" ");
  return [firstPart, lastWords];
}
