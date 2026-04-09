"use client";
import { useState } from "react";
import { Plus, PawPrint } from "lucide-react";
import { useGetMyPetsQuery } from "@/src/redux/features/pets/petsApi";
import AddPetModal from "./components/addPetModal";
import { Button } from "@heroui/react";
import PetCardLoader from "./components/petCardLoader";
import PetsGrid from "./components/petsGrid";

// export default function MyPets() {
//   const { theme } = useTheme();
//   const isDark = theme === "petverse-dark";
//   const [showAddModal, setShowAddModal] = useState(false);

//   const { data, isLoading } = useGetMyPetsQuery(undefined);
//   const pets = data?.data || [];

//   const cardStyle = {
//     background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
//     border: isDark
//       ? "1px solid rgba(255,255,255,0.07)"
//       : "1px solid rgba(70,130,180,0.12)",
//     boxShadow: isDark ? "none" : "0 2px 12px rgba(70,130,180,0.06)",
//   };

//   return (
//     <div className="p-6 max-w-4xl">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1
//             className="  text-2xl font-bold"
//             style={{ color: isDark ? "rgba(255,255,255,0.92)" : "#1a1a2e" }}
//           >
//             My Pets
//           </h1>
//           <p
//             className="text-sm mt-1"
//             style={{
//               color: isDark ? "rgba(255,255,255,0.3)" : "rgba(30,30,60,0.4)",
//             }}
//           >
//             {isLoading
//               ? "Loading..."
//               : `${pets.length} pet${pets.length !== 1 ? "s" : ""}`}
//           </p>
//         </div>
//         <Button
//           onPress={() => setShowAddModal(true)}
//           className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
//           style={{ background: "#B8FF2E", color: "#0a0e1a" }}
//         >
//           <Plus size={16} />
//           Add Pet
//         </Button>
//       </div>

