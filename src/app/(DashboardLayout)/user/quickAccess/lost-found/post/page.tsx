// "use client";

import LostFoundForm from "./components/lostFoundForm";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Card, CardBody, Button } from "@heroui/react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { isFuture, isValid, parseISO } from "date-fns";
// import { useCreateLostFoundPostMutation } from "@/src/redux/features/lostFound/lostFoundApi";
// import { DesktopStepper, MobileStepper } from "./components/stepper";
// import { StepBasicInfo } from "./components/stepBasicInfo";
// import { StepDetails } from "./components/stepDetails";
// import { TEmirate, TSpecies } from "@/src/types";
// import { StepPhotos } from "./components/stepphotos";

// //    Types    ─

// export interface FormData {
//   type: string;
//   species: TSpecies | "";
//   petName: string;
//   breed: string;
//   color: string;
//   description: string;
//   microchipNumber: string;
//   emirate: TEmirate | "";
//   area: string;
//   dateLostFound: string;
//   reward: string;
//   posterPhone: string;
//   photos: string[]; // ← Cloudinary URLs
// }

export const SPECIES_OPTIONS = [
  { value: "dog", label: "Dog", emoji: "🐕" },
  { value: "cat", label: "Cat", emoji: "🐈" },
  { value: "bird", label: "Bird", emoji: "🦜" },
  { value: "fish", label: "Fish", emoji: "🐠" },
  { value: "rabbit", label: "Rabbit", emoji: "🐇" },
  { value: "reptile", label: "Reptile", emoji: "🦎" },
  { value: "other", label: "Other", emoji: "🐾" },
] as const;

// const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
//   0: ["type", "species"],
//   1: [
//     "color",
//     "description",
//     "emirate",
//     "area",
//     "dateLostFound",
//     "posterPhone",
//   ],
//   2: [],
// };

// function getFieldError(field: keyof FormData, value: string): string {
//   if (field === "type") return value ? "" : "Please select Lost or Found";
//   if (field === "species") return value ? "" : "Please select a pet type";
//   if (field === "color") return value ? "" : "Color & markings is required";
//   if (field === "emirate") return value ? "" : "Please select an emirate";
//   if (field === "area") return value ? "" : "Area is required";

//   if (field === "description") {
//     if (!value) return "Description is required";
//     if (value.length < 10) return "Description must be at least 10 characters";
//   }

//   if (field === "dateLostFound") {
//     if (!value) return "Date is required";
//     const d = parseISO(value);
//     if (!isValid(d)) return "Invalid date format";
//     if (isFuture(d)) return "Date cannot be in the future";
//   }

//   if (field === "posterPhone") {
//     if (!value) return "Phone number is required";
//     const uaeRegex = /^(\+971|0)?[50|52|54|55|56|58|2|3|4|6|7|9]\d{7}$/;
//     if (!uaeRegex.test(value) && value.length < 12)
//       return "Enter a valid UAE phone number";
//   }

//   return "";
// }

// const INITIAL_FORM: FormData = {
//   type: "",
//   species: "",
//   petName: "",
//   breed: "",
//   color: "",
//   description: "",
//   microchipNumber: "",
//   emirate: "",
//   area: "",
//   dateLostFound: "",
//   reward: "",
//   posterPhone: "",
//   photos: [],
// };

// const CreatePostLostFound = () => {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);
//   const [form, setForm] = useState<FormData>(INITIAL_FORM);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [createPost, { isLoading }] = useCreateLostFoundPostMutation();

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 768);
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   // Update a text field + validate immediately
//   const updateField = (field: string, value: string) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({
//       ...prev,
//       [field]: getFieldError(field as keyof FormData, value),
//     }));
//   };

//   // Photos are string[], handled separately
//   const updatePhotos = (urls: string[]) => {
//     setForm((prev) => ({ ...prev, photos: urls }));
//   };

//   // Validate all required fields for this step
//   const validateCurrentStep = (): boolean => {
//     const fields = STEP_FIELDS[currentStep];
//     const newErrors: Record<string, string> = {};
//     let valid = true;

//     for (const field of fields) {
//       const error = getFieldError(field, form[field] as string);
//       if (error) {
//         newErrors[field] = error;
//         valid = false;
//       }
//     }

//     setErrors((prev) => ({ ...prev, ...newErrors }));
//     return valid;
//   };

