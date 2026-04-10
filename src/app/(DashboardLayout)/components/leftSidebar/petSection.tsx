"use client";
import { useGetMyPetsQuery } from "@/src/redux/features/pets/petsApi";
import { speciesEmoji, TPet } from "@/src/types";
import { ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const PetSection = () => {
  const {
    data: myPets,
    isLoading,
    isError,
    error,
  } = useGetMyPetsQuery(undefined);
  const pathname = usePathname();

  const pets = myPets?.data || [];

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="px-3 pt-4 pb-2">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="h-3 w-16 bg-steel-blue/20 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-6 bg-steel-blue/20 dark:bg-white/10 rounded-full animate-pulse" />
        </div>

        {/* Pets List Skeleton */}
        <div className="rounded-xl overflow-hidden border-steel-blue/30 dark:border-lime-burst/25 bg-steel-blue/10 dark:bg-lime-burst/5">
          <div className="divide-y divide-steel-blue/25 dark:divide-lime-burst/15 px-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2.5 px-0 py-2">
                <div className="w-7 h-7 rounded-lg bg-steel-blue/25 dark:bg-lime-burst/15 animate-pulse" />
                <div className="flex-1 min-w-0">
                  <div className="h-3 w-20 bg-steel-blue/20 dark:bg-white/10 rounded animate-pulse mb-1" />
                  <div className="h-2 w-12 bg-steel-blue/20 dark:bg-white/10 rounded animate-pulse" />
                </div>
                <div className="w-3 h-3 bg-steel-blue/20 dark:bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full mt-2 h-8 rounded-xl bg-steel-blue/10 dark:bg-lime-burst/5 animate-pulse" />
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="px-3 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst/90">
            MY PETS
          </p>
          <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold bg-red-500/20 text-red-500">
            0
          </span>
        </div>

        <div className="rounded-xl overflow-hidden border-red-500/30 bg-red-500/5 p-4 text-center">
          <p className="text-red-500 text-xs font-medium">
            Failed to load pets
          </p>
          <p className="text-red-400/70 text-[10px] mt-1">
            {/* {error?.data?.message || "Please try again later"} */}
            "Please try again later"
          </p>
        </div>

        {/* Add Pet Button  */}
        <button className="group w-full mt-2 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all duration-200 border border-dashed border-lime-burst text-steel-blue bg-lime-burst/70 hover:bg-lime-burst/90 hover:scale-[1.02] dark:border-lime-burst dark:text-lime-burst dark:bg-lime-burst/5 dark:hover:bg-lime-burst/15">
          <Plus
            size={12}
            className="transition-transform duration-300 group-hover:rotate-180"
          />
          ADD A PET
        </button>
      </div>
    );
  }

  // Empty State - No Pets
  if (pets.length === 0) {
    return (
      <div className="px-3 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst/90">
            MY PETS
          </p>
          <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold bg-steel-blue dark:bg-lime-burst/20 text-white dark:text-lime-burst">
            0
          </span>
        </div>

        <div className="rounded-xl overflow-hidden border-steel-blue/30 dark:border-lime-burst/25 bg-steel-blue/10 dark:bg-lime-burst/5 p-4 text-center">
          <div className="text-3xl mb-1">🐾</div>
          <p className="text-[11px] font-medium text-gray-700 dark:text-white/70">
            No pets yet
          </p>
          <p className="text-[9px] text-steel-blue/60 dark:text-white/40 mt-0.5">
            Add your first pet to get started
          </p>
        </div>

        {/* Add Pet Button */}
        <button className="group w-full mt-2 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all duration-200 border border-dashed border-lime-burst text-steel-blue bg-lime-burst/70 hover:bg-lime-burst/90 hover:scale-[1.02] dark:border-lime-burst dark:text-lime-burst dark:bg-lime-burst/5 dark:hover:bg-lime-burst/15">
          <Plus
            size={12}
            className="transition-transform duration-300 group-hover:rotate-180"
          />
          ADD A PET
        </button>
      </div>
    );
  }

  //Show Pets
  return (
    <div className="px-3 pt-4 pb-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-[10px] font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst/90">
          MY PETS
        </p>
        <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold bg-steel-blue dark:bg-lime-burst/20 text-white dark:text-lime-burst">
          {pets.length}
        </span>
      </div>

      {/* Pets Container */}
      <div className="rounded-xl overflow-hidden border-steel-blue/30 dark:border-lime-burst/25 bg-steel-blue/10 dark:bg-lime-burst/5">
        <div className="divide-y divide-steel-blue/25 dark:divide-lime-burst/15 px-2.5">
          {pets.map((pet: TPet) => {
            const isActive = pathname === `/user/pets/${pet._id}`;
            return (
              <Link
                key={pet._id}
                href={`/user/my-pets/${pet._id}`}
                className={`
                  flex items-center gap-2.5 px-0 py-2 transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-steel-blue/20 dark:bg-lime-burst/20"
                      : "hover:bg-steel-blue/10 dark:hover:bg-lime-burst/10"
                  }
                `}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-lg bg-steel-blue/25 dark:bg-lime-burst/15 overflow-hidden">
                  {pet.profilePhoto ? (
                    <Image
                      src={pet.profilePhoto}
                      alt={pet.name}
                      width={28}
                      height={28}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-base">
                      {speciesEmoji[pet.species] || "🐾"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold leading-tight truncate text-gray-800 dark:text-white">
                    {pet.name}
                  </p>
                  <p className="text-[9px] mt-0.5 truncate text-steel-blue dark:text-lime-burst/80">
                    {pet.breed || pet.species}
                  </p>
                </div>
                <ChevronRight
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-steel-blue dark:text-lime-burst"
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Add Pet Button */}
      <button className="group w-full mt-2 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all duration-200 border border-dashed border-lime-burst text-steel-blue bg-lime-burst/70 hover:bg-lime-burst/90 hover:scale-[1.02] dark:border-lime-burst dark:text-lime-burst dark:bg-lime-burst/5 dark:hover:bg-lime-burst/15">
        <Plus
          size={12}
          className="transition-transform duration-300 group-hover:rotate-180"
        />
        ADD A PET
      </button>
    </div>
  );
};

export default PetSection;
