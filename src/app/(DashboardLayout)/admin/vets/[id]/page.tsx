"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGetSingleVetQuery,
  useUpdateVetMutation,
} from "@/src/redux/features/vets/vetsApi";
import VetForm from "../components/vetForm";

export default function EditVetPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    data: vet,
    isLoading: isLoadingVet,
    isError,
  } = useGetSingleVetQuery(id);
  const [updateVet, { isLoading: isUpdating }] = useUpdateVetMutation();

  const handleSubmit = async (formData: any) => {
    try {
      await updateVet({ id, body: formData }).unwrap();
      toast.success("Vet clinic updated successfully!");
      router.push("/admin/vets");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update clinic");
    }
  };

  if (isLoadingVet) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-white/10 rounded mb-2" />
          <div className="h-4 w-32 bg-white/5 rounded mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-white/5 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !vet) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
          <p className="text-red-500 font-medium">Clinic not found</p>
          <button
            onClick={() => router.push("/admin/vets")}
            className="mt-4 text-steel-blue hover:underline"
          >
            ← Back to clinics
          </button>
        </div>
      </div>
    );
  }

  // Transform vet data to form format
  const initialFormData = {
    name: vet.name,
    clinicName: vet.clinicName,
    emirate: vet.emirate,
    area: vet.area,
    address: vet.address,
    phone: vet.phone,
    whatsapp: vet.whatsapp || "",
    email: vet.email || "",
    website: vet.website || "",
    coverPhoto: vet.coverPhoto || "",
    about: vet.about || "",
    googleMapsUrl: vet.googleMapsUrl || "",
    specialities: vet.specialities,
    workingHours: vet.workingHours || [],
    // serviceRates: vet.serviceRates || [],
    rating: vet.rating,
    reviewCount: vet.reviewCount,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-white/60 hover:text-white"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-white text-2xl font-bold">Edit Vet Clinic</h1>
          <p className="text-white/40 text-sm mt-1">
            Update {vet.clinicName} details
          </p>
        </div>
      </div>

      <div className="bg-[#0a1628] border border-white/10 rounded-2xl overflow-hidden">
        <VetForm
          initial={initialFormData}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
        />
      </div>
    </div>
  );
}
