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
  | "other";

export type THealthRecord = {
  _id: string;
  type: THealthRecordType;
  title: string;
  date: Date | string;
  nextDueDate?: Date | string;
  notes?: string;
  cost?: number;
  vetName?: string;
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
