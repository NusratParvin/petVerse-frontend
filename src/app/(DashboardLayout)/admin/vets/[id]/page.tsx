"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  useGetSingleVetQuery,
  useUpdateVetMutation,
} from "@/src/redux/features/vets/vetsApi";
import VetForm from "../components/vetForm";
import { Button } from "@heroui/react";
import { Pencil } from "lucide-react";
import VetDetailsView from "../components/vetDetailsView";

export default function VetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const mode = searchParams.get("mode") || "view";

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

  const handleEditClick = () => {
    router.push(`/admin/vets/${id}?mode=edit`);
  };

  const handleBack = () => {
    if (mode === "edit") {
      router.push(`/admin/vets/${id}?mode=view`);
    } else {
      router.back();
    }
  };

  if (isLoadingVet) {
    return (
      <div className="p-6 max-w-full mx-auto">
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

  // Transform vet data to form format for edit mode
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
    priceRange: vet.priceRange,
    rating: vet.rating,
    reviewCount: vet.reviewCount,
  };

  const isEditMode = mode === "edit";

  return (
    <div className="p-3 sm:p-3 max-w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleBack}
            className="text-default-500 hover:text-default-700 dark:text-default-400 dark:hover:text-default-200 transition-colors"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {isEditMode ? "Edit Vet Clinic" : "View Vet Clinic"}
            </h1>
            <p className="text-xs sm:text-sm text-default-500 mt-1">
              {isEditMode
                ? `Update ${vet.clinicName} details`
                : `Viewing ${vet.clinicName} details`}
            </p>
          </div>
        </div>

        {/* Show Edit button only in view mode */}
        {!isEditMode && (
          <Button
            size="sm"
            variant="flat"
            startContent={<Pencil size={16} />}
            onPress={handleEditClick}
            className="bg-steel-blue/10 dark:bg-lime-burst/10 text-steel-blue dark:text-lime-burst hover:bg-steel-blue/20 dark:hover:bg-lime-burst/20 transition-all w-full sm:w-auto"
          >
            Edit Clinic
          </Button>
        )}
      </div>

      <div className="bg-default-50 dark:bg-default-100/5 border border-divider rounded-2xl overflow-hidden p-4 sm:p-6">
        {isEditMode ? (
          <VetForm
            initial={initialFormData}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            isEdit={true}
          />
        ) : (
          <VetDetailsView vet={vet} />
        )}
      </div>
    </div>
  );
}
