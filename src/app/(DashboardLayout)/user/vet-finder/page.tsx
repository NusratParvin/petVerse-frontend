"use client";

import { useState } from "react";
import Link from "next/link";
import { TEmirate, TSpeciality, TVet } from "@/src/types";
import { useGetVetsQuery } from "@/src/redux/features/vets/vetsApi";

const EMIRATES: { value: TEmirate | ""; label: string }[] = [
  { value: "", label: "All Emirates" },
  { value: "dubai", label: "Dubai" },
  { value: "abu-dhabi", label: "Abu Dhabi" },
  { value: "sharjah", label: "Sharjah" },
  { value: "ajman", label: "Ajman" },
  { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
  { value: "fujairah", label: "Fujairah" },
  { value: "umm-al-quwain", label: "Umm Al Quwain" },
];

const SPECIALITIES: { value: TSpeciality | ""; label: string }[] = [
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

const SPECIALITY_EMOJI: Record<string, string> = {
  dogs: "🐕",
  cats: "🐈",
  birds: "🦜",
  fish: "🐠",
  rabbits: "🐇",
  reptiles: "🦎",
  exotic: "🦋",
  emergency: "🚨",
  surgery: "🔬",
  dental: "🦷",
  dermatology: "🩺",
  ophthalmology: "👁️",
  "small-animals": "🐹",
  nutrition: "🥗",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-[#F5D020]" : "text-white/20"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-white/60 text-xs ml-1">({rating.toFixed(1)})</span>
    </div>
  );
}

function VetCard({ vet }: { vet: TVet }) {
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayHours = vet.workingHours?.find((h) => h.day === todayName);
  const isOpenToday = todayHours && !todayHours.closed;

  return (
    <Link href={`/user/vets/${vet._id}`}>
      <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#4682B4]/50 hover:bg-white/10 transition-all duration-300 cursor-pointer">
        {/* Cover Photo */}
        <div className="relative h-36 overflow-hidden bg-white/5">
          {vet.coverPhoto ? (
            <img
              src={vet.coverPhoto}
              alt={vet.clinicName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
              🏥
            </div>
          )}
          {/* Claimed badge */}
          {vet.isClaimed && (
            <div className="absolute top-2 right-2 bg-[#00E5CC]/20 border border-[#00E5CC]/40 text-[#00E5CC] text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
              ✓ Claimed
            </div>
          )}
          {/* Open/Closed badge */}
          <div
            className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm border ${isOpenToday ? "bg-green-500/20 border-green-500/40 text-green-400" : "bg-red-500/20 border-red-500/40 text-red-400"}`}
          >
            {isOpenToday
              ? `Open · ${todayHours!.open}–${todayHours!.close}`
              : "Closed Today"}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm leading-tight truncate">
            {vet.clinicName}
          </h3>
          <p className="text-white/50 text-xs mt-0.5 truncate">
            {vet.area},{" "}
            {vet.emirate
              .split("-")
              .map((w) => w[0].toUpperCase() + w.slice(1))
              .join(" ")}
          </p>

          <div className="mt-2">
            <StarRating rating={vet.rating} />
            <p className="text-white/40 text-[10px] mt-0.5">
              {vet.reviewCount} reviews
            </p>
          </div>

          {/* Specialities */}
          <div className="flex flex-wrap gap-1 mt-3">
            {vet.specialities.slice(0, 4).map((s) => (
              <span
                key={s}
                className="text-[10px] bg-[#4682B4]/20 border border-[#4682B4]/30 text-[#4682B4] px-1.5 py-0.5 rounded-full"
              >
                {SPECIALITY_EMOJI[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
            ))}
            {vet.specialities.length > 4 && (
              <span className="text-[10px] text-white/30">
                +{vet.specialities.length - 4}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <span className="text-white/50 text-xs">{vet.phone}</span>
            {vet.serviceRates?.length > 0 && (
              <span className="text-[#B8FF2E] text-xs font-medium">
                AED {vet.serviceRates[0].priceFrom}+
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function VetFinderPage() {
  const [emirate, setEmirate] = useState<TEmirate | "">("");
  const [speciality, setSpeciality] = useState<TSpeciality | "">("");
  const [search, setSearch] = useState("");

  const { data: vets, isLoading } = useGetVetsQuery(
    {
      emirate: emirate || undefined,
      speciality: speciality || undefined,
      search: search || undefined,
    },
    { refetchOnMountOrArgChange: true },
  );

  const inputClass =
    "bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4682B4]/60 focus:bg-white/10 transition-all placeholder:text-white/30";

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1
          className="text-white text-2xl font-bold"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Find a Vet 🏥
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Browse verified veterinary clinics across all 7 UAE emirates
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search clinic or area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} flex-1`}
        />
        <select
          value={emirate}
          onChange={(e) => setEmirate(e.target.value as TEmirate | "")}
          className={`${inputClass} min-w-[160px]`}
        >
          {EMIRATES.map((e) => (
            <option key={e.value} value={e.value} className="bg-[#020812]">
              {e.label}
            </option>
          ))}
        </select>
        <select
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value as TSpeciality | "")}
          className={`${inputClass} min-w-[180px]`}
        >
          {SPECIALITIES.map((s) => (
            <option key={s.value} value={s.value} className="bg-[#020812]">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-white/40 text-xs -mt-3">
          {vets?.length ?? 0} clinic{vets?.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/5 border border-white/5 h-64 animate-pulse"
            />
          ))}
        </div>
      ) : vets && vets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vets.map((vet: TVet) => (
            <VetCard key={vet._id} vet={vet} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-white/50 text-sm">
            No vets found for your filters.
          </p>
          <button
            onClick={() => {
              setEmirate("");
              setSpeciality("");
              setSearch("");
            }}
            className="mt-3 text-[#4682B4] text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
