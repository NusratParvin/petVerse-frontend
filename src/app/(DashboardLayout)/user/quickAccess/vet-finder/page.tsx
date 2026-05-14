"use client";

import { useState } from "react";
import { TVet, TEmirate, TSpeciality } from "@/src/types";
import { Button } from "@heroui/react";

import VetCardLoader from "./components/vetCardLoader";
import VetCard from "./components/vetCard";
import VetFilters from "./components/vetFilterSection";
import { useGetVetsQuery } from "@/src/redux/features/vets/vetsApi";

/* Page Component */
const VetFinderPage = () => {
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
    <div className="flex flex-col gap-5 p-4 sm:p-6 w-full min-w-0">
      {/* Header */}
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

      {/* Filters Component */}
      <VetFilters
        emirate={emirate}
        speciality={speciality}
        search={search}
        onEmirateChange={setEmirate}
        onSpecialityChange={setSpeciality}
        onSearchChange={setSearch}
        onClear={clearFilters}
      />

      {/* Grid Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <VetCardLoader key={i} />
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
          {hasFilters && (
            <Button
              variant="flat"
              color="primary"
              size="sm"
              radius="lg"
              onPress={clearFilters}
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default VetFinderPage;
