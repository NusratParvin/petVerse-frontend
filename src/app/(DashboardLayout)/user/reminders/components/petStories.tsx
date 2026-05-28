import { recordIcon } from "@/src/types";

const PetStories = ({ uniquePets, reminders, setSearch }) => {
  function getPetUrgency(petName) {
    for (let i = 0; i < reminders.length; i++) {
      if (reminders[i].pet === petName) {
        return reminders[i].urgency;
      }
    }
    return "low";
  }

  function getRingColor(urgency) {
    if (urgency === "high") return "bg-red-500";
    if (urgency === "medium") return "bg-steel-blue";
    return "bg-lime-500";
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-3 rounded-full bg-steel-blue dark:bg-lime-burst" />
        <span className="text-[8px] font-black uppercase text-gray-500">
          your pets
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {uniquePets.map((pet, idx) => {
          const urgency = getPetUrgency(pet.pet);
          const ringColor = getRingColor(urgency);
          const icon = recordIcon[pet.type] || "🐾";

          return (
            <button
              key={idx}
              onClick={() => setSearch(pet.pet)}
              className="flex flex-col items-center gap-1 flex-shrink-0"
            >
              <div className={`w-12 h-12 rounded-full p-0.5 ${ringColor}`}>
                <div className="w-full h-full rounded-full bg-white dark:bg-[#1a1828] flex items-center justify-center text-xl border-2 border-white">
                  {icon}
                </div>
              </div>
              <span className="text-[9px] font-bold">
                {pet.pet.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default PetStories;
