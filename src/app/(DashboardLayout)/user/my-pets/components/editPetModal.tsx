"use client";

import { toast } from "sonner";
import { useUpdatePetMutation } from "@/src/redux/features/pets/petsApi";

import { TPet } from "@/src/types";
import PetModal from "./modal/petInfo/petModal";
import { petToFormData } from "./modal/petInfo/schema";

interface EditPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: TPet;
}

export default function EditPetModal({
  isOpen,
  onClose,
  pet,
}: EditPetModalProps) {
  const [updatePet, { isLoading }] = useUpdatePetMutation();

  const handleSubmit = async (formData: any) => {
    const payload = {
      id: pet._id,
      ...formData,
      // profilePhoto: formData.imageFile,

      weight: formData.weight ? Number(formData.weight) : undefined,
    };
    console.log(payload);
    await updatePet(payload).unwrap();
    toast.success(`${formData.name} updated successfully!  `);
  };

  return (
    <PetModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${pet.name}`}
      subtitle="Update your pet's details below"
      defaultValues={petToFormData(pet)}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      label="Save Changes 🐾"
    />
  );
}
