import { JwtPayload } from "jwt-decode";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IUser {
  _id: string;
  name: string;
  bio?: string;

  role: string;
  email: string;
  status: string;
  mobileNumber: string;
  profilePhoto: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IUserJwtPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export type TUserRole = "USER" | "ADMIN";
export interface TUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  bio?: string;
  phone: string;
  address: string;
  role: TUserRole;
  profilePhoto?: string;
  terms?: boolean;
  followers: string[];
  following: string[];
  articles: string[];
  purchasedArticles: string[];
  shareIds: string[];
  pendingInvites: string[];
  createdAt: string;
}

export type TPopulatedAuthor = {
  _id: string;
  name: string;
  profilePhoto?: string;
  followers: string[];
};

export type TReactionSummary = {
  like: number;
  love: number;
  haha: number;
  wow: number;
  sad: number;
  angry: number;
};

export type TArticle = {
  _id: string;
  authorId: TPopulatedAuthor;
  title: string;
  content: string;
  category: "Tip" | "Story";
  images?: string;
  upvotes: number;
  downvotes: number;
  voteInfo: TVoteInfo[];
  comments: string[];
  isPremium: boolean;
  isPublish?: boolean;
  shareCount: number;
  reactionSummary: TReactionSummary;
  price: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export interface TVoteInfo {
  userId: string;
  voteType: "upvote" | "downvote";
  _id: string;
}

export interface TComment {
  _id: string;
  articleId: string;
  commenter: {
    commenterId: string;
    name: string;
    profilePhoto: string;
  };
  content: string;
  upvotes: number;
  downvotes: number;
  voteInfo: TVoteInfo[];
  createdAt: string;
  updatedAt: string;
}

export type TTransaction = {
  _id: string;
  transactionId: string;
  userId: string;
  articleId: string;
  amount: number;
  email: string;
  status: "completed" | "pending" | "failed";
  authorId: string;
  createdAt: string;
  updatedAt?: string;
};

export enum REACTION_TYPE {
  LIKE = "like",
  LOVE = "love",
  HAHA = "haha",
  WOW = "wow",
  SAD = "sad",
  ANGRY = "angry",
}

// My Pets //
export const speciesEmoji: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🦜",
  fish: "🐠",
  rabbit: "🐇",
  reptile: "🦎",
  other: "🐾",
  exotic: "🦋",
  emergency: "🚨",
  surgery: "🔬",
  dental: "🦷",
  dermatology: "🩺",
  ophthalmology: "👁️",
  "small-animals": "🐹",
  nutrition: "🥗",
};

export const recordIcon: Record<string, string> = {
  vaccine: "💉",
  "vet-visit": "🏥",
  medication: "💊",
  grooming: "✂️",
  "lab-test": "🔬",
  surgery: "🔪",
  imaging: "📷",
  hospitalization: "🏨",
  other: "📋",
};

export type TSpecies =
  | "dog"
  | "cat"
  | "bird"
  | "fish"
  | "rabbit"
  | "reptile"
  | "other";

export type TGender = "male" | "female" | "unknown";

export type TEmirate =
  | "dubai"
  | "abu-dhabi"
  | "sharjah"
  | "ajman"
  | "ras-al-khaimah"
  | "fujairah"
  | "umm-al-quwain";

export type THealthRecordType =
  | "vaccine"
  | "vet-visit"
  | "medication"
  | "grooming"
  | "lab-test"
  | "surgery"
  | "imaging"
  | "hospitalization"
  // | "injection"
  | "other";

export type THealthRecord = {
  _id?: string;
  type: THealthRecordType;
  title: string;
  date: Date | string;
  nextDueDate?: Date | string;
  notes?: string;
  cost?: number;
  vetName?: string;
  clinicName?: string;
};

export type TPet = {
  _id: string;
  owner: string;
  name: string;
  species: TSpecies;
  breed?: string | null;
  gender: TGender;
  dateOfBirth?: Date | string;
  weight?: number;
  microchipNumber?: string;
  profilePhoto?: string;
  isNeutered: boolean;
  emirate?: TEmirate;
  healthRecords: THealthRecord[];
  whatsappAlerts: boolean;
  whatsappNumber: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
};

//vets

export type TSpeciality =
  | "dogs"
  | "cats"
  | "birds"
  | "fish"
  | "rabbits"
  | "reptiles"
  | "exotic"
  | "small-animals"
  | "emergency"
  | "surgery"
  | "dental"
  | "dermatology"
  | "ophthalmology"
  | "nutrition";

export type TPriceRange = {
  basePrice: number;
  maxPrice: number;
};

export type TWorkingHour = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

