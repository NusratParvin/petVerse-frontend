import { Button, Spinner, Card, User, Chip } from "@heroui/react";
import { speciesEmoji, TPet } from "@/src/types";

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
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-default-600">
        Which pet are these records for?
      </p>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="sm" label="Loading pets..." />
        </div>
      ) : pets.length === 0 ? (
        <Card className="py-8 shadow-none">
          <p className="text-center text-default-400 text-sm">
            No pets found. Add a pet first.
          </p>
        </Card>
      ) : (
        // <div className="grid grid-cols-2 sm:grid-cols-3 gap-2  ">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar">
          {pets.map((pet) => (
            <Card
              key={pet._id}
              isPressable
              onPress={() => onSelectPet(pet)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
                ${
                  selectedPet?._id === pet._id
                    ? "border-primary/30 bg-primary/5 dark:shadow-md shadow-lg shadow-default-200 dark:shadow-primary-500"
                    : "border-default-200"
                }`}
            >
              <div className="w-16 h-16 rounded-full bg-default-100 flex items-center justify-center text-3xl overflow-hidden">
                {pet.profilePhoto ? (
                  <img
                    src={pet.profilePhoto}
                    alt={pet.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{speciesEmoji[pet.species]}</span>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-default-900">
                  {pet.name}
                </p>
                <Chip
                  size="sm"
                  variant="flat"
                  className="text-[10px] h-5 capitalize"
                >
                  {pet.species}
                </Chip>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button
        color="primary"
        size="sm"
        radius="md"
        isDisabled={!selectedPet}
        onPress={onContinue}
        className="self-end mt-1 w-40 bg-steel-blue/90 text-white  font-medium sticky mb-44"
      >
        Continue →
      </Button>
    </div>
  );
}
