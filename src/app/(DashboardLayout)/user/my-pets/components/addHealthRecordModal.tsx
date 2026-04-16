// "use client";

// import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
// import { useState } from "react";
// import { toast } from "sonner";
// import {
//   Calendar,
//   DollarSign,
//   FileText,
//   Stethoscope,
//   Syringe,
//   User,
//   ClipboardList,
// } from "lucide-react";
// import { useAddHealthRecordMutation } from "@/src/redux/features/pets/petsApi";
// import { inputClass, labelClass } from "./modal/petInfo/constants";

// const TYPES = [
//   { value: "vaccine", label: "Vaccine", icon: Syringe },
//   { value: "vet-visit", label: "Vet Visit", icon: Stethoscope },
//   { value: "medication", label: "Medication", icon: ClipboardList },
//   { value: "grooming", label: "Grooming", icon: User },
//   { value: "other", label: "Other", icon: FileText },
// ];

// interface AddHealthRecordModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   petId: string;
// }

// export default function AddHealthRecordModal({
//   isOpen,
//   onClose,
//   petId,
// }: AddHealthRecordModalProps) {
//   const [addRecord, { isLoading }] = useAddHealthRecordMutation();

//   const [form, setForm] = useState({
//     type: "vaccine",
//     title: "",
//     date: "",
//     nextDueDate: "",
//     vetName: "",
//     cost: "",
//     notes: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async () => {
//     if (!form.title || !form.date) {
//       toast.error("Title and date are required");
//       return;
//     }
//     try {
//       await addRecord({
//         petId,
//         ...form,
//         cost: form.cost ? Number(form.cost) : undefined,
//       }).unwrap();
//       toast.success("Health record added! 💉");
//       onClose();
//       // Reset form
//       setForm({
//         type: "vaccine",
//         title: "",
//         date: "",
//         nextDueDate: "",
//         vetName: "",
//         cost: "",
//         notes: "",
//       });
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Failed to add record");
//     }
//   };

//   const SelectedTypeIcon =
//     TYPES.find((t) => t.value === form.type)?.icon || FileText;

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       placement="center"
//       size="lg"
//       motionProps={{
//         variants: {
//           enter: {
//             y: 0,
//             opacity: 1,
//             transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
//           },
//           exit: {
//             y: 20,
//             opacity: 0,
//             transition: { duration: 0.2, ease: [0.5, 0, 0.75, 0] },
//           },
//         },
//       }}
//       classNames={{
//         backdrop: "bg-black/50 backdrop-blur-sm",
//         base: "border border-steel-blue/20 dark:border-white/10 bg-white dark:bg-[#0d1020] rounded-xl max-h-[85vh] overflow-y-auto custom-scrollbar",
//       }}
//     >
//       <ModalContent>
//         <ModalHeader className="flex flex-col gap-0 pt-6 px-6 pb-2">
//           <h2 className="text-base font-bold text-steel-blue dark:text-white/90">
//             <SelectedTypeIcon
//               className="inline-block mr-2 mb-1 text-steel-blue dark:text-lime-burst"
//               size={16}
//             />
//             Add Health Record
//           </h2>
//           <p className="text-xs font-normal text-gray-500 dark:text-white/50">
//             Track your pet's medical history, vaccinations, and vet visits
//           </p>
//         </ModalHeader>

