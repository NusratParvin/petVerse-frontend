import { TSpeciality } from "./types";

export const protectedRoutes = [
  "/profile",
  "/profile/:page*",
  "/admin",
  "/login",
  "/register",
];

///vets-constants

export const SPECIALITIES: { value: TSpeciality | ""; label: string }[] = [
  { value: "", label: "All Specialities" },
  { value: "dogs", label: "🐕 Dogs" },
  { value: "cats", label: "🐈 Cats" },
  { value: "birds", label: "🦜 Birds" },
  { value: "fish", label: "🐠 Fish" },
  { value: "rabbits", label: "🐇 Rabbits" },
  { value: "reptiles", label: "🦎 Reptiles" },
  { value: "exotic", label: "🦋 Exotic" },
  { value: "emergency", label: "🚨 Emergency" },
  { value: "surgery", label: "🔬 Surgery" },
  { value: "dental", label: "🦷 Dental" },
];

export const EMIRATES = [
  { value: "dubai", label: "Dubai" },
  { value: "abu-dhabi", label: "Abu Dhabi" },
  { value: "sharjah", label: "Sharjah" },
  { value: "ajman", label: "Ajman" },
  { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
  { value: "fujairah", label: "Fujairah" },
  { value: "umm-al-quwain", label: "Umm Al Quwain" },
];

export const VET_SPECIALITIES = [
  "dogs",
  "cats",
  "birds",
  "fish",
  "rabbits",
  "reptiles",
  "exotic",
  "small-animals",
  "emergency",
  "surgery",
  "dental",
  "dermatology",
  "ophthalmology",
  "nutrition",
];

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