//       {/* Loading */}
//       {isLoading && (
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           {[1, 2, 3].map((i) => (
//             <div
//               key={i}
//               className="rounded-2xl overflow-hidden animate-pulse"
//               style={cardStyle}
//             >
//               <div
//                 className="h-28"
//                 style={{
//                   background: isDark
//                     ? "rgba(255,255,255,0.03)"
//                     : "rgba(70,130,180,0.05)",
//                 }}
//               />
//               <div className="p-4">
//                 <div
//                   className="h-4 w-24 rounded mb-2"
//                   style={{
//                     background: isDark
//                       ? "rgba(255,255,255,0.06)"
//                       : "rgba(70,130,180,0.08)",
//                   }}
//                 />
//                 <div
//                   className="h-3 w-32 rounded"
//                   style={{
//                     background: isDark
//                       ? "rgba(255,255,255,0.04)"
//                       : "rgba(70,130,180,0.05)",
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Empty state */}
//       {!isLoading && pets.length === 0 && (
//         <div
//           className="flex flex-col items-center justify-center py-20 rounded-2xl"
//           style={cardStyle}
//         >
//           <div
//             className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4"
//             style={{
//               background: isDark
//                 ? "rgba(184,255,46,0.1)"
//                 : "rgba(70,130,180,0.08)",
//             }}
//           >
//             🐾
//           </div>
//           <p
//             className="  font-semibold text-base mb-1"
//             style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#1a1a2e" }}
//           >
//             No pets yet
//           </p>
//           <p
//             className="text-sm mb-5"
//             style={{
//               color: isDark ? "rgba(255,255,255,0.3)" : "rgba(30,30,60,0.4)",
//             }}
//           >
//             Add your first pet to get started
//           </p>
//           <Button
//             onPress={() => setShowAddModal(true)}
//             className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
//             style={{ background: "#B8FF2E", color: "#0a0e1a" }}
//           >
//             <Plus size={15} />
//             Add a Pet
//           </Button>
//         </div>
//       )}

//       {/* Pets Grid */}
//       {!isLoading && pets.length > 0 && (
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           {pets.map((pet: any) => {
//             const color = speciesStyles[pet.species] || speciesStyles.other;
//             const age = calculateAge(pet.dateOfBirth);
//             return (
//               <Link
//                 key={pet._id}
//                 href={`/user/pets/${pet._id}`}
//                 className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
//                 style={cardStyle}
//               >
//                 {/* Emoji banner */}
//                 <div
//                   className="h-28 flex items-center justify-center text-5xl relative"
//                   style={{
//                     background: isDark
//                       ? "rgba(70,130,180,0.08)"
//                       : "rgba(70,130,180,0.05)",
//                   }}
//                 >
//                   {pet.profilePhoto ? (
//                     <img
//                       src={pet.profilePhoto}
//                       alt={pet.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     speciesEmoji[pet.species] || "🐾"
//                   )}
//                   {/* Health records count badge */}
//                   {pet.healthRecords?.length > 0 && (
//                     <div
//                       className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
//                       style={{
//                         background: isDark
//                           ? "rgba(184,255,46,0.2)"
//                           : "rgba(70,130,180,0.15)",
//                         color: isDark ? "#B8FF2E" : "#4682B4",
//                       }}
//                     >
//                       {pet.healthRecords.length} records
//                     </div>
//                   )}
//                 </div>

//                 {/* Info */}
//                 <div className="p-4">
//                   <h3
//                     className="  font-bold text-sm mb-1"
//                     style={{
//                       color: isDark ? "rgba(255,255,255,0.9)" : "#1a1a2e",
//                     }}
//                   >
//                     {pet.name}
//                   </h3>
//                   <p
//                     className="text-[11px] mb-3"
//                     style={{
//                       color: isDark
//                         ? "rgba(255,255,255,0.3)"
//                         : "rgba(30,30,60,0.45)",
//                     }}
//                   >
//                     {pet.breed || pet.species}
//                     {pet.gender && ` · ${pet.gender}`}
//                     {age && ` · ${age}`}
//                   </p>
//                   <div className="flex gap-1.5 flex-wrap">
//                     <span
//                       className="text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize"
//                       style={{
//                         background: color.bg,
//                         color: color.text,
//                         border: `1px solid ${color.border}`,
//                       }}
//                     >
//                       {pet.species}
//                     </span>
//                     {pet.microchipNumber && (
//                       <span
//                         className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
//                         style={{
//                           background: isDark
//                             ? "rgba(0,229,204,0.1)"
//                             : "rgba(0,150,136,0.08)",
//                           color: isDark ? "#00E5CC" : "#007a70",
//                           border: isDark
//                             ? "1px solid rgba(0,229,204,0.2)"
//                             : "1px solid rgba(0,150,136,0.15)",
//                         }}
//                       >
//                         Chipped
//                       </span>
//                     )}
//                     {pet.whatsappAlerts && (
//                       <span
//                         className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
//                         style={{
//                           background: isDark
//                             ? "rgba(184,255,46,0.1)"
//                             : "rgba(90,171,30,0.08)",
//                           color: isDark ? "#B8FF2E" : "#5aab1e",
//                           border: isDark
//                             ? "1px solid rgba(184,255,46,0.2)"
//                             : "1px solid rgba(90,171,30,0.15)",
//                         }}
//                       >
//                         Alerts On
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}

//           {/* Add Pet card */}
//           <Button
//             onPress={() => setShowAddModal(true)}
//             className="rounded-2xl flex flex-col items-center justify-center gap-3 min-h-[180px] transition-all hover:scale-[1.02]"
//             style={{
//               background: "transparent",
//               border: isDark
//                 ? "1.5px dashed rgba(184,255,46,0.25)"
//                 : "1.5px dashed rgba(70,130,180,0.25)",
//             }}
//           >
//             <div
//               className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
//               style={{
//                 background: isDark
//                   ? "rgba(184,255,46,0.1)"
//                   : "rgba(70,130,180,0.08)",
//               }}
//             >
//               +
//             </div>
//             <span
//               className="text-xs font-medium"
//               style={{
//                 color: isDark ? "rgba(255,255,255,0.35)" : "rgba(30,30,60,0.4)",
//               }}
//             >
//               Add a Pet
//             </span>
//           </Button>
//         </div>
//       )}

//       {/* Add Pet Modal */}
//       {showAddModal && <AddPetModal onClose={() => setShowAddModal(false)} />}
//     </div>
//   );
// }
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
