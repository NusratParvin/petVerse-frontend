import { speciesEmoji, TVet } from "@/src/types";
import { Card, CardBody, Divider } from "@heroui/react";
import { DoorClosed, DoorOpen, MapPin, Phone } from "lucide-react";
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
        className="group w-full rounded-xl border border-default-200 dark:border-default-100/10
                 hover:border-steel-blue/40 hover:shadow-sm dark:hover:border-lime-burst/40
                 transition-all duration-200 bg-default-50 dark:bg-default-50/80 overflow-hidden"
      >
        {/* Cover photo + status bar */}
        <div className="relative w-full h-28 shrink-0 overflow-hidden bg-default-100 dark:bg-default-100/5">
          {vet.coverPhoto ? (
            <img
              src={vet.coverPhoto}
              alt={vet.clinicName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-10 select-none">
              🏥
            </div>
          )}

          <div
            className={`
            absolute bottom-0 left-0 right-0
            flex items-center gap-1.5 px-2.5 py-1.5
            border-t
            ${
              isOpenToday
                ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-950"
                : "bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-900"
            }
          `}
          >
            {/* Door icon — open door vs closed door */}
            {isOpenToday ? (
              <DoorOpen className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <DoorClosed className="w-3.5 h-3.5 shrink-0 text-red-500 dark:text-red-400" />
            )}

            <span
              className={`text-[11px] font-semibold ${
                isOpenToday
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isOpenToday ? "Open now" : "Closed"}
            </span>

            {/* Hours on the right */}
            <span
              className={`ml-auto text-[10px] ${
                isOpenToday
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-500"
              }`}
            >
              {isOpenToday
                ? `${todayHours!.open} – ${todayHours!.close}`
                : todayHours?.open
                  ? `Opens ${todayHours.open}`
                  : "—"}
            </span>
          </div>
        </div>

        {/* Body */}
        <CardBody className="p-3 flex flex-col gap-2 min-w-0">
          {/* Name + Location */}
          <div className="min-w-0">
            <h3 className="text-default-900 dark:text-white/90 font-semibold text-[12px] leading-snug truncate">
              {vet.clinicName}
            </h3>
            <p className="flex items-center gap-1 text-default-400 dark:text-default-500 text-[10px] mt-0.5 truncate">
              <MapPin className="w-2.5 h-2.5 shrink-0" />
              {vet.area}, {formatEmirateName(vet.emirate)}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Rating value={vet.rating} readOnly size={10} />
            <span className="text-default-400 dark:text-default-500 text-[11px]">
              {vet.rating?.toFixed(1)}{" "}
              <span className="opacity-90">({vet.reviewCount ?? 0})</span>
            </span>
          </div>

          {/* Speciality chips */}
          <div className="flex flex-wrap gap-1">
            {visibleSpecs.map((s) => (
              <span
                key={s}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full
                         bg-steel-blue/25 dark:bg-steel-blue/25
                         border border-primary/20 text-primary dark:text-white/90"
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-default-100 dark:bg-default-100/10 text-default-400">
                +{extraCount}
              </span>
            )}
          </div>

          <Divider className="opacity-30 bg-steel-blue/40 dark:bg-lime-burst/50" />

          {/* Phone */}
          <div className="flex items-center gap-1.5 ">
            <Phone className="w-2.5 h-2.5 text-steel-blue dark:text-lime-burst shrink-0" />
            <span className="text-[11px] text-steel-blue dark:text-lime-burst truncate font-medium">
              {vet.phone ?? "—"}
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};
export default VetCard;
