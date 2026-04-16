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
