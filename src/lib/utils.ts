import { type PartialBlock } from "@blocknote/core";
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

function extractTextFromContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map(extractTextFromContent).join(" ");
  }
  if (typeof content === "object" && content !== null) {
    // If it's a text node
    if (
      Object.prototype.hasOwnProperty.call(content, "text") &&
      typeof (content as { text: unknown }).text === "string"
    ) {
      return (content as { text: string }).text;
    }
    // If it's a link or other inline node with content
    if (Object.prototype.hasOwnProperty.call(content, "content")) {
      return extractTextFromContent((content as { content: unknown }).content);
    }
    // Recursively extract from all values (for robustness)
    return Object.values(content).map(extractTextFromContent).join(" ");
  }
  return "";
}

export function generateExcerpt(
  blocks: PartialBlock[],
  maxLength = 160
): string {
  // Find the first paragraph block with content
  const firstParagraph = blocks.find(
    (block) =>
      block.type === "paragraph" &&
      block.content &&
      extractTextFromContent(block.content).trim() !== ""
  );
  if (firstParagraph) {
    return extractTextFromContent(firstParagraph.content).slice(0, maxLength);
  }
  // Fallback: join all block contents
  return blocks
    .map((b) => extractTextFromContent(b.content))
    .join(" ")
    .slice(0, maxLength);
}

/**
 * Returns a human-readable string for how long ago something was created or updated.
 * If both created and updated are provided, and updated is more than 1 minute after created,
 * returns 'Updated X ago', otherwise 'Created X ago'.
 * If only one date is provided, returns 'X ago' for that date.
 */
export function getDaysAgoString(
  created: Date | string,
  updated?: Date | string
): string {
  const createdDate = new Date(created);
  if (updated) {
    const updatedDate = new Date(updated);
    const isUpdated = updatedDate.getTime() - createdDate.getTime() > 60 * 1000; // more than 1 minute
    if (isUpdated) {
      return `Updated ${getTimeAgoString(updatedDate)}`;
    } else {
      return `Created ${getTimeAgoString(createdDate)}`;
    }
  }
  return getTimeAgoString(createdDate);
}

function getTimeAgoString(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHour / 24);

  if (diffDays > 0) {
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  }
  if (diffHour > 0) {
    return diffHour === 1 ? "1 hour ago" : `${diffHour} hours ago`;
  }
  if (diffMin > 0) {
    return diffMin === 1 ? "1 min ago" : `${diffMin} min ago`;
  }
  return "Just now";
}

export function splitStringByWords(text: string): [string, string] {
  const words = text.trim().split(/\s+/);
  if (words.length === 1) {
    return [words[0] ?? "", ""];
  }
  const mid = Math.ceil(words.length / 2);
  const firstPart = words.slice(0, mid).join(" ");
  const secondPart = words.slice(mid).join(" ");
  return [firstPart, secondPart];
}
