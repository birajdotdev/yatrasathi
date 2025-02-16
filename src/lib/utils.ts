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

export function splitTitle(text: string): [string, string] {
  const words = text.split(" ");
  const lastWord = words.pop() ?? "";
  const firstPart = words.join(" ");
  return [firstPart, lastWord];
}
