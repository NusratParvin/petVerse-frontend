// "use client";

// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { useCreateVetMutation } from "@/src/redux/features/vets/vetsApi";
// import VetForm from "../components/vetForm";
// import { DAYS } from "@/src/constant";
// import { Button } from "@heroui/react";
// import { ArrowLeft } from "lucide-react";

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
//   // serviceRates: [{ service: "Consultation", priceFrom: 150, priceTo: 300 }],
//   priceRange: { basePrice: 150, maxPrice: 300 },
//   rating: 4.5,
//   emergency: false,
//   reviewCount: 0,
// };

// export default function NewVetPage() {
//   const router = useRouter();
//   const [createVet, { isLoading }] = useCreateVetMutation();

//   const handleSubmit = async (formData: typeof DEFAULT_FORM) => {
//     try {
//       // console.log(formData);

//       const transformedData = {
//         ...formData,
//         priceRange: {
//           basePrice: Number(formData.priceRange?.basePrice) || 0,
//           maxPrice: Number(formData.priceRange?.maxPrice) || 0,
//         },
//         rating: Number(formData.rating),
//         reviewCount: Number(formData.reviewCount),
//       };
//       console.log(transformedData);

//       await createVet(transformedData).unwrap();
//       toast.success("Vet clinic added successfully!");
//       router.push("/admin/vets");
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Failed to add clinic");
//     }
//   };

//   return (
//     <div className="px-4 sm:px-6 py-4 sm:py-6 w-full mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
//         <div>
//           <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white/90">
//             Add Veterinary Clinic
//           </h1>
//           <p className="text-xs sm:text-sm text-gray-500 dark:text-white/40 mt-0.5 sm:mt-1">
//             Enter clinic details to add to directory
//           </p>
//         </div>

//         <Button
//           variant="light"
//           size="sm"
//           startContent={<ArrowLeft size={16} />}
//           onPress={() => router.back()}
//           className="text-gray-500 dark:text-white/60 w-fit"
//         >
//           Back
//         </Button>
//       </div>

//       {/* Form Card */}
//       <div className="bg-white dark:bg-[#0a1628]/50 rounded-xl sm:rounded-2xl shadow-lg border border-steel-blue/20 dark:border-white/10 overflow-hidden">
//         <VetForm
//           initial={DEFAULT_FORM}
//           onSubmit={handleSubmit}
//           isLoading={isLoading}
//           isEdit={false}
//         />
//       </div>
//     </div>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateVetMutation } from "@/src/redux/features/vets/vetsApi";
import VetForm from "../components/vetForm";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";

export default function NewVetPage() {
  const router = useRouter();
  const [createVet, { isLoading }] = useCreateVetMutation();

  const handleSubmit = async (formData: any) => {
    try {
      const transformedData = {
        ...formData,
        priceRange: {
          basePrice: Number(formData.priceRange?.basePrice) || 0,
          maxPrice: Number(formData.priceRange?.maxPrice) || 0,
        },
        rating: Number(formData.rating),
        reviewCount: Number(formData.reviewCount),
      };

      await createVet(transformedData).unwrap();
      toast.success("Vet clinic added successfully!");
      router.push("/admin/vets");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add clinic");
    }
  };

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base font-bold text-steel-blue dark:text-white/90">
            Add Veterinary Clinic
          </h1>
          <p className="text-xs   text-default-500 mt-1">
            Enter clinic details to add to directory
          </p>
        </div>

        <Button
          variant="ghost"
          onPress={() => router.back()}
          className="text-steel-blue hover:text-default-700 dark:text-lime-burst dark:hover:text-default-200 transition-colors border-none hover:bg-transparent"
        >
          ← Go Back
        </Button>
      </div>

      {/* Form Card */}
      {/* <div className="bg-white dark:bg-[#0a1628]/50 rounded-xl sm:rounded-2xl shadow-lg border border-steel-blue/20 dark:border-white/10 overflow-hidden"> */}
      <div className="bg-default-50 dark:bg-default-100/50 border-none shadow-lg border-divider rounded-md overflow-hidden p-4 sm:p-6 mb-24">
        <VetForm onSubmit={handleSubmit} isLoading={isLoading} isEdit={false} />
      </div>
    </div>
  );
}
