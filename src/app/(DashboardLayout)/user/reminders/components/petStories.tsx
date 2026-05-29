import { speciesEmoji, TReminder } from "@/src/types";
import { Button, Avatar } from "@heroui/react";

type PetStoriesProps = {
  uniquePets: TReminder[];
  reminders: TReminder[];
  setSearch: (search: string) => void;
};

const PetStories = ({ uniquePets, reminders, setSearch }: PetStoriesProps) => {
  const getPetUrgency = (petName: string) => {
    for (let i = 0; i < reminders.length; i++) {
      if (reminders[i].pet === petName) {
        return reminders[i].urgency;
      }
    }
    return "low";
  };

  const getRingColor = (urgency: string) => {
    if (urgency === "high") return "bg-red-500";
    if (urgency === "medium") return "bg-orange-500";
    return "bg-steel-blue dark:bg-lime-500";
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-[10px] font-black uppercase text-gray-500 dark:text-white/70 tracking-wide">
          your pets
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {uniquePets.map((pet: TReminder, idx: number) => {
          // console.log(pet);
          const urgency = getPetUrgency(pet.pet);
          const ringColor = getRingColor(urgency);
          const icon = speciesEmoji[pet.species] || "🐾";

          return (
            <Button
              key={idx}
              onPress={() => setSearch(pet.pet)}
              variant="light"
              className="flex flex-col items-center gap-1 flex-shrink-0 h-auto min-w-0 p-0 bg-transparent data-[hover=true]:bg-transparent"
            >
              <div className={`w-12 h-12 rounded-full p-0.5 ${ringColor}`}>
                <Avatar
                  icon={icon}
                  className="w-full h-full rounded-full bg-white dark:bg-[#1a1828] text-xl"
                />
              </div>
              <span className="text-[10px] font-bold text-gray-700 dark:text-white group-hover:text-steel-blue dark:group-hover:text-lime-burst transition-colors">
                {pet.pet.split(" ")[0]}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
export default PetStories;
