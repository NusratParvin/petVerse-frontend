// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useGetMyPetsQuery } from "@/src/redux/features/pets/petsApi";
// import { useGetInsuranceRecommendationMutation } from "@/src/redux/features/insurance/insuranceApi";

// // ── Types ────────────────────────────────────────────────────────────────────

// type Pet = {
//   _id: string;
//   name: string;
//   species: string;
//   breed: string;
//   dateOfBirth: string;
// };

// type FormData = {
//   petName: string;
//   species: string;
//   breed: string;
//   ageYears: string;
//   existingConditions: string;
//   budget: string;
// };

// // ── Helpers ──────────────────────────────────────────────────────────────────

// function calcAge(dob: string): string {
//   if (!dob) return "";
//   const diff = Date.now() - new Date(dob).getTime();
//   const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
//   return String(years);
// }

// // ── Question config ──────────────────────────────────────────────────────────

// const QUESTIONS = [
//   {
//     id: "petName",
//     label: "What is your pet's name?",
//     type: "text",
//     placeholder: "e.g. Max",
//     icon: "🐾",
//   },
//   {
//     id: "species",
//     label: "What type of pet?",
//     type: "select",
//     icon: "🐶",
//     options: [
//       { value: "dog", label: "🐶 Dog" },
//       { value: "cat", label: "🐱 Cat" },
//       { value: "bird", label: "🦜 Bird" },
//       { value: "rabbit", label: "🐰 Rabbit" },
//       { value: "other", label: "🐾 Other" },
//     ],
//   },
//   {
//     id: "breed",
//     label: "What breed?",
//     type: "text",
//     placeholder: "e.g. Golden Retriever",
//     icon: "📋",
//   },
//   {
//     id: "ageYears",
//     label: "How old is your pet? (years)",
//     type: "number",
//     placeholder: "e.g. 3",
//     icon: "🎂",
//   },
//   {
//     id: "existingConditions",
//     label: "Does your pet have any existing health conditions?",
//     type: "radio",
//     icon: "🏥",
//     options: [
//       { value: "no", label: "No, healthy" },
//       { value: "yes", label: "Yes, has conditions" },
//       { value: "unsure", label: "Not sure" },
//     ],
//   },
//   {
//     id: "budget",
//     label: "What's your monthly budget for insurance?",
//     type: "radio",
//     icon: "💰",
//     options: [
//       { value: "low", label: "AED 90–150 (Basic)" },
//       { value: "medium", label: "AED 150–250 (Standard)" },
//       { value: "high", label: "AED 250+ (Premium)" },
//     ],
//   },
// ];

// // ── Main Component ────────────────────────────────────────────────────────────

// export default function InsuranceCalculatorPage() {
//   // ── State ─────────────────────────────────────────────────────────────────
//   const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
//   const [step, setStep] = useState<"select" | "form" | "result">("select");

//   const [form, setForm] = useState<FormData>({
//     petName: "",
//     species: "",
//     breed: "",
//     ageYears: "",
//     existingConditions: "",
//     budget: "",
//   });

//   // ── RTK Queries ───────────────────────────────────────────────────────────
//   const { data: petsData, isLoading: petsLoading } = useGetMyPetsQuery({});
//   const pets: Pet[] = petsData?.data ?? [];

//   const [
//     getRecommendation,
//     { isLoading: isGenerating, data: result, error: apiError },
//   ] = useGetInsuranceRecommendationMutation();

//   // ── Handlers ──────────────────────────────────────────────────────────────

//   function handleSelectPet(pet: Pet | null) {
//     if (!pet) {
//       setSelectedPetId(null);
//       setForm({
//         petName: "",
//         species: "",
//         breed: "",
//         ageYears: "",
//         existingConditions: "",
//         budget: "",
//       });
//     } else {
//       setSelectedPetId(pet._id);
//       setForm({
//         petName: pet.name,
//         species: pet.species,
//         breed: pet.breed,
//         ageYears: calcAge(pet.dateOfBirth),
//         existingConditions: "",
//         budget: "",
//       });
//     }
//     setStep("form");
//   }

//   function handleChange(field: keyof FormData, value: string) {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   }

//   async function handleSubmit() {
//     try {
//       await getRecommendation(form).unwrap();
//       setStep("result");
//     } catch (err) {
//       console.error("Failed to get recommendation:", err);
//     }
//   }

