import { THealthRecord } from "@/src/types";
import {
  Syringe,
  Stethoscope,
  ClipboardList,
  User,
  FileText,
} from "lucide-react";

export const RECORD_TYPES = [
  { value: "vaccine", label: "Vaccine", icon: Syringe },
  { value: "vet-visit", label: "Vet Visit", icon: Stethoscope },
  { value: "medication", label: "Medication", icon: ClipboardList },
  { value: "grooming", label: "Grooming", icon: User },
  { value: "other", label: "Other", icon: FileText },
];

export const healthRecordToFormData = (healthRecord: THealthRecord) => ({
  type: healthRecord.type,
  title: healthRecord.title,
  date: healthRecord.date
    ? new Date(healthRecord.date).toISOString().split("T")[0]
    : "",
  nextDueDate: healthRecord.nextDueDate
    ? new Date(healthRecord.nextDueDate).toISOString().split("T")[0]
    : "",
  vetName: healthRecord.vetName || "",
  cost: healthRecord.cost?.toString() || "",
  notes: healthRecord.notes || "",
});
