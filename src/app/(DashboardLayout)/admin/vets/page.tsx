// "use client";

// import { useState } from "react";

// import {
//   useGetVetsQuery,
//   useCreateVetMutation,
//   useUpdateVetMutation,
//   useDeleteVetMutation,
// } from "@/src/redux/features/vets/vetsApi";
// import { TVet } from "@/src/types";
// import { DAYS } from "@/src/constant";
// import VetForm from "./components/vetForm";

// const DEFAULT_FORM = {
//   name: "",
//   clinicName: "",
//   emirate: "dubai",
//   area: "",
//   address: "",
//   phone: "",
//   whatsapp: "",
//   email: "",
//   website: "",
//   coverPhoto: "",
//   about: "",
//   googleMapsUrl: "",
//   specialities: [] as string[],
//   workingHours: DAYS.map((day) => ({
//     day,
//     open: "09:00",
//     close: "18:00",
//     closed: false,
//   })),
//   serviceRates: [{ service: "Consultation", priceFrom: 150, priceTo: 300 }],
//   rating: 4.5,
//   reviewCount: 0,
// };

// type FormState = typeof DEFAULT_FORM;

// const inputClass =
//   "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4682B4]/60 transition-all placeholder:text-white/30";

// export default function AdminVetsPage() {
//   const { data: vets, isLoading } = useGetVetsQuery(undefined);
//   const [createVet, { isLoading: creating }] = useCreateVetMutation();
//   const [updateVet, { isLoading: updating }] = useUpdateVetMutation();
//   const [deleteVet] = useDeleteVetMutation();

//   const [showModal, setShowModal] = useState(false);
//   const [editingVet, setEditingVet] = useState<TVet | null>(null);
//   const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

//   const handleSave = async (form: FormState) => {
//     try {
//       if (editingVet) {
//         await updateVet({
//           id: editingVet._id,
//           body: form as Partial<TVet>,
//         }).unwrap();
//       } else {
//         await createVet(form as Partial<TVet>).unwrap();
//       }
//       setShowModal(false);
//       setEditingVet(null);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     await deleteVet(id).unwrap();
//     setDeleteConfirm(null);
//   };

//   const openEdit = (vet: TVet) => {
//     setEditingVet(vet);
//     setShowModal(true);
//   };

//   const formatEmirate = (e: string) =>
//     e
//       .split("-")
//       .map((w) => w[0].toUpperCase() + w.slice(1))
//       .join(" ");

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1
//             className="text-white text-2xl font-bold"
//             style={{ fontFamily: "Space Grotesk, sans-serif" }}
//           >
//             Vet Clinics
//           </h1>
//           <p className="text-white/40 text-sm mt-1">
//             {vets?.length ?? 0} clinics in database
//           </p>
//         </div>
//         <button
//           onClick={() => {
//             setEditingVet(null);
//             setShowModal(true);
//           }}
//           className="bg-[#B8FF2E] text-[#020812] font-bold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
//         >
//           + Add Clinic
//         </button>
//       </div>