//   const isFormComplete = Object.values(form).every((v) => v.trim() !== "");
//   const insuranceResult = result?.data;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#020812] text-gray-900 dark:text-white font-[Outfit,sans-serif] px-4 py-8 transition-colors">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <Link
//             href="/user/insurance"
//             className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center gap-1 mb-4"
//           >
//             ← Back to Compare Plans
//           </Link>
//           <h1 className="text-2xl sm:text-3xl font-bold font-[Space_Grotesk,sans-serif] text-gray-900 dark:text-white">
//             ✨ AI Insurance Finder
//           </h1>
//           <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
//             Answer 5 quick questions — we'll match your pet to the best UAE plan
//           </p>
//         </div>

//         {/* ── STEP: Pet Selector ── */}
//         {step === "select" && (
//           <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:backdrop-blur-md">
//             <p className="font-semibold text-gray-900 dark:text-white mb-4 font-[Space_Grotesk,sans-serif]">
//               Do you want to use a pet from your profile?
//             </p>

//             {petsLoading ? (
//               <div className="text-center py-8">
//                 <div className="animate-pulse text-gray-400">
//                   Loading your pets...
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {pets.map((pet) => (
//                   <button
//                     key={pet._id}
//                     onClick={() => handleSelectPet(pet)}
//                     className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-[#4682B4] transition-all text-left group"
//                   >
//                     <div className="w-10 h-10 rounded-full bg-[#4682B4]/20 flex items-center justify-center text-xl flex-shrink-0">
//                       {pet.species === "dog"
//                         ? "🐶"
//                         : pet.species === "cat"
//                           ? "🐱"
//                           : "🐾"}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-semibold text-gray-900 dark:text-white">
//                         {pet.name}
//                       </p>
//                       <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">
//                         {pet.species} · {pet.breed} · {calcAge(pet.dateOfBirth)}{" "}
//                         yrs
//                       </p>
//                     </div>
//                     <span className="text-[#4682B4] dark:text-[#B8FF2E] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
//                       Use this →
//                     </span>
//                   </button>
//                 ))}

//                 <button
//                   onClick={() => handleSelectPet(null)}
//                   className="w-full p-4 border border-dashed border-gray-300 dark:border-white/20 rounded-xl hover:border-[#4682B4] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all text-sm"
//                 >
//                   + Enter pet details manually
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── STEP: Form ── */}
//         {step === "form" && (
//           <div className="space-y-4">
//             {selectedPetId && (
//               <div className="bg-[#4682B4]/10 dark:bg-[#4682B4]/20 border border-[#4682B4]/30 rounded-xl px-4 py-3 text-sm text-[#4682B4] dark:text-[#4682B4]">
//                 ℹ️ Pre-filled from your pet's profile. You can edit any field
//                 below.
//               </div>
//             )}

//             {QUESTIONS.map((q) => (
//               <div
//                 key={q.id}
//                 className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:backdrop-blur-md"
//               >
//                 <label className="block font-semibold text-gray-900 dark:text-white mb-3 font-[Space_Grotesk,sans-serif]">
//                   {q.icon} {q.label}
//                 </label>

//                 {(q.type === "text" || q.type === "number") && (
//                   <input
//                     type={q.type}
//                     value={form[q.id as keyof FormData]}
//                     onChange={(e) =>
//                       handleChange(q.id as keyof FormData, e.target.value)
//                     }
//                     placeholder={q.placeholder}
//                     className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#4682B4] transition-colors"
//                   />
//                 )}

//                 {q.type === "select" && (
//                   <select
//                     value={form[q.id as keyof FormData]}
//                     onChange={(e) =>
//                       handleChange(q.id as keyof FormData, e.target.value)
//                     }
//                     className="w-full bg-white dark:bg-[#020812] border border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#4682B4] transition-colors cursor-pointer"
//                   >
//                     <option value="">Select...</option>
//                     {q.options?.map((opt) => (
//                       <option key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </option>
//                     ))}
//                   </select>
//                 )}

//                 {q.type === "radio" && (
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//                     {q.options?.map((opt) => {
//                       const selected =
//                         form[q.id as keyof FormData] === opt.value;
//                       return (
//                         <button
//                           key={opt.value}
//                           type="button"
//                           onClick={() =>
//                             handleChange(q.id as keyof FormData, opt.value)
//                           }
//                           className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
//                             selected
//                               ? "bg-[#4682B4] border-[#4682B4] text-white"
//                               : "border-gray-200 dark:border-white/20 text-gray-600 dark:text-gray-400 hover:border-[#4682B4] hover:text-gray-900 dark:hover:text-white"
//                           }`}
//                         >
//                           {opt.label}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             ))}

//             <button
//               onClick={handleSubmit}
//               disabled={!isFormComplete || isGenerating}
//               className="w-full bg-[#4682B4] dark:bg-[#B8FF2E] text-white dark:text-black font-bold py-4 rounded-2xl text-base hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-[Space_Grotesk,sans-serif]"
//             >
//               {isGenerating ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
//                   Analysing...
//                 </span>
//               ) : (
//                 `✨ Find Best Plan for ${form.petName || "My Pet"}`
//               )}
//             </button>

//             {apiError && (
//               <p className="text-red-500 text-sm text-center">
//                 Failed to get recommendation. Please try again.
//               </p>
//             )}
//           </div>
//         )}

//         {/* ── STEP: Result ── */}
//         {step === "result" && insuranceResult && (
//           <div className="space-y-4">
//             <div className="bg-gradient-to-br from-[#4682B4]/10 to-[#00E5CC]/5 dark:from-[#4682B4]/20 dark:to-[#00E5CC]/10 border border-[#4682B4]/30 rounded-2xl p-6">
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="text-[#4682B4] dark:text-[#B8FF2E] text-xs font-bold uppercase tracking-widest">
//                   AI Recommendation
//                 </span>
//               </div>
//               <h2 className="text-xl font-bold font-[Space_Grotesk,sans-serif] text-gray-900 dark:text-white mt-1">
//                 🏆 {insuranceResult.topProvider}
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 leading-relaxed">
//                 {insuranceResult.recommendation}
//               </p>
//               <div className="mt-4 bg-gray-100 dark:bg-white/5 rounded-xl p-4">
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                   Why this provider?
//                 </p>
//                 <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
//                   {insuranceResult.reasoning}
//                 </p>
//               </div>
//             </div>

//             <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
//               <h3 className="font-bold  text-gray-900 dark:text-white mb-3">
//                 💡 Tips for {form.petName}
//               </h3>
//               <ul className="space-y-2">
//                 {insuranceResult.tips.map((tip, i) => (
//                   <li
//                     key={i}
//                     className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
//                   >
//                     <span className="text-[#4682B4] dark:text-[#B8FF2E] mt-0.5 flex-shrink-0">
//                       ✓
//                     </span>
//                     {tip}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3">
//               <Link
//                 href="/user/insurance"
//                 className="flex-1 text-center bg-[#4682B4] dark:bg-[#B8FF2E] text-white dark:text-black font-bold py-3 rounded-2xl hover:brightness-110 active:scale-95 transition-all text-sm font-[Space_Grotesk,sans-serif]"
//               >
//                 Compare All Plans →
//               </Link>
//               <button
//                 onClick={() => {
//                   setStep("select");
//                 }}
//                 className="flex-1 text-center border border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-white/40 py-3 rounded-2xl transition-all text-sm"
//               >
//                 Try Another Pet
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  RadioGroup,
  Radio,
  Spinner,
} from "@heroui/react";
import { useGetMyPetsQuery } from "@/src/redux/features/pets/petsApi";
import { useGetInsuranceRecommendationMutation } from "@/src/redux/features/insurance/insuranceApi";

// ── Types ────────────────────────────────────────────────────────────────────

type Pet = {
  _id: string;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: string;
};

type FormData = {
  petName: string;
  species: string;
  breed: string;
  ageYears: string;
  existingConditions: string;
  budget: string;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function calcAge(dob: string): string {
  if (!dob) return "";
  const diff = Date.now() - new Date(dob).getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  return String(years);
}

// ── Question config ──────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: "petName",
    label: "What is your pet's name?",
    type: "text",
    placeholder: "e.g. Max",
    icon: "🐾",
  },
  {
    id: "species",
    label: "What type of pet?",
    type: "select",
    icon: "🐶",
    options: [
      { value: "dog", label: "🐶 Dog" },
      { value: "cat", label: "🐱 Cat" },
      { value: "bird", label: "🦜 Bird" },
      { value: "rabbit", label: "🐰 Rabbit" },
      { value: "other", label: "🐾 Other" },
    ],
  },
  {
    id: "breed",
    label: "What breed?",
    type: "text",
    placeholder: "e.g. Golden Retriever",
    icon: "📋",
  },
  {
    id: "ageYears",
    label: "How old is your pet? (years)",
    type: "number",
    placeholder: "e.g. 3",
    icon: "🎂",
  },
  {
    id: "existingConditions",
    label: "Does your pet have any existing health conditions?",
    type: "radio",
    icon: "🏥",
    options: [
      { value: "no", label: "No, healthy" },
      { value: "yes", label: "Yes, has conditions" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "budget",
    label: "What's your monthly budget for insurance?",
    type: "radio",
    icon: "💰",
    options: [
      { value: "low", label: "AED 90–150 (Basic)" },
      { value: "medium", label: "AED 150–250 (Standard)" },
      { value: "high", label: "AED 250+ (Premium)" },
    ],
  },
];

// ── Main Component ────────────────────────────────────────────────────────────

export default function InsuranceCalculatorPage() {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "form" | "result">("select");
  const [form, setForm] = useState<FormData>({
    petName: "",
    species: "",
    breed: "",
    ageYears: "",
    existingConditions: "",
    budget: "",
  });

  const { data: petsData, isLoading: petsLoading } = useGetMyPetsQuery({});
  const pets: Pet[] = petsData?.data ?? [];

  const [
    getRecommendation,
    { isLoading: isGenerating, data: result, error: apiError },
  ] = useGetInsuranceRecommendationMutation();

  function handleSelectPet(pet: Pet | null) {
    if (!pet) {
      setSelectedPetId(null);
      setForm({
        petName: "",
        species: "",
        breed: "",
        ageYears: "",
        existingConditions: "",
        budget: "",
      });
    } else {
      setSelectedPetId(pet._id);
      setForm({
        petName: pet.name,
        species: pet.species,
        breed: pet.breed,
        ageYears: calcAge(pet.dateOfBirth),
        existingConditions: "",
        budget: "",
      });
    }
    setStep("form");
  }

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    try {
      await getRecommendation(form).unwrap();
      setStep("result");
    } catch (err) {
      console.error("Failed to get recommendation:", err);
    }
  }

  const isFormComplete = Object.values(form).every((v) => v.trim() !== "");
  const insuranceResult = result?.data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020812] px-4 py-6 transition-colors">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/user/insurance"
            className="text-gray-500 dark:text-gray-400 text-xs hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center gap-1 mb-3"
          >
            ← Back to Compare Plans
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            ✨ AI Insurance Finder
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            Answer 5 quick questions — we'll match your pet to the best UAE plan
          </p>
        </div>

        {/* STEP: Pet Selector */}
        {step === "select" && (
          <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
            <CardBody className="p-5">
              <p className="font-semibold text-gray-900 dark:text-white text-sm mb-4">
                Do you want to use a pet from your profile?
              </p>

              {petsLoading ? (
                <div className="text-center py-8">
                  <Spinner size="sm" label="Loading your pets..." />
                </div>
              ) : (
                <div className="space-y-2">
                  {pets.map((pet) => (
                    <button
                      key={pet._id}
                      onClick={() => handleSelectPet(pet)}
                      className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-[#4682B4] transition-all text-left group"
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
                          {pet.species} · {pet.breed} ·{" "}
                          {calcAge(pet.dateOfBirth)} yrs
                        </p>
                      </div>
                      <span className="text-[#4682B4] dark:text-[#B8FF2E] text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Use this →
                      </span>
                    </button>
                  ))}

                  <button
                    onClick={() => handleSelectPet(null)}
                    className="w-full p-3 border border-dashed border-gray-300 dark:border-white/20 rounded-xl hover:border-[#4682B4] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all text-xs"
                  >
                    + Enter pet details manually
                  </button>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* STEP: Form */}
        {step === "form" && (
          <div className="space-y-3">
            {selectedPetId && (
              <div className="bg-[#4682B4]/10 dark:bg-[#4682B4]/20 border border-[#4682B4]/30 rounded-xl px-4 py-2.5 text-xs text-[#4682B4]">
                ℹ️ Pre-filled from your pet's profile. You can edit any field
                below.
              </div>
            )}

            {QUESTIONS.map((q) => (
              <Card
                key={q.id}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm"
              >
                <CardBody className="p-4">
                  <label className="block font-semibold text-gray-900 dark:text-white text-sm mb-2">
                    {q.icon} {q.label}
                  </label>

                  {(q.type === "text" || q.type === "number") && (
                    <Input
                      type={q.type}
                      value={form[q.id as keyof FormData]}
                      onChange={(e) =>
                        handleChange(q.id as keyof FormData, e.target.value)
                      }
                      placeholder={q.placeholder}
                      size="sm"
                      variant="bordered"
                      classNames={{
                        input: "text-xs",
                        inputWrapper: "h-9",
                      }}
                    />
                  )}

                  {q.type === "select" && (
                    <Select
                      selectedKeys={
                        form[q.id as keyof FormData]
                          ? [form[q.id as keyof FormData]]
                          : []
                      }
                      onChange={(e) =>
                        handleChange(q.id as keyof FormData, e.target.value)
                      }
                      placeholder="Select..."
                      size="sm"
                      variant="bordered"
                      classNames={{
                        trigger: "h-9",
                        value: "text-xs",
                      }}
                    >
                      {q.options?.map((opt) => (
                        <SelectItem key={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </Select>
                  )}

                  {q.type === "radio" && (
                    <RadioGroup
                      value={form[q.id as keyof FormData]}
                      onValueChange={(value) =>
                        handleChange(q.id as keyof FormData, value)
                      }
                      orientation="horizontal"
                      className="gap-2"
                    >
                      {q.options?.map((opt) => (
                        <Radio
                          key={opt.value}
                          value={opt.value}
                          size="sm"
                          classNames={{ label: "text-xs" }}
                        >
                          {opt.label}
                        </Radio>
                      ))}
                    </RadioGroup>
                  )}
                </CardBody>
              </Card>
            ))}

            <Button
              onPress={handleSubmit}
              isDisabled={!isFormComplete || isGenerating}
              isLoading={isGenerating}
              className="w-full bg-[#4682B4] dark:bg-[#B8FF2E] text-white dark:text-black font-bold py-2.5 rounded-xl text-sm"
            >
              {isGenerating
                ? "Analysing..."
                : `✨ Find Best Plan for ${form.petName || "My Pet"}`}
            </Button>

            {apiError && (
              <p className="text-red-500 text-xs text-center">
                Failed to get recommendation. Please try again.
              </p>
            )}
          </div>
        )}

        {/* STEP: Result */}
        {step === "result" && insuranceResult && (
          <div className="space-y-3">
            <Card className="bg-gradient-to-br from-[#4682B4]/10 to-[#00E5CC]/5 dark:from-[#4682B4]/20 dark:to-[#00E5CC]/10 border border-[#4682B4]/30 shadow-sm">
              <CardBody className="p-5">
                <span className="text-[#4682B4] dark:text-[#B8FF2E] text-[10px] font-bold uppercase tracking-wider">
                  AI Recommendation
                </span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  🏆 {insuranceResult.topProvider}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-xs mt-2 leading-relaxed">
                  {insuranceResult.recommendation}
                </p>
                <div className="mt-3 bg-gray-100 dark:bg-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                    Why this provider?
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 text-xs leading-relaxed">
                    {insuranceResult.reasoning}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
              <CardBody className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
                  💡 Tips for {form.petName}
                </h3>
                <ul className="space-y-1.5">
                  {insuranceResult.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-300"
                    >
                      <span className="text-[#4682B4] dark:text-[#B8FF2E] flex-shrink-0">
                        ✓
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>

            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/user/insurance" className="flex-1">
                <Button className="w-full bg-[#4682B4] dark:bg-[#B8FF2E] text-white dark:text-black font-bold text-sm py-2.5 rounded-xl">
                  Compare All Plans →
                </Button>
              </Link>
              <Button
                onPress={() => setStep("select")}
                variant="bordered"
                className="flex-1 border border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-400 text-sm py-2.5 rounded-xl"
              >
                Try Another Pet
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
