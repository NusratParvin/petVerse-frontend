"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCreateMyPetMutation } from "@/src/redux/features/pets/petsApi";
import PetModal from "./modal/petInfo/petModal";

import { petToFormData } from "./modal/petInfo/schema";
interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPetModal({ isOpen, onClose }: AddPetModalProps) {
  const [createPet, { isLoading }] = useCreateMyPetMutation();

  const handleSubmit = async (data: any) => {
    await createPet({
      ...data,
      weight: data.weight ? Number(data.weight) : undefined,
    }).unwrap();
    toast.success(`${data.name} added successfully! 🐾`);
  };

  return (
    <PetModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add a Pet"
      subtitle="Enter your pet's details below"
      defaultValues={petToFormData({})}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      label="Add Pet"
    />
  );
}
