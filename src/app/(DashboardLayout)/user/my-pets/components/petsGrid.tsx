import { Button } from "@heroui/react";
import { speciesEmoji, TPet } from "@/src/types";
import Link from "next/link";

const speciesStyles: Record<string, string> = {
  dog: "bg-steel-blue/20 hover:bg-steel-blue/25 text-steel-blue dark:text-steel-blue/90 border-steel-blue/25",
  cat: "bg-lime-burst/20 hover:bg-lime-burst/20 text-lime-burst dark:text-lime-burst/90 border-lime-burst/20",
  bird: "bg-coral/12 hover:bg-coral/20 text-coral dark:text-coral/90 border-coral/20",
  fish: "bg-teal/12 hover:bg-teal/20 text-teal dark:text-teal/90 border-teal/20",
  rabbit:
    "bg-yellow/12 hover:bg-yellow/20 text-yellow dark:text-yellow/90 border-yellow/20",
  reptile:
    "bg-reptile-green/12 hover:bg-reptile-green/20 text-reptile-green dark:text-reptile-green/90 border-reptile-green/20",
  other:
    "bg-white/8 hover:bg-white/12 text-white/60 dark:text-white/50 border-white/15",
};

interface PetsGridProps {
  pets: TPet[];
  setShowAddModal: (value: boolean) => void;
}

const PetsGrid = ({ pets, setShowAddModal }: PetsGridProps) => {
  const calculateAge = (dob?: string) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    return years < 1 ? "< 1 yr" : `${years} yr${years > 1 ? "s" : ""}`;
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {pets?.map((pet: any) => {
        const speciesStyle = speciesStyles[pet?.species] || speciesStyles.other;
        const age = calculateAge(pet.dateOfBirth);
        return (
          <Link
            key={pet._id}
            href={`/user/my-pets/${pet._id}`}
            className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg bg-white/85 dark:bg-white/5 border border-steel-blue/12 dark:border-white/7"
          >
            {/* Emoji banner */}
            <div className="h-28 flex items-center justify-center text-5xl relative bg-steel-blue/5 dark:bg-steel-blue/8">
              {pet.profilePhoto ? (
                <img
                  src={pet.profilePhoto}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                speciesEmoji[pet.species] || "🐾"
              )}
              {/* Health records count badge */}
              {pet.healthRecords?.length > 0 && (
                <div className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-lime-burst/20 dark:bg-lime-burst/20 text-steel-blue dark:text-lime-burst">
                  {pet.healthRecords.length} records
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="  font-bold text-sm mb-1 text-gray-900 dark:text-white/90">
                {pet.name}
              </h3>
              <p className="text-[11px] mb-3 text-gray-500 dark:text-white/30">
                {pet.breed || pet.species}
                {pet.gender && ` · ${pet.gender}`}
                {age && ` · ${age}`}
              </p>
              <div className="flex gap-1.5 flex-wrap">
                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize border ${speciesStyle}`}
                >
                  {pet.species}
                </span>
                {pet.microchipNumber && (
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-teal/10 dark:bg-teal/10 text-teal dark:text-teal border border-teal/20 dark:border-teal/20">
                    Chipped
                  </span>
                )}
                {pet.whatsappAlerts && (
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-lime-burst/10 dark:bg-lime-burst/10 text-lime-burst dark:text-lime-burst border border-lime-burst/20 dark:border-lime-burst/20">
                    Alerts On
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}

      {/* Add Pet card */}

      <Button
        onPress={() => setShowAddModal(true)}
        className="rounded-2xl flex flex-col items-center justify-center gap-3 min-h-[180px] transition-all hover:scale-[1.02] border-2 border-dashed border-steel-blue/25 dark:border-lime-burst/25 bg-transparent"
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-steel-blue/8 dark:bg-lime-burst/10">
          +
        </div>
        <span className="text-xs font-medium text-gray-500 dark:text-white/35">
          Add a Pet
        </span>
      </Button>
    </div>
  );
};

export default PetsGrid;