//         <ModalBody className="pb-6 px-6">
//           <div className="flex flex-col gap-5">
//             {/* Type Selection */}
//             <div>
//               <label className={labelClass}>Record Type</label>
//               <div className="grid grid-cols-5 gap-2">
//                 {TYPES.map((type) => {
//                   const Icon = type.icon;
//                   const isSelected = form.type === type.value;
//                   return (
//                     <button
//                       key={type.value}
//                       type="button"
//                       onClick={() =>
//                         setForm((prev) => ({ ...prev, type: type.value }))
//                       }
//                       className={`
//                             flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200
//                             ${
//                               isSelected
//                                 ? "bg-lime-burst/10 dark:bg-lime-burst/20 border-lime-burst dark:border-lime-burst"
//                                 : "bg-steel-blue/5 dark:bg-white/5 border-steel-blue/15 dark:border-white/10 hover:bg-steel-blue/10 dark:hover:bg-white/10"
//                             }
//                             border
//                           `}
//                     >
//                       <Icon
//                         size={18}
//                         className={
//                           isSelected
//                             ? "text-lime-burst"
//                             : "text-steel-blue/60 dark:text-white/50"
//                         }
//                       />
//                       <span
//                         className={`text-[10px] font-medium ${isSelected ? "text-lime-burst" : "text-steel-blue/60 dark:text-white/50"}`}
//                       >
//                         {type.label}
//                       </span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Title */}
//             <div>
//               <label className={labelClass}>Title *</label>
//               <input
//                 name="title"
//                 value={form.title}
//                 onChange={handleChange}
//                 placeholder="e.g., Rabies Booster, Annual Checkup"
//                 className={inputClass}
//               />
//             </div>

//             {/* Date Fields */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className={labelClass}>
//                   <Calendar size={12} className="inline mr-1" />
//                   Date *
//                 </label>
//                 <input
//                   name="date"
//                   type="date"
//                   value={form.date}
//                   onChange={handleChange}
//                   className={inputClass}
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>
//                   <Calendar size={12} className="inline mr-1" />
//                   Next Due Date
//                 </label>
//                 <input
//                   name="nextDueDate"
//                   type="date"
//                   value={form.nextDueDate}
//                   onChange={handleChange}
//                   className={inputClass}
//                 />
//               </div>
//             </div>

//             {/* Vet Name & Cost */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className={labelClass}>
//                   <User size={12} className="inline mr-1" />
//                   Vet / Clinic Name
//                 </label>
//                 <input
//                   name="vetName"
//                   value={form.vetName}
//                   onChange={handleChange}
//                   placeholder="e.g., Dr. Ahmed"
//                   className={inputClass}
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>
//                   <DollarSign size={12} className="inline mr-1" />
//                   Cost (AED)
//                 </label>
//                 <input
//                   name="cost"
//                   type="number"
//                   value={form.cost}
//                   onChange={handleChange}
//                   placeholder="e.g., 150"
//                   className={inputClass}
//                 />
//               </div>
//             </div>

//             {/* Notes */}
//             <div>
//               <label className={labelClass}>Notes</label>
//               <textarea
//                 name="notes"
//                 value={form.notes}
//                 onChange={handleChange}
//                 placeholder="Additional notes about the visit, treatment, or medication..."
//                 rows={3}
//                 className={`${inputClass} resize-none`}
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className="w-full py-3 rounded-xl font-semibold text-sm mt-2 transition-all duration-200 bg-lime-burst hover:bg-lime-burst/90 text-[#0a0e1a] disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? "Saving..." : "Save Record 💉"}
//             </button>
//           </div>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// }

"use client";

import { toast } from "sonner";
import { useAddHealthRecordMutation } from "@/src/redux/features/pets/petsApi";
import HealthRecordModal from "./modal/healthRecord/HealthRecordModal";

interface AddHealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: string;
}

export default function AddHealthRecordModal({
  isOpen,
  onClose,
  petId,
}: AddHealthRecordModalProps) {
  const [addRecord, { isLoading }] = useAddHealthRecordMutation();

  const handleSubmit = async (formData: any) => {
    await addRecord({
      petId,
      ...formData,
      cost: formData.cost ? Number(formData.cost) : undefined,
    }).unwrap();
    toast.success("Health record added! 💉");
    onClose();
  };

  return (
    <HealthRecordModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Health Record"
      subtitle="Track your pet's medical history"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitLabel="Save Record 💉"
    />
  );
}
