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
] as const satisfies ReadonlyArray<{
  readonly value: string;
  readonly name: string;
}>;

export const categoryValues = BLOG_CATEGORIES.map(
  (c) => c.value
) as readonly (typeof BLOG_CATEGORIES)[number]["value"][];

// Type for TypeScript
export type CategoryType = (typeof categoryValues)[number];
