export const TYPE_META: Record<
  string,
  { label: string; color: string; emoji: string }
> = {
  vaccine: {
    label: "Vaccine",
    emoji: "💉",
    color:
      "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700",
  },
  "vet-visit": {
    label: "Vet Visit",
    emoji: "🏥",
    color:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  },
  medication: {
    label: "Medication",
    emoji: "💊",
    color:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  },
  grooming: {
    label: "Grooming",
    emoji: "✂️",
    color:
      "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-700",
  },
  "lab-test": {
    label: "Lab Test",
    emoji: "🔬",
    color:
      "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700",
  },
  surgery: {
    label: "Surgery",
    emoji: "🔪",
    color:
      "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
  },
  imaging: {
    label: "Imaging",
    emoji: "🩻",
    color:
      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700",
  },
  hospitalization: {
    label: "Hospitalization",
    emoji: "🛏️",
    color:
      "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700",
  },
  other: {
    label: "Other",
    emoji: "📄",
    color:
      "bg-default-100 dark:bg-default-100/10 text-default-500 border-default-200 dark:border-default-700",
  },
};
