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
  breed?: string;
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
  files?: File[]; // actual File objects from the browser input
  text?: string;
}

//Insurance
// src/data/insuranceProviders.ts
// Shared across Compare page and Detail page

export type CoverageFlag =
  | "accidents"
  | "illness"
  | "surgery"
  | "dental"
  | "hereditary"
  | "wellness"
  | "thirdParty"
  | "travel"
  | "cancer"
  | "hospitalization";

export type Provider = {
  id: string;
  name: string;
  logo: string;
  badge: string;
  badgeColor: "lime" | "blue" | "coral" | "teal" | "yellow";
  priceFrom: number;
  priceTo: number;
  annualLimit: string;
  reimbursement: string;
  claimsIn: string;
  coverageScore: number; // 0-100 for the progress bar
  maxAgeYears: number;
  minAgeWeeks: number;
  pets: string[];
  plans: string[];
  coverageFlags: CoverageFlag[];
  coveredConditions: string[];
  excludedConditions: string[];
  highlights: string[]; // 4 short bullet points for the card
  website: string;
  phone: string;
  email: string;
  about: string;
};

export const PROVIDERS: Provider[] = [
  {
    id: "1",
    name: "GIG Gulf (AXA)",
    logo: "🛡️",
    badge: "Most Popular",
    badgeColor: "lime",
    priceFrom: 90,
    priceTo: 250,
    annualLimit: "AED 30,000",
    reimbursement: "80%",
    claimsIn: "3–5 working days",
    coverageScore: 80,
    maxAgeYears: 10,
    minAgeWeeks: 8,
    pets: ["dog", "cat"],
    plans: ["Essential", "Plus", "Premier"],
    coverageFlags: [
      "accidents",
      "illness",
      "surgery",
      "hereditary",
      "travel",
      "cancer",
      "hospitalization",
    ],
    coveredConditions: [
      "Hip Dysplasia",
      "Cancer",
      "Diabetes",
      "Epilepsy",
      "Allergies",
      "Arthritis",
    ],
    excludedConditions: [
      "Pre-existing conditions (Essential plan)",
      "Breeding costs",
      "Cosmetic procedures",
      "Dental (Essential plan)",
    ],
    highlights: [
      "Lifetime cover for dogs & cats",
      "Accidents, illness & surgery",
      "Travel coverage add-on",
      "24/7 customer support",
    ],
    website: "https://www.giggulf.ae",
    phone: "+971 4 270 8000",
    email: "petinsurance@giggulf.ae",
    about:
      "GIG Gulf, formerly AXA Gulf, is one of the UAE's most trusted insurers with 20+ years in market. Their pet plans offer comprehensive tiered coverage with flexible options to suit all budgets and pet needs.",
  },
  {
    id: "2",
    name: "Sukoon Insurance",
    logo: "🌿",
    badge: "Trusted 50 Years",
    badgeColor: "blue",
    priceFrom: 110,
    priceTo: 300,
    annualLimit: "AED 25,000",
    reimbursement: "85%",
    claimsIn: "3–5 working days",
    coverageScore: 85,
    maxAgeYears: 9,
    minAgeWeeks: 8,
    pets: ["dog", "cat"],
    plans: ["Silver", "Gold", "Platinum"],
    coverageFlags: [
      "accidents",
      "illness",
      "surgery",
      "hereditary",
      "cancer",
      "hospitalization",
      "dental",
    ],
    coveredConditions: [
      "Hip Dysplasia",
      "Cancer",
      "Heart Disease",
      "Diabetes",
      "Epilepsy",
      "Skin Conditions",
    ],
    excludedConditions: [
      "Pre-existing conditions",
      "Elective surgery",
      "Parasites (Silver plan)",
      "Behavioral therapy",
    ],
    highlights: [
      "Cashless at 2,000+ UAE clinics",
      "A-rated by S&P & AM Best",
      "Accident & illness cover",
      "Direct billing network",
    ],
    website: "https://www.sukoon.com",
    phone: "+971 4 233 7373",
    email: "care@sukoon.com",
    about:
      "Sukoon (formerly Oman Insurance) has protected UAE residents for 50 years. Their pet plans feature the widest vet network in the country with cashless settlement at partner clinics across all 7 emirates.",
  },
  {
    id: "3",
    name: "Gargash Insurance",
    logo: "🐾",
    badge: "Best for Puppies",
    badgeColor: "coral",
    priceFrom: 75,
    priceTo: 200,
    annualLimit: "AED 30,000",
    reimbursement: "75%",
    claimsIn: "5–7 working days",
    coverageScore: 75,
    maxAgeYears: 8,
    minAgeWeeks: 12,
    pets: ["dog", "cat"],
    plans: ["Basic", "Comprehensive"],
    coverageFlags: [
      "accidents",
      "illness",
      "surgery",
      "thirdParty",
      "hospitalization",
    ],
    coveredConditions: [
      "Fractures",
      "Infections",
      "Digestive issues",
      "Eye conditions",
      "Ear infections",
    ],
    excludedConditions: [
      "Pre-existing conditions",
      "Hereditary conditions",
      "Dental",
      "Cancer (Basic plan)",
      "Behavioral therapy",
    ],
    highlights: [
      "Covers pets from 12 weeks old",
      "Surgery & hospitalisation",
      "3rd party liability included",
      "Dogs & cats up to 8 years",
    ],
    website: "https://www.gargashinsurance.com",
    phone: "+971 4 212 0000",
    email: "pets@gargashinsurance.com",
    about:
      "Gargash Insurance is an established UAE broker with over 30 years experience. Their pet plans are designed to be accessible and affordable, especially suited for young pets and first-time pet owners.",
  },
  {
    id: "4",
    name: "MetLife UAE",
    logo: "💼",
    badge: "Most Flexible",
    badgeColor: "teal",
    priceFrom: 120,
    priceTo: 400,
    annualLimit: "AED 30,000",
    reimbursement: "90%",
    claimsIn: "3–5 working days",
    coverageScore: 90,
    maxAgeYears: 12,
    minAgeWeeks: 8,
    pets: ["dog", "cat"],
    plans: ["Core", "Enhanced", "Premium"],
    coverageFlags: [
      "accidents",
      "illness",
      "surgery",
      "hereditary",
      "cancer",
      "hospitalization",
      "dental",
      "wellness",
    ],
    coveredConditions: [
      "Hip Dysplasia",
      "Cancer",
      "Heart Disease",
      "Diabetes",
      "Epilepsy",
      "Hereditary conditions",
      "Chronic illness",
    ],
    excludedConditions: [
      "Cosmetic procedures",
      "Breeding costs",
      "Pre-existing (Core plan)",
    ],
    highlights: [
      "Highest reimbursement at 90%",
      "Customizable coverage limits",
      "Covers pets up to 12 years",
      "Wellness add-on available",
    ],
    website: "https://www.metlife.ae",
    phone: "+971 4 423 8000",
    email: "petcare@metlife.ae",
    about:
      "MetLife UAE brings global insurance expertise to UAE pet owners. Known for the highest reimbursement rates in the market and flexible plans that can be customized to match any pet's profile and owner budget.",
  },
  {
    id: "5",
    name: "PetAssure (Bupa)",
    logo: "🏥",
    badge: "Best Preventive",
    badgeColor: "yellow",
    priceFrom: 95,
    priceTo: 220,
    annualLimit: "AED 20,000",
    reimbursement: "80%",
    claimsIn: "3–5 working days",
    coverageScore: 78,
    maxAgeYears: 9,
    minAgeWeeks: 8,
    pets: ["dog", "cat"],
    plans: ["Wellness", "Wellness Plus"],
    coverageFlags: [
      "accidents",
      "illness",
      "wellness",
      "hospitalization",
      "surgery",
    ],
    coveredConditions: [
      "Infections",
      "Digestive issues",
      "Skin conditions",
      "Eye conditions",
      "Routine illness",
    ],
    excludedConditions: [
      "Hereditary conditions",
      "Cancer (Wellness plan)",
      "Pre-existing conditions",
      "Dental",
      "Hip Dysplasia",
    ],
    highlights: [
      "Wellness checks & vaccines covered",
      "Routine parasite control",
      "Cashless at partner clinics",
      "Preventive-first approach",
    ],
    website: "https://www.bupa.ae",
    phone: "+971 4 217 5000",
    email: "petassure@bupa.ae",
    about:
      "PetAssure backed by Bupa focuses on preventative care — keeping pets healthy before issues arise. Ideal for owners who want routine care covered alongside standard accident and illness protection.",
  },
  {
    id: "6",
    name: "InsuranceMarket.ae",
    logo: "📊",
    badge: "Compare & Save",
    badgeColor: "blue",
    priceFrom: 85,
    priceTo: 180,
    annualLimit: "AED 15,000",
    reimbursement: "70%",
    claimsIn: "5–7 working days",
    coverageScore: 70,
    maxAgeYears: 8,
    minAgeWeeks: 12,
    pets: ["dog", "cat", "other"],
    plans: ["Accident Only", "Accident & Illness"],
    coverageFlags: ["accidents", "illness", "thirdParty", "surgery"],
    coveredConditions: [
      "Fractures",
      "Bite injuries",
      "Accidental poisoning",
      "Road traffic injuries",
      "Burns",
    ],
    excludedConditions: [
      "Pre-existing conditions",
      "Hereditary conditions",
      "Cancer",
      "Dental",
      "Wellness",
      "Chronic illness",
    ],
    highlights: [
      "30+ years UAE experience",
      "Accident & illness coverage",
      "3rd party injury & damage",
      "Multiple insurer network",
    ],
    website: "https://insurancemarket.ae/pet-insurance",
    phone: "+971 4 432 7331",
    email: "pets@insurancemarket.ae",
    about:
      "InsuranceMarket.ae is a UAE broker with 30+ years experience, offering access to multiple pet insurers through a single platform. Best for owners looking for basic affordable accident coverage.",
  },
];

// Helper: badge colour → Tailwind classes
export function badgeClasses(color: Provider["badgeColor"]) {
  const map: Record<Provider["badgeColor"], string> = {
    lime: "bg-[#B8FF2E] text-black",
    blue: "bg-[#4682B4] text-white",
    coral: "bg-[#FF4D6D] text-white",
    teal: "bg-[#00E5CC] text-black",
    yellow: "bg-[#F5D020] text-black",
  };
  return map[color];
}

// Human-readable labels for coverage flags
export const COVERAGE_LABELS: Record<CoverageFlag, string> = {
  accidents: "Accidents",
  illness: "Illness",
  surgery: "Surgery",
  dental: "Dental",
  hereditary: "Hereditary",
  wellness: "Wellness",
  thirdParty: "3rd Party",
  travel: "Travel",
  cancer: "Cancer",
  hospitalization: "Hospitalisation",
};
