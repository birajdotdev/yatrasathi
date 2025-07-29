export const BLOG_CATEGORIES = [
  { value: "travel_tips", name: "Travel Tips" },
  { value: "adventure", name: "Adventure" },
  { value: "food", name: "Food & Cuisine" },
  { value: "culture", name: "Culture & History" },
  { value: "nature", name: "Nature & Outdoors" },
  { value: "city_guide", name: "City Guide" },
  { value: "budget_travel", name: "Budget Travel" },
  { value: "photography", name: "Photography" },
  { value: "other", name: "Other" },
] as const;

// Extract just the values for the schema - with proper typing for pgEnum
export const categoryValues = [
  "travel_tips",
  "adventure",
  "food",
  "culture",
  "nature",
  "city_guide",
  "budget_travel",
  "photography",
  "other",
] as const;

// Type for TypeScript
export type CategoryType = (typeof categoryValues)[number];
