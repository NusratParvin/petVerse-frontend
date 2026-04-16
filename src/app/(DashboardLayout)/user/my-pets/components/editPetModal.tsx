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

  const handleSubmit = async (data: any) => {
    await updatePet({
      id: pet._id,
      ...data,
      weight: data.weight ? Number(data.weight) : undefined,
    }).unwrap();
    toast.success(`${data.name} updated successfully!  `);
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
