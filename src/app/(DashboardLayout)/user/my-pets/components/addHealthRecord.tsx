"use client";

import { toast } from "sonner";
import { useAddHealthRecordMutation } from "@/src/redux/features/pets/petsApi";
import HealthRecordModal from "./modal/healthRecord/HealthRecordModal";

interface AddHealthRecordProps {
  isOpen: boolean;
  onClose: () => void;
  petId: string;
}

export default function AddHealthRecord({
  isOpen,
  onClose,
  petId,
}: AddHealthRecordProps) {
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
