"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useGetSingleVetQuery } from "@/src/redux/features/vets/vetsApi";

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
          className={`w-4 h-4 ${star <= Math.round(rating) ? "text-[#F5D020]" : "text-white/20"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-white/60 text-sm ml-1">
        {rating.toFixed(1)} · {0} reviews
      </span>
    </div>
  );
}

export default function VetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: vet, isLoading } = useGetSingleVetQuery(id);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-48 rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-8 w-64 rounded-xl bg-white/5 animate-pulse" />
        <div className="h-4 w-48 rounded-xl bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (!vet) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-white/50">Vet not found.</p>
        <Link
          href="/user/vets"
          className="mt-3 text-[#4682B4] text-sm hover:underline"
        >
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
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors w-fit"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Vet Finder
      </button>

      {/* Cover Photo */}
      <div className="relative h-52 rounded-2xl overflow-hidden border border-white/10">
        {vet.coverPhoto ? (
          <img
            src={vet.coverPhoto}
            alt={vet.clinicName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-6xl opacity-20">
            🏥
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020812] via-transparent to-transparent" />
        <div className="absolute bottom-4 left-5">
          <h1
            className="text-white text-2xl font-bold"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            {vet.clinicName}
          </h1>
          <p className="text-white/60 text-sm">
            {vet.area}, {formatEmirate(vet.emirate)}
          </p>
        </div>
        {vet.isClaimed && (
          <div className="absolute top-4 right-4 bg-[#00E5CC]/20 border border-[#00E5CC]/40 text-[#00E5CC] text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
            ✓ Verified Clinic
          </div>
        )}
      </div>

      {/* Rating + Status */}
      <div className="flex flex-wrap items-center gap-4">
        <StarRating rating={vet.rating} />
        <div
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${isOpenToday ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}
        >
          {isOpenToday
            ? `Open Now · Closes ${todayHours!.close}`
            : "Closed Today"}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left col - main info */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* About */}
          {vet.about && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2
                className="text-white font-semibold text-sm mb-2"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                About
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {vet.about}
              </p>
            </div>
          )}

          {/* Specialities */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2
              className="text-white font-semibold text-sm mb-3"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Specialities
            </h2>
            <div className="flex flex-wrap gap-2">
              {vet.specialities.map((s) => (
                <span
                  key={s}
                  className="text-sm bg-[#4682B4]/15 border border-[#4682B4]/30 text-[#4682B4] px-3 py-1 rounded-full"
                >
                  {SPECIALITY_EMOJI[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              ))}
            </div>
          </div>

          {/* Service Rates */}
          {vet.serviceRates?.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2
                className="text-white font-semibold text-sm mb-3"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Service Rates
              </h2>
              <div className="flex flex-col gap-2">
                {vet.serviceRates.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-white/70 text-sm">{r.service}</span>
                    <span className="text-[#B8FF2E] text-sm font-medium">
                      AED {r.priceFrom} – {r.priceTo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {vet.googleMapsUrl && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2
                className="text-white font-semibold text-sm mb-3"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Location
              </h2>
              <p className="text-white/50 text-sm mb-3">{vet.address}</p>
              <a
                href={vet.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#4682B4]/20 border border-[#4682B4]/30 text-[#4682B4] text-sm px-4 py-2 rounded-xl hover:bg-[#4682B4]/30 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Open in Google Maps
              </a>
            </div>
          )}
        </div>

        {/* Right col - contact + hours */}
        <div className="flex flex-col gap-4">
          {/* Contact */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2
              className="text-white font-semibold text-sm mb-3"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Contact
            </h2>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${vet.phone}`}
                className="flex items-center gap-3 text-white/70 hover:text-white text-sm transition-colors"
              >
                <span className="text-base">📞</span> {vet.phone}
              </a>
              {vet.whatsapp && (
                <a
                  href={`https://wa.me/${vet.whatsapp.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#00E5CC] hover:text-[#00E5CC]/80 text-sm transition-colors"
                >
                  <span className="text-base">💬</span> WhatsApp
                </a>
              )}
              {vet.email && (
                <a
                  href={`mailto:${vet.email}`}
                  className="flex items-center gap-3 text-white/70 hover:text-white text-sm transition-colors"
                >
                  <span className="text-base">✉️</span> {vet.email}
                </a>
              )}
              {vet.website && (
                <a
                  href={vet.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#4682B4] hover:text-[#4682B4]/80 text-sm transition-colors"
                >
                  <span className="text-base">🌐</span> Website
                </a>
              )}
            </div>
          </div>

          {/* Working Hours */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2
              className="text-white font-semibold text-sm mb-3"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Working Hours
            </h2>
            <div className="flex flex-col gap-1.5">
              {vet.workingHours?.map((h) => (
                <div
                  key={h.day}
                  className={`flex justify-between text-xs ${h.day === todayName ? "text-[#B8FF2E] font-semibold" : "text-white/50"}`}
                >
                  <span>{h.day.slice(0, 3)}</span>
                  <span>{h.closed ? "Closed" : `${h.open} – ${h.close}`}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Claim listing CTA */}
          {!vet.isClaimed && (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-4 text-center">
              <p className="text-white/40 text-xs mb-2">Is this your clinic?</p>
              <button className="text-[#4682B4] text-sm hover:underline font-medium">
                Claim Your Listing →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
