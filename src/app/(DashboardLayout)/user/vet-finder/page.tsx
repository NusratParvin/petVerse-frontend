"use client";

import { useState } from "react";
import Link from "next/link";
import { speciesEmoji, TEmirate, TSpeciality, TVet } from "@/src/types";
import { useGetVetsQuery } from "@/src/redux/features/vets/vetsApi";
import { EMIRATES } from "@/src/constant";
import { Rating } from "next-flex-rating";
import { formatEmirateName } from "./components/utils";

import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Skeleton,
  Divider,
} from "@heroui/react";

import { Search, MapPin, SlidersHorizontal, X, Phone } from "lucide-react";

/* ─── Constants ─────────────────────────────────────────────── */
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

/* ─── VetCard ───────────────────────────────────────────────── */
function VetCard({ vet }: { vet: TVet }) {
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayHours = vet.workingHours?.find((h) => h.day === todayName);
  const isOpenToday = todayHours && !todayHours.closed;

  // Cap at 3 chips so they never overflow the card
  const visibleSpecs = vet.specialities.slice(0, 3);
  const extraCount = vet.specialities.length - 3;

  return (
    <Link href={`/user/vet-finder/${vet._id}`} className="block w-full">
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
}

/* ─── Skeleton card ─────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <Card
      shadow="none"
      className="border border-default-200 dark:border-default-100/10 overflow-hidden w-full"
    >
      <Skeleton className="h-40 w-full rounded-none" />
      <CardBody className="p-3.5 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-3 w-1/2 rounded-lg" />
        <Skeleton className="h-3 w-20 rounded-lg" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-3 w-28 rounded-lg" />
      </CardBody>
    </Card>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function VetFinderPage() {
  const [emirate, setEmirate] = useState<TEmirate | "">("");
  const [speciality, setSpeciality] = useState<TSpeciality | "">("");
  const [search, setSearch] = useState("");

  const hasFilters = !!(emirate || speciality || search);

  const { data: vetsInfo, isLoading } = useGetVetsQuery(
    {
      emirate: emirate || undefined,
      speciality: speciality || undefined,
      search: search || undefined,
    },
    { refetchOnMountOrArgChange: true },
  );
  const vets = vetsInfo?.data ?? [];

  const clearFilters = () => {
    setEmirate("");
    setSpeciality("");
    setSearch("");
  };

  return (
    /* w-full + min-w-0 ensures the page never pushes wider than its container */
    <div className="flex flex-col gap-5 p-4 sm:p-6 w-full min-w-0">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 min-w-0">
        <div className="min-w-0">
          <h1 className="text-default-900 dark:text-default-100 text-2xl font-bold tracking-tight flex items-center gap-2">
            Find a Vet <span>🏥</span>
          </h1>
          <p className="text-default-400 text-sm mt-0.5">
            Browse verified veterinary clinics across all 7 UAE emirates
          </p>
        </div>
        {!isLoading && (
          <p className="text-default-400 text-xs shrink-0 sm:pb-0.5">
            {vets.length} clinic{vets.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-2 w-full min-w-0">
        <Input
          placeholder="Search clinic or area..."
          value={search}
          onValueChange={setSearch}
          startContent={
            <Search className="w-4 h-4 text-default-400 shrink-0" />
          }
          isClearable
          onClear={() => setSearch("")}
          variant="bordered"
          size="sm"
          radius="lg"
          classNames={{
            base: "flex-1 min-w-0",
            inputWrapper:
              "border-default-200 dark:border-default-100/10 hover:border-primary/50 data-[focus=true]:border-primary bg-white dark:bg-default-50/5",
          }}
        />

        <Select
          placeholder="All Emirates"
          selectedKeys={emirate ? [emirate] : []}
          onSelectionChange={(keys) =>
            setEmirate((Array.from(keys)[0] as TEmirate) ?? "")
          }
          variant="bordered"
          size="sm"
          radius="lg"
          startContent={
            <MapPin className="w-4 h-4 text-default-400 shrink-0" />
          }
          classNames={{
            base: "w-full sm:w-44 shrink-0",
            trigger:
              "border-default-200 dark:border-default-100/10 hover:border-primary/50 data-[open=true]:border-primary bg-white dark:bg-default-50/5",
          }}
        >
          {EMIRATES.map((e) => (
            <SelectItem key={e.value} value={e.value}>
              {e.label}
            </SelectItem>
          ))}
        </Select>

        <Select
          placeholder="All Specialities"
          selectedKeys={speciality ? [speciality] : []}
          onSelectionChange={(keys) =>
            setSpeciality((Array.from(keys)[0] as TSpeciality) ?? "")
          }
          variant="bordered"
          size="sm"
          radius="lg"
          startContent={
            <SlidersHorizontal className="w-4 h-4 text-default-400 shrink-0" />
          }
          classNames={{
            base: "w-full sm:w-48 shrink-0",
            trigger:
              "border-default-200 dark:border-default-100/10 hover:border-primary/50 data-[open=true]:border-primary bg-white dark:bg-default-50/5",
          }}
        >
          {SPECIALITIES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </Select>

        {hasFilters && (
          <Button
            variant="flat"
            color="default"
            size="sm"
            radius="lg"
            startContent={<X className="w-3.5 h-3.5" />}
            onPress={clearFilters}
            className="shrink-0 w-full sm:w-auto"
          >
            Clear
          </Button>
        )}
      </div>

      {/* ── Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : vets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {vets.map((vet: TVet) => (
            <VetCard key={vet._id} vet={vet} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <span className="text-5xl select-none">🔍</span>
          <div>
            <p className="text-default-600 dark:text-default-400 text-sm font-medium">
              No clinics match your filters
            </p>
            <p className="text-default-400 text-xs mt-1">
              Try adjusting your search or clearing filters
            </p>
          </div>
          <Button
            variant="flat"
            color="primary"
            size="sm"
            radius="lg"
            onPress={clearFilters}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
