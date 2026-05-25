"use client";

import { Card, CardBody, Spinner } from "@heroui/react";
import { TPet } from "@/src/types";
import { calcAge } from "./helper";

type PetSelectorProps = {
  pets: TPet[];
  isLoading: boolean;
  onSelectPet: (pet: TPet | null) => void;
};

export const PetSelector = ({
  pets,
  isLoading,
  onSelectPet,
}: PetSelectorProps) => {
  return (
    <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
      <CardBody className="p-5">
        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-4">
          Do you want to use a pet from your profile?
        </p>

        {isLoading ? (
          <div className="text-center py-8">
            <Spinner size="sm" label="Loading your pets..." />
          </div>
        ) : (
          <div className="space-y-2">
            {pets.map((pet) => (
              <button
                key={pet._id}
                onClick={() => onSelectPet(pet)}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md hover:border-[#4682B4] transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-[#4682B4]/20 flex items-center justify-center text-lg flex-shrink-0">
                  {pet.species === "dog"
                    ? "🐶"
                    : pet.species === "cat"
                      ? "🐱"
                      : "🐾"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {pet.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs capitalize">
                    {pet.species} · {pet.breed} · {calcAge(pet.dateOfBirth)}
                  </p>
                </div>
                <span className="text-[#4682B4] dark:text-[#B8FF2E] text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Use this →
                </span>
              </button>
            ))}

            <button
              onClick={() => onSelectPet(null)}
              className="w-full p-3 border border-dashed border-gray-300 dark:border-white/20 rounded-md hover:border-steel-blue text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all text-xs"
            >
              + Enter pet details manually
            </button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