//   // Continue button enabled only when required fields are all valid
//   const canContinue = STEP_FIELDS[currentStep].every(
//     (f) => !getFieldError(f, form[f] as string),
//   );

//   const goNext = () => {
//     if (validateCurrentStep() && currentStep < 2) {
//       setCurrentStep((s) => s + 1);
//       window.scrollTo(0, 0);
//     }
//   };

//   const goBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep((s) => s - 1);
//       window.scrollTo(0, 0);
//     }
//   };

//   const goToStep = (index: number) => {
//     if (index < currentStep) {
//       setCurrentStep(index);
//       window.scrollTo(0, 0);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validateCurrentStep()) return;
//     if (!form.type || !form.species || !form.emirate) return;

//     try {
//       await createPost({
//         type: form.type as "lost" | "found",
//         species: form.species,
//         emirate: form.emirate,
//         petName: form.petName,
//         breed: form.breed,
//         color: form.color,
//         description: form.description,
//         microchipNumber: form.microchipNumber,
//         area: form.area,
//         dateLostFound: form.dateLostFound,
//         reward: form.reward ? Number(form.reward) : undefined,
//         posterPhone: form.posterPhone,
//         photos: form.photos,
//       }).unwrap();

//       toast.success("Report posted! 🐾");
//       router.push("/user/quickAccess/lost-found");
//     } catch {
//       toast.error("Failed to post");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white dark:bg-transparent p-4 mb-44">
//       <div className="w-full mx-auto">
//         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-12">
//           <div>
//             <h1 className="text-base font-bold text-gray-900 dark:text-white">
//               Report Lost / Found Pet 📢
//             </h1>
//             <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
//               Help reunite pets with their families · Your report will be seen
//               by thousands
//             </p>
//           </div>
//           <Link
//             href="/user/quickAccess/lost-found"
//             className="text-xs text-gray-400 hover:text-steel-blue dark:hover:text-lime-burst transition-colors"
//           >
//             ← Back to Posts
//           </Link>
//         </div>

//         <div className="flex flex-col md:flex-row gap-6 mx-4">
//           <div
//             className={isMobile ? "w-full" : "lg:w-52 md:w-44 flex-shrink-0"}
//           >
//             {isMobile ? (
//               <MobileStepper currentStep={currentStep} goToStep={goToStep} />
//             ) : (
//               <DesktopStepper currentStep={currentStep} goToStep={goToStep} />
//             )}
//           </div>

//           <div className="flex-1">
//             <div>
//               <Card className="bg-default-50 dark:bg-white/5 border border-default-200 dark:border-white/10 rounded-md shadow-md">
//                 <CardBody className="p-6">
//                   {currentStep === 0 && (
//                     <StepBasicInfo
//                       form={form}
//                       errors={errors}
//                       updateField={updateField}
//                     />
//                   )}
//                   {currentStep === 1 && (
//                     <StepDetails
//                       form={form}
//                       errors={errors}
//                       updateField={updateField}
//                     />
//                   )}
//                   {currentStep === 2 && (
//                     <StepPhotos
//                       form={form}
//                       errors={errors}
//                       updatePhotos={updatePhotos}
//                     />
//                   )}

//                   <div className="flex gap-3 mt-6 pt-4 border-t border-default-200 dark:border-white/10 mb-12">
//                     {currentStep > 0 && (
//                       <Button
//                         onPress={goBack}
//                         variant="bordered"
//                         size="sm"
//                         className="flex-1"
//                       >
//                         Back
//                       </Button>
//                     )}

//                     {currentStep < 2 ? (
//                       <Button
//                         onPress={goNext}
//                         isDisabled={!canContinue}
//                         size="sm"
//                         radius="sm"
//                         className="flex-1 bg-steel-blue text-white font-bold dark:bg-lime-burst/70 dark:text-black/80 py-2"
//                       >
//                         Continue →
//                       </Button>
//                     ) : (
//                       <Button
//                         onPress={handleSubmit}
//                         isLoading={isLoading}
//                         size="sm"
//                         radius="sm"
//                         className="flex-1 bg-steel-blue text-white font-bold dark:bg-lime-burst/70 dark:text-black/80 py-2"
//                       >
//                         Post Report 🐾
//                       </Button>
//                     )}
//                   </div>
//                 </CardBody>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePostLostFound;

export default function CreatePage() {
  return <LostFoundForm />;
}