//       {/* Table */}
//       <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-white/10">
//               <th className="text-left text-white/40 text-xs font-medium px-5 py-3">
//                 Clinic
//               </th>
//               <th className="text-left text-white/40 text-xs font-medium px-4 py-3">
//                 Emirate
//               </th>
//               <th className="text-left text-white/40 text-xs font-medium px-4 py-3">
//                 Specialities
//               </th>
//               <th className="text-left text-white/40 text-xs font-medium px-4 py-3">
//                 Rating
//               </th>
//               <th className="text-left text-white/40 text-xs font-medium px-4 py-3">
//                 Status
//               </th>
//               <th className="text-right text-white/40 text-xs font-medium px-5 py-3">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading
//               ? Array.from({ length: 5 }).map((_, i) => (
//                   <tr key={i} className="border-b border-white/5">
//                     <td colSpan={6} className="px-5 py-4">
//                       <div className="h-4 rounded bg-white/5 animate-pulse" />
//                     </td>
//                   </tr>
//                 ))
//               : vets?.map((vet: TVet) => (
//                   <tr
//                     key={vet._id}
//                     className="border-b border-white/5 hover:bg-white/3 transition-colors"
//                   >
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-3">
//                         {vet.coverPhoto && (
//                           <img
//                             src={vet.coverPhoto}
//                             alt=""
//                             className="w-9 h-9 rounded-lg object-cover opacity-80"
//                           />
//                         )}
//                         <div>
//                           <p className="text-white text-sm font-medium">
//                             {vet.clinicName}
//                           </p>
//                           <p className="text-white/40 text-xs">{vet.name}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 text-white/60 text-sm">
//                       {formatEmirate(vet.emirate)}
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="flex flex-wrap gap-1">
//                         {vet.specialities.slice(0, 2).map((s) => (
//                           <span
//                             key={s}
//                             className="text-[10px] bg-[#4682B4]/15 border border-[#4682B4]/25 text-[#4682B4] px-1.5 py-0.5 rounded-full capitalize"
//                           >
//                             {s}
//                           </span>
//                         ))}
//                         {vet.specialities.length > 2 && (
//                           <span className="text-[10px] text-white/30">
//                             +{vet.specialities.length - 2}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4">
//                       <span className="text-[#F5D020] text-sm">
//                         ★ {vet.rating.toFixed(1)}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4">
//                       {vet.isClaimed ? (
//                         <span className="text-[10px] bg-[#00E5CC]/15 border border-[#00E5CC]/30 text-[#00E5CC] px-2 py-0.5 rounded-full">
//                           Claimed
//                         </span>
//                       ) : (
//                         <span className="text-[10px] bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full">
//                           Unclaimed
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-5 py-4">
//                       <div className="flex items-center justify-end gap-2">
//                         <button
//                           onClick={() => openEdit(vet)}
//                           className="text-xs text-[#4682B4] hover:underline"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => setDeleteConfirm(vet._id)}
//                           className="text-xs text-[#FF4D6D] hover:underline"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//           </tbody>
//         </table>

//       </div>

//        <div>
//           {/* Add/Edit Modal */}
//           <VetForm
//             initial={
//               editingVet
//                 ? {
//                     name: editingVet.name,
//                     clinicName: editingVet.clinicName,
//                     emirate: editingVet.emirate,
//                     area: editingVet.area,
//                     address: editingVet.address,
//                     phone: editingVet.phone,
//                     whatsapp: editingVet.whatsapp || "",
//                     email: editingVet.email || "",
//                     website: editingVet.website || "",
//                     coverPhoto: editingVet.coverPhoto || "",
//                     about: editingVet.about || "",
//                     googleMapsUrl: editingVet.googleMapsUrl || "",
//                     specialities: editingVet.specialities,
//                     workingHours: editingVet.workingHours?.length
//                       ? editingVet.workingHours
//                       : DEFAULT_FORM.workingHours,
//                     serviceRates: editingVet.serviceRates?.length
//                       ? editingVet.serviceRates
//                       : DEFAULT_FORM.serviceRates,
//                     rating: editingVet.rating,
//                     reviewCount: editingVet.reviewCount,
//                   }
//                 : DEFAULT_FORM
//             }
//             onSave={handleSave}
//             loading={creating || updating}
//           />
//         </div>

//       {/* Delete Confirm */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//           <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4">
//             <h3 className="text-white font-bold mb-2">Delete Clinic?</h3>
//             <p className="text-white/50 text-sm mb-5">
//               This will soft-delete the clinic and remove it from the public
//               listing.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setDeleteConfirm(null)}
//                 className="flex-1 py-2.5 border border-white/10 rounded-xl text-white/60 text-sm hover:bg-white/5"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDelete(deleteConfirm)}
//                 className="flex-1 py-2.5 bg-[#FF4D6D] rounded-xl text-white font-bold text-sm hover:opacity-90"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useGetVetsQuery,
  useDeleteVetMutation,
} from "@/src/redux/features/vets/vetsApi";
import { TVet } from "@/src/types";
import { format } from "date-fns";

