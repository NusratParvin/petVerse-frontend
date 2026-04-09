import { TEmirate, TGender, TSpecies } from "@/src/types";

// export const SPECIES = [
//   "dog",
//   "cat",
//   "bird",
//   "fish",
//   "rabbit",
//   "reptile",
//   "other",
// ] as const;
// export const GENDERS = ["male", "female", "unknown"] as const;
// export const EMIRATES = [
//   "dubai",
//   "abu-dhabi",
//   "sharjah",
//   "ajman",
//   "ras-al-khaimah",
//   "fujairah",
//   "umm-al-quwain",
// ] as const;

export const SPECIES: TSpecies[] = [
  "dog",
  "cat",
  "bird",
  "fish",
  "rabbit",
  "reptile",
  "other",
];
export const GENDERS: TGender[] = ["male", "female", "unknown"];
export const EMIRATES: TEmirate[] = [
  "dubai",
  "abu-dhabi",
  "sharjah",
  "ajman",
  "ras-al-khaimah",
  "fujairah",
  "umm-al-quwain",
];

export const inputClass =
  "w-full px-3 py-1.5 rounded-lg text-xs bg-steel-blue/5 dark:bg-white/5 border border-steel-blue/15 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-steel-blue/50 text-gray-900 dark:text-white/90 placeholder-gray-400 dark:placeholder-white/30";
export const labelClass =
  "text-[11px] font-medium text-gray-500 dark:text-white/40 mb-1 block";
export const selectClass =
  "w-full px-3 py-1.5 rounded-lg text-xs bg-steel-blue/5 dark:bg-white/5 border border-steel-blue/15 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-steel-blue/50 text-gray-900 dark:text-white/90 cursor-pointer bg-none";
