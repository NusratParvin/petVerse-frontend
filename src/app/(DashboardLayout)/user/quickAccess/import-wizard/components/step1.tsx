// components/StepSelectPet.tsx
import { Button, Spinner } from "@heroui/react";
import { TPet } from "@/src/types";

interface Step1Props {
  pets: TPet[];
  isLoading: boolean;
  selectedPet: TPet | null;
  onSelectPet: (pet: TPet) => void;
  onContinue: () => void;
}

export function Step1({
  pets,
  isLoading,
  selectedPet,
  onSelectPet,
  onContinue,
}: Step1Props) {
  const getPetEmoji = (species: string) => {
    switch (species) {
      case "dog":
        return "🐶";
      case "cat":
        return "🐱";
      case "bird":
        return "🐦";
      default:
        return "🐾";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-default-600">
        Which pet are these records for?
      </p>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="sm" />
        </div>
      ) : pets.length === 0 ? (
        <p className="text-center py-8 text-default-400 text-sm">
          No pets found. Add a pet first.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {pets.map((pet) => (
            <button
              key={pet._id}
              onClick={() => onSelectPet(pet)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
                ${
                  selectedPet?._id === pet._id
                    ? "border-primary bg-primary/5"
                    : "border-default-200 hover:border-primary/50"
                }`}
            >
              <div className="w-12 h-12 rounded-full bg-default-100 flex items-center justify-center text-2xl overflow-hidden">
                {pet.profilePhoto ? (
                  <img
                    src={pet.profilePhoto}
                    alt={pet.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  getPetEmoji(pet.species)
                )}
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-default-900">
                  {pet.name}
                </p>
                <p className="text-[10px] text-default-400 capitalize">
                  {pet.species}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <Button
        color="primary"
        size="sm"
        radius="lg"
        isDisabled={!selectedPet}
        onPress={onContinue}
        className="self-end mt-1"
      >
        Continue →
      </Button>
    </div>
  );
}
