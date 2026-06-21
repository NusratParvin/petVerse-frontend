"use client";
import { useGetMyPetsQuery } from "@/src/redux/features/pets/petsApi";
import { ChevronRight, Plus } from "lucide-react";

import React, { useState } from "react";
import AddPetModal from "../../../user/my-pets/components/addPetModal";
import PetList from "./petList";
import PetListSkeleton from "./petListSkeleton";

const PetSection = () => {
  const {
    data: myPets,
    isLoading,
    isError,
    error,
  } = useGetMyPetsQuery(undefined);
  const [showAddModal, setShowAddModal] = useState(false);

  const pets = myPets?.data || [];

  // Error State for middle section
  const ErrorState = () => (
    <div className="rounded-xl overflow-hidden border-red-500/30 bg-red-500/5 p-4 text-center">
      <p className="text-red-500 text-xs font-medium">Failed to load pets</p>
      <p className="text-red-400/70 text-[10px] mt-1">Please try again later</p>
    </div>
  );

  return (
    <>
      <div className="px-3 pt-4 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst/90">
            MY PETS
          </p>
          <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold bg-steel-blue dark:bg-lime-burst/20 text-white dark:text-lime-burst">
            {isLoading ? "..." : pets.length}
          </span>
        </div>

        {/* Middle Section */}
        {isLoading ? (
          <PetListSkeleton />
        ) : isError ? (
          <ErrorState />
        ) : (
          <PetList pets={pets} />
        )}

        {/* Add Pet Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="group w-full mt-2 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all duration-200 border border-dashed border-lime-burst text-steel-blue bg-lime-burst/70 hover:bg-lime-burst/90 hover:scale-[1.02] dark:border-lime-burst dark:text-lime-burst dark:bg-lime-burst/5 dark:hover:bg-lime-burst/15"
        >
          <Plus
            size={12}
            className="transition-transform duration-300 group-hover:rotate-180"
          />
          ADD A PET
        </button>
      </div>

      {/* Add Pet Modal */}
      <AddPetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
};

export default PetSection;