export default function AdminVetsPage() {
  const router = useRouter();
  const { data: vets, isLoading, isError, error } = useGetVetsQuery(undefined);
  const [deleteVet] = useDeleteVetMutation();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteVet(id).unwrap();
    setDeleteConfirm(null);
  };

  const formatEmirate = (e: string) =>
    e
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");

  // Loading State
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-steel-blue/20 dark:bg-white/10 rounded mb-2" />
          <div className="h-4 w-32 bg-steel-blue/10 dark:bg-white/5 rounded mb-6" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 bg-steel-blue/5 dark:bg-white/5 rounded"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-pv-coral/30 bg-pv-coral/5 p-8 text-center">
          <p className="text-pv-coral font-medium">Failed to load clinics</p>
          <p className="text-pv-coral/70 text-sm mt-1">
            "Please try again later"
          </p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!vets?.length) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Vet Clinics
            </h1>
            <p className="text-sm mt-1 text-gray-500 dark:text-white/40">
              0 clinics in database
            </p>
          </div>
          <Link
            href="/admin/vets/new"
            className="bg-lime-burst text-gray-900 font-bold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            + Add Clinic
          </Link>
        </div>
        <div className="rounded-2xl border border-steel-blue/20 dark:border-white/10 bg-white dark:bg-white/5 p-12 text-center">
          <div className="text-5xl mb-3">🏥</div>
          <p className="text-gray-600 dark:text-white/60 text-sm">
            No vet clinics yet
          </p>
          <p className="text-gray-400 dark:text-white/30 text-xs mt-1">
            Click "Add Clinic" to get started
          </p>
        </div>
      </div>
    );
  }

  // Success State - Show Table
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Vet Clinics
          </h1>
          <p className="text-sm mt-1 text-gray-500 dark:text-white/40">
            {vets.length} clinic{vets.length !== 1 ? "s" : ""} in database
          </p>
        </div>
        <Link
          href="/admin/vets/new"
          className="bg-lime-burst text-gray-900 font-bold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          + Add Clinic
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-steel-blue/20 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-steel-blue/15 dark:border-white/10">
              <th className="text-left text-gray-500 dark:text-white/40 text-xs font-medium px-5 py-3">
                Clinic
              </th>
              <th className="text-left text-gray-500 dark:text-white/40 text-xs font-medium px-4 py-3">
                Emirate
              </th>
              <th className="text-left text-gray-500 dark:text-white/40 text-xs font-medium px-4 py-3">
                Specialities
              </th>
              <th className="text-left text-gray-500 dark:text-white/40 text-xs font-medium px-4 py-3">
                Rating
              </th>
              <th className="text-left text-gray-500 dark:text-white/40 text-xs font-medium px-4 py-3">
                Status
              </th>
              <th className="text-right text-gray-500 dark:text-white/40 text-xs font-medium px-5 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {vets?.map((vet: TVet) => (
              <tr
                key={vet._id}
                className="border-b border-steel-blue/10 dark:border-white/5 hover:bg-steel-blue/5 dark:hover:bg-white/5 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {vet.coverPhoto && (
                      <img
                        src={vet.coverPhoto}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover opacity-80"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {vet.clinicName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-white/40">
                        {vet.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 dark:text-white/60">
                  {formatEmirate(vet.emirate)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {vet.specialities.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] bg-steel-blue/15 border border-steel-blue/25 text-steel-blue px-1.5 py-0.5 rounded-full capitalize"
                      >
                        {s}
                      </span>
                    ))}
                    {vet.specialities.length > 2 && (
                      <span className="text-[10px] text-gray-400 dark:text-white/30">
                        +{vet.specialities.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-pv-yellow text-sm">
                    ★ {vet.rating.toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {vet.isClaimed ? (
                    <span className="text-[10px] bg-pv-teal/15 border border-pv-teal/30 text-pv-teal px-2 py-0.5 rounded-full">
                      Claimed
                    </span>
                  ) : (
                    <span className="text-[10px] bg-white/5 border border-steel-blue/20 dark:border-white/10 text-gray-500 dark:text-white/40 px-2 py-0.5 rounded-full">
                      Unclaimed
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/vets/${vet._id}`}
                      className="text-xs text-steel-blue hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(vet._id)}
                      className="text-xs text-pv-coral hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0a1628] border border-steel-blue/20 dark:border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-gray-900 dark:text-white font-bold mb-2">
              Delete Clinic?
            </h3>
            <p className="text-gray-500 dark:text-white/50 text-sm mb-5">
              This will soft-delete the clinic and remove it from the public
              listing.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-steel-blue/20 dark:border-white/10 rounded-xl text-gray-600 dark:text-white/60 text-sm hover:bg-steel-blue/5 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-pv-coral rounded-xl text-white font-bold text-sm hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
