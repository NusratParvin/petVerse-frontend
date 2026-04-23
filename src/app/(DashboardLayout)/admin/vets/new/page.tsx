"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateVetMutation } from "@/src/redux/features/vets/vetsApi";
import VetForm from "../components/vetForm";
import { DAYS } from "@/src/constant";

const DEFAULT_FORM = {
  name: "",
  clinicName: "",
  emirate: "dubai",
  area: "",
  address: "",
  phone: "",
  whatsapp: "",
  email: "",
  website: "",
  coverPhoto: "",
  about: "",
  googleMapsUrl: "",
  specialities: [] as string[],
  workingHours: DAYS.map((day) => ({
    day,
    open: "09:00",
    close: "18:00",
    closed: false,
  })),
  serviceRates: [{ service: "Consultation", priceFrom: 150, priceTo: 300 }],
  rating: 4.5,
  reviewCount: 0,
};

export default function NewVetPage() {
  const router = useRouter();
  const [createVet, { isLoading }] = useCreateVetMutation();

  const handleSubmit = async (formData: typeof DEFAULT_FORM) => {
    try {
      await createVet(formData).unwrap();
      toast.success("Vet clinic added successfully!");
      router.push("/admin/vets");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add clinic");
    }
  };

  return (
    <div className="px-4 py-2 w-full mx-auto">
      <div className="flex justify-between items-center gap-4 mb-3">
        <div>
          <h1 className="text-base font-bold text-gray-900 dark:text-white/80">
            Add Vet Clinic
          </h1>
          <p className="text-xs text-gray-500 dark:text-white/40">
            Enter clinic details below
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-700 dark:text-white/60 dark:hover:text-white transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-[#0a1628]/50 rounded-none shadow-lg overflow-hidden">
        <VetForm
          initial={DEFAULT_FORM}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
