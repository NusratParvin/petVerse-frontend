import {
  Apple,
  BookOpen,
  Dumbbell,
  HeartPulse,
  LayoutGrid,
  Lightbulb,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

export type TOption = {
  value: string; // exactly what the backend expects ("" = All)
  label: string;
  icon?: LucideIcon;
  emoji?: string;
};

export const CATEGORY_OPTIONS: TOption[] = [
  { value: "", label: "All", icon: LayoutGrid },
  { value: "Tip", label: "Tips", icon: Lightbulb },
  { value: "Story", label: "Stories", icon: BookOpen },
  { value: "Health", label: "Health", icon: HeartPulse },
  { value: "Nutrition", label: "Nutrition", icon: Apple },
  { value: "Training", label: "Training", icon: Dumbbell },
  { value: "News", label: "News", icon: Newspaper },
];

export const PET_OPTIONS: TOption[] = [
  { value: "", label: "All pets", emoji: "🐾" },
  { value: "dog", label: "Dogs", emoji: "🐶" },
  { value: "cat", label: "Cats", emoji: "🐱" },
  { value: "fish", label: "Fish", emoji: "🐠" },
  { value: "bird", label: "Birds", emoji: "🐦" },
  { value: "rabbit", label: "Rabbits", emoji: "🐰" },
  { value: "reptile", label: "Reptiles", emoji: "🦎" },
  { value: "other", label: "Other", emoji: "✨" },
];

export const TYPE_OPTIONS: TOption[] = [
  { value: "", label: "All" },
  { value: "false", label: "Free" },
  { value: "true", label: "Premium" },
];

export const RANGE_OPTIONS: TOption[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
  { value: "oldest", label: "Oldest", sortBy: "createdAt", sortOrder: "asc" },
  { value: "top", label: "Most upvoted", sortBy: "upvotes", sortOrder: "desc" },
  {
    value: "discussed",
    label: "Most discussed",
    sortBy: "commentCount",
    sortOrder: "desc",
  },
  {
    value: "viewed",
    label: "Most viewed",
    sortBy: "viewCount",
    sortOrder: "desc",
  },
] as const;

export const RANGE_SORTS: string[] = ["top", "discussed", "viewed"];

export type TArticleFilters = {
  search: string;
  category: string;
  petType: string;
  isPremium: string; // "" | "true" | "false"
  sort: string;
  range: string;
};

export const DEFAULT_FILTERS: TArticleFilters = {
  search: "",
  category: "",
  petType: "",
  isPremium: "",
  sort: "newest",
  range: "all",
};

export const toArticleQuery = (
  filters: TArticleFilters,
  page: number,
  limit = 10,
) => {
  const sort =
    SORT_OPTIONS.find((o) => o.value === filters.sort) ?? SORT_OPTIONS[0];
  const useRange =
    RANGE_SORTS.includes(filters.sort) && filters.range !== "all";

  return {
    search: filters.search.trim() || undefined,
    category: filters.category || undefined,
    petType: filters.petType || undefined,
    isPremium: filters.isPremium || undefined,
    range: useRange ? filters.range : undefined,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
    page,
    limit,
  };
};
