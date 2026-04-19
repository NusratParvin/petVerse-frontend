"use client";

import { useUpdateHealthRecordMutation } from "@/src/redux/features/pets/petsApi";
import { healthRecordToFormData } from "./modal/healthRecord/constants";
import HealthRecordModal from "./modal/healthRecord/HealthRecordModal";
import { THealthRecord } from "@/src/types";
import { toast } from "sonner";

interface EditPetRecordProps {
  isOpen: boolean;
  onClose: () => void;
  petId: string;

  healthRecord: THealthRecord;
}

const EditHealthRecord = ({
  isOpen,
  onClose,
  healthRecord,
  petId,
}: EditPetRecordProps) => {
  const [updateRecord, { isLoading }] = useUpdateHealthRecordMutation();
  // console.log(healthRecord);
  const handleSubmit = async (formData: any) => {
    const payload = {
      petId,
      recordId: healthRecord._id,
      ...formData,
      cost: formData.cost ? Number(formData.cost) : undefined,
    };

    console.log(payload);

    try {
      await updateRecord(payload).unwrap();
      toast.success("Health record updated! 💉");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update record");
    }
  };
  return (
    <HealthRecordModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Health Record"
      subtitle="Update your pet's medical history"
      initialData={healthRecordToFormData(healthRecord)}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitLabel="Save Changes 💉"
    />
  );
};

export default EditHealthRecord;
