"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetSingleVetQuery } from "@/redux/features/vets/vetsApi";

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

export default function PublicVetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: vet, isLoading } = useGetSingleVetQuery(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020812] flex items-center justify-center">
        <div className="text-white/40 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!vet) {
    return (
      <div className="min-h-screen bg-[#020812] flex flex-col items-center justify-center gap-4">
        <p className="text-white/50">Clinic not found.</p>
        <Link href="/vets" className="text-[#4682B4] hover:underline text-sm">
          ← Back to Vet Finder
        </Link>
      </div>
    );
  }

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayHours = vet.workingHours?.find((h) => h.day === todayName);
  const isOpenToday = todayHours && !todayHours.closed;
  const formatEmirate = (e: string) =>
    e
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div className="min-h-screen bg-[#020812]">
      {/* Nav */}
      <nav className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-[#020812]/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-[#F5D020] font-bold text-xl"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            PetVerse UAE
          </Link>
          <Link
            href="/vets"
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            ← All Clinics
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10 mb-6">
          {vet.coverPhoto ? (
            <img
              src={vet.coverPhoto}
              alt={vet.clinicName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center text-7xl opacity-10">
              🏥
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020812] via-[#020812]/40 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <div className="flex items-center gap-3 mb-1">
              {vet.isClaimed && (
                <span className="bg-[#00E5CC]/20 border border-[#00E5CC]/40 text-[#00E5CC] text-xs px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${isOpenToday ? "bg-green-500/20 border-green-500/30 text-green-400" : "bg-red-500/20 border-red-500/30 text-red-400"}`}
              >
                {isOpenToday
                  ? `Open · Closes ${todayHours!.close}`
                  : "Closed Today"}
              </span>
            </div>
            <h1
              className="text-white text-3xl font-bold"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {vet.clinicName}
            </h1>
            <p className="text-white/60">
              {vet.area}, {formatEmirate(vet.emirate)}
            </p>
          </div>
        </div>

        {/* Rating bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg
                key={s}
                className={`w-5 h-5 ${s <= Math.round(vet.rating) ? "text-[#F5D020]" : "text-white/20"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-white font-semibold ml-2">
              {vet.rating.toFixed(1)}
            </span>
            <span className="text-white/40 text-sm ml-1">
              ({vet.reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {vet.about && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2
                  className="text-white font-semibold mb-3"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  About
                </h2>
                <p className="text-white/60 leading-relaxed">{vet.about}</p>
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2
                className="text-white font-semibold mb-4"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Specialities
              </h2>
              <div className="flex flex-wrap gap-2">
                {vet.specialities.map((s) => (
                  <span
                    key={s}
                    className="bg-[#4682B4]/15 border border-[#4682B4]/30 text-[#4682B4] px-3 py-1.5 rounded-full text-sm"
                  >
                    {SPECIALITY_EMOJI[s]}{" "}
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            {vet.serviceRates?.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2
                  className="text-white font-semibold mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Service Rates (AED)
                </h2>
                <div className="divide-y divide-white/5">
                  {vet.serviceRates.map((r, i) => (
                    <div key={i} className="flex justify-between py-3">
                      <span className="text-white/70">{r.service}</span>
                      <span className="text-[#B8FF2E] font-semibold">
                        {r.priceFrom} – {r.priceTo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {vet.googleMapsUrl && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2
                  className="text-white font-semibold mb-3"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Location
                </h2>
                <p className="text-white/50 text-sm mb-4">{vet.address}</p>
                <a
                  href={vet.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#4682B4]/20 border border-[#4682B4]/30 text-[#4682B4] px-5 py-2.5 rounded-xl hover:bg-[#4682B4]/30 transition-colors"
                >
                  📍 Open in Google Maps
                </a>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-5">
            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${vet.phone}`}
                className="flex items-center justify-center gap-2 bg-[#B8FF2E] text-[#020812] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                📞 Call Now
              </a>
              {vet.whatsapp && (
                <a
                  href={`https://wa.me/${vet.whatsapp.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#00E5CC]/20 border border-[#00E5CC]/40 text-[#00E5CC] font-semibold py-3 rounded-xl hover:bg-[#00E5CC]/30 transition-colors"
                >
                  💬 WhatsApp
                </a>
              )}
            </div>

            {/* Contact */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2
                className="text-white font-semibold text-sm mb-3"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Contact Info
              </h2>
              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex items-center gap-2 text-white/60">
                  📞 <span>{vet.phone}</span>
                </div>
                {vet.email && (
                  <div className="flex items-center gap-2 text-white/60">
                    ✉️ <span>{vet.email}</span>
                  </div>
                )}
                {vet.website && (
                  <a
                    href={vet.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#4682B4] hover:underline"
                  >
                    🌐 <span>Visit Website</span>
                  </a>
                )}
              </div>
            </div>

            {/* Hours */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2
                className="text-white font-semibold text-sm mb-3"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Working Hours
              </h2>
              <div className="space-y-1.5">
                {vet.workingHours?.map((h) => (
                  <div
                    key={h.day}
                    className={`flex justify-between text-xs ${h.day === todayName ? "text-[#B8FF2E] font-semibold" : "text-white/50"}`}
                  >
                    <span>{h.day}</span>
                    <span>
                      {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Claim */}
            {!vet.isClaimed && (
              <div className="rounded-2xl border border-dashed border-white/10 p-4 text-center">
                <p className="text-white/30 text-xs mb-2">Own this clinic?</p>
                <button className="text-[#4682B4] text-sm hover:underline font-medium">
                  Claim Your Listing →
                </button>
              </div>
            )}

            {/* Sign up nudge */}
            <div className="rounded-2xl border border-[#4682B4]/20 bg-[#4682B4]/5 p-4 text-center">
              <p className="text-white/60 text-xs mb-3">
                Track your pet's vet visits with PetVerse
              </p>
              <Link
                href="/register"
                className="inline-block bg-[#B8FF2E] text-[#020812] font-bold text-sm px-4 py-2 rounded-xl hover:opacity-90 transition-opacity w-full"
              >
                Sign Up Free →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
