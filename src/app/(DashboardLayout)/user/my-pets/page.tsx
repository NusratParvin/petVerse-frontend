"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useGetMyPetsQuery } from "@/src/redux/features/pets/petsApi";
import AddPetModal from "./components/addPetModal";
import { Button } from "@heroui/react";
import PetCardLoader from "./components/petCardLoader";
import PetsGrid from "./components/petsGrid";

export default function MyPets() {
  const { data, isLoading } = useGetMyPetsQuery(undefined);
  const pets = data?.data || [];
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="px-4 py-2 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-base font-semibold text-gray-900 dark:text-white/90">
            My Pets
          </h1>
          {/* <p className="text-sm mt-1 text-gray-500 dark:text-white/30">
            {isLoading
              ? "Loading..."
              : `${pets.length} pet${pets.length !== 1 ? "s" : ""}`}
          </p> */}
        </div>

        <p className="text-sm mt-1 text-gray-500 dark:text-white/30">
          {isLoading
            ? "Loading..."
            : `${pets.length} pet${pets.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Loading */}
      {isLoading && <PetCardLoader />}

      {/* Empty state */}
      {!isLoading && pets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 rounded-lg bg-white/85 dark:bg-white/5 border border-steel-blue/10 dark:border-white/10 shadow-lg">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 bg-lime-burst/50 dark:bg-lime-burst/70">
            🐾
          </div>
          <p className="  font-semibold text-base mb-1 text-gray-900 dark:text-white/70">
            No pets yet
          </p>
          <p className="text-sm mb-5 text-gray-500 dark:text-white/30">
            Add your first pet to get started
          </p>

          <Button
            variant="shadow"
            size="sm"
            onPress={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-6 py-0 rounded-lg text-xs font-semibold transition-all hover:bg-lime-burst bg-lime-burst/90 text-gray-800"
          >
            <Plus
              size={14}
              className="duration-300 group-hover:rotate-180 transition-transform"
            />
            Add Pet
          </Button>
        </div>
      )}

      {/* Pets Grid */}
      {!isLoading && pets.length > 0 && (
        <PetsGrid pets={pets} setShowAddModal={setShowAddModal} />
      )}

      {/* Add Pet Modal */}
      {showAddModal && (
        <AddPetModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
