import { speciesEmoji, TVet } from "@/src/types";
import { Card, CardBody, Divider } from "@heroui/react";
import { MapPin, Phone } from "lucide-react";
import { Rating } from "next-flex-rating";
import Link from "next/link";
import { formatEmirateName } from "./utils";

const VetCard = ({ vet }: { vet: TVet }) => {
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayHours = vet.workingHours?.find((h) => h.day === todayName);
  const isOpenToday = todayHours && !todayHours.closed;

  // Cap at 3 chips so they never overflow the card
  const visibleSpecs = vet.specialities.slice(0, 3);
  const extraCount = vet.specialities.length - 3;

  return (
    <Link
      href={`/user/quickAccess/vet-finder/${vet._id}`}
      className="block w-full"
    >
      <Card
        isPressable
        shadow="none"
        className="group w-full border border-default-200 dark:border-default-100/10
                   hover:border-primary/50 hover:shadow-md dark:hover:shadow-primary/5
                   transition-all duration-300 bg-white dark:bg-default-50/5 overflow-hidden"
      >
        {/* ── Photo — fixed height, overflow hidden on parent ── */}
        <div className="relative w-full h-40 shrink-0 overflow-hidden bg-default-100 dark:bg-default-50/5">
          {vet.coverPhoto ? (
            <img
              src={vet.coverPhoto}
              alt={vet.clinicName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-20 select-none">
              🏥
            </div>
          )}

          {/* subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

          {/* Open/Closed — top-left */}
          <span
            className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full
              backdrop-blur-sm border leading-tight
              ${
                isOpenToday
                  ? "bg-green-500/20 border-green-400/50 text-green-700 dark:text-green-400"
                  : "bg-red-500/20 border-red-400/50 text-red-700 dark:text-red-400"
              }`}
          >
            {isOpenToday
              ? `Open · ${todayHours!.open}–${todayHours!.close}`
              : "Closed Today"}
          </span>

          {/* Verified — top-right */}
          {vet.isClaimed && (
            <span
              className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5
              rounded-full backdrop-blur-sm border bg-primary/20 border-primary/40 text-primary leading-tight"
            >
              ✓ Verified
            </span>
          )}
        </div>

        {/* ── Body ── */}
        <CardBody className="p-3.5 flex flex-col gap-2 min-w-0">
          {/* Name + location */}
          <div className="min-w-0">
            <h3
              className="text-default-900 dark:text-default-100 font-semibold text-sm
                           leading-snug truncate"
            >
              {vet.clinicName}
            </h3>
            <p className="flex items-center gap-1 text-default-400 text-xs mt-0.5 min-w-0">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {vet.area}, {formatEmirateName(vet.emirate)}
              </span>
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Rating value={vet.rating} readOnly size={13} />
            <span className="text-default-400 text-[11px] shrink-0">
              ({vet.reviewCount ?? 0})
            </span>
          </div>

          {/* Speciality chips — hard-limited to 3 */}
          <div className="flex flex-wrap gap-1">
            {visibleSpecs.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-0.5 whitespace-nowrap
                           text-[10px] font-medium px-2 py-0.5 rounded-full
                           bg-primary/10 dark:bg-primary/15 border border-primary/25 text-primary"
              >
                {speciesEmoji[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
            ))}
            {extraCount > 0 && (
              <span
                className="inline-flex items-center whitespace-nowrap
                               text-[10px] px-2 py-0.5 rounded-full
                               bg-default-100 dark:bg-default-100/10 text-default-400"
              >
                +{extraCount}
              </span>
            )}
          </div>

          <Divider className="opacity-40" />

          {/* Phone */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Phone className="w-3 h-3 text-default-400 shrink-0" />
            <span className="text-xs text-default-400 truncate">
              {vet.phone ?? "—"}
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};
export default VetCard;