export type TVet = {
  _id: string;
  name?: string;
  clinicName: string;
  emirate: TEmirate;
  area: string;
  address: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  coverPhoto?: string;
  photos?: string[];
  about?: string;
  googleMapsUrl?: string;
  specialities: TSpeciality[];
  workingHours: TWorkingHour[];
  priceRange: TPriceRange;
  rating: number;
  reviewCount: number;
  longitude?: number;
  latitude?: number;
  emergency: boolean;
  isClaimed?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TVetFilters = {
  emirate?: TEmirate;
  speciality?: TSpeciality;
  search?: string;
};
// API Response type
export interface ApiResponse {
  data: TVet[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

///import wizard
export interface ParsedHealthRecord {
  // type: "vaccine" | "vet-visit" | "medication" | "grooming" | "other";
  type: THealthRecordType;
  title: string;
  date: string;
  nextDueDate?: string;
  notes?: string;
  cost?: number;
  vetName?: string;
  clinicName?: string;
}

export interface ParseResult {
  records: ParsedHealthRecord[];
  summary: string;
}

// Input can be files, text, or both
export interface ParseInput {
  files?: File[];
  text?: string;
}

//Insurance
//     Insurance Constants (mirrors backend)
export const COVERAGE_TYPES = [
  "accidents",
  "illness",
  "surgery",
  "dental",
  "hereditary",
  "wellness",
  "thirdParty",
  "travel",
  "cancer",
  "hospitalization",
] as const;

export const INSURANCE_BADGES = [
  "mostPopular",
  "trusted",
  "bestForPuppies",
  "mostFlexible",
  "bestPreventive",
  "budgetPick",
] as const;

export const PET_TYPES = ["dog", "cat", "bird", "rabbit", "other"] as const;

export type TCoverageFlag = (typeof COVERAGE_TYPES)[number];
export type TInsuranceBadge = (typeof INSURANCE_BADGES)[number];
export type TPetType = (typeof PET_TYPES)[number];

//     Coverage label map (used in UI)
export const COVERAGE_LABELS: Record<TCoverageFlag, string> = {
  accidents: "Accidents",
  illness: "Illness",
  surgery: "Surgery",
  dental: "Dental",
  hereditary: "Hereditary",
  wellness: "Wellness",
  thirdParty: "3rd Party Liability",
  travel: "Travel",
  cancer: "Cancer",
  hospitalization: "Hospitalization",
};

//     Badge to UI display mapping
export const BADGE_DISPLAY: Record<TInsuranceBadge, string> = {
  mostPopular: "Most Popular",
  trusted: "Trusted",
  bestForPuppies: "Best for Puppies",
  mostFlexible: "Most Flexible",
  bestPreventive: "Best Preventive",
  budgetPick: "Budget Pick",
};

//     Badge color mapping
export const BADGE_COLORS: Record<TInsuranceBadge, string> = {
  mostPopular:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  trusted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  bestForPuppies:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  mostFlexible:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  bestPreventive:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  budgetPick:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

//     Provider
export type TInsuranceProvider = {
  _id: string;
  name: string;
  logo: string;
  badge?: TInsuranceBadge;
  priceFrom: number;
  priceTo: number;
  annualLimit: number;
  reimbursement: number;
  claimsIn: string;
  coverageScore: number;
  maxAgeYears: number;
  minAgeWeeks: number;
  pets: TPetType[];
  plans: string[];
  coverageFlags: TCoverageFlag[];
  coveredConditions: string[];
  excludedConditions: string[];
  highlights: string[];
  website: string;
  phone: string;
  email: string;
  about: string;
  avgRating: number;
  reviewCount: number;
  createdAt?: string;
  updatedAt?: string;
};

//     Review
export type TInsuranceReview = {
  _id: string;
  provider: string;
  user: string;
  userName: string;
  rating: number;
  text: string;
  planUsed?: string;
  createdAt: string;
  updatedAt?: string;
};

//     Review response with stats
export type TInsuranceReviewResponse = {
  reviews: TInsuranceReview[];
  avgRating: number;
  count: number;
};

//     AI Recommendation
export type TAIRecommendationResult = {
  topProvider: string;
  recommendation: string;
  reasoning: string;
  tips: string[];
};

export type TAIRecommendationForm = {
  petName: string;
  species: string;
  breed: string;
  ageYears: string;
  existingConditions: string;
  budget: string;
};

//     RTK API response wrappers
export type TApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

//     Badge color helper
export function getBadgeColorClass(badge?: TInsuranceBadge): string {
  const colorMap: Record<TInsuranceBadge, string> = {
    mostPopular:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    trusted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    bestForPuppies:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    mostFlexible:
      "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    bestPreventive:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    budgetPick:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  };
  return badge ? colorMap[badge] : colorMap.mostPopular;
}

export function getBadgeDisplay(badge?: TInsuranceBadge): string {
  if (!badge) return "";
  return BADGE_DISPLAY[badge];
}

//   Lost & Found
export const LF_POST_TYPES = ["lost", "found"] as const;
export const LF_SPECIES = [
  "dog",
  "cat",
  "bird",
  "rabbit",
  "reptile",
  "other",
] as const;
export const LF_EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
] as const;

export type TLFPostType = (typeof LF_POST_TYPES)[number];
export type TLFSpecies = (typeof LF_SPECIES)[number];
export type TLFEmirate = (typeof LF_EMIRATES)[number];

export type TLostFoundPost = {
  _id: string;
  postedBy: { _id: string; name: string; email: string; profilePhoto?: string };
  posterName: string;
  posterPhone: string;
  type: TLFPostType;
  status: "active" | "resolved";
  petName?: string;
  species: TLFSpecies;
  breed?: string;
  color: string;
  description: string;
  emirate: TLFEmirate;
  area: string;
  dateLostFound: string;
  photos: string[];
  microchipNumber?: string;
  reward?: number;
  createdAt: string;
};

export type TCreateLostFoundPayload = {
  type: TLFPostType;
  petName?: string;
  species: TLFSpecies;
  breed?: string;
  color: string;
  description: string;
  emirate: TLFEmirate;
  area: string;
  dateLostFound: string;
  posterPhone: string;
  photos?: string[];
  microchipNumber?: string;
  reward?: number;
};
