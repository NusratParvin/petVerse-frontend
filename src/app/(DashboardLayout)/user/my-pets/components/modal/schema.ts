import { z } from "zod";
import { SPECIES, GENDERS } from "./constants";

export const petSchema = z.object({
  name: z.string().min(1, "Pet name is required").max(50, "Name too long"),
  species: z.enum(SPECIES),
  breed: z.string().optional(),
  gender: z.enum(GENDERS),
  dateOfBirth: z.string().optional(),
  weight: z.number().positive().optional(),
  microchipNumber: z.string().optional(),
  emirate: z.string().optional(),
  isNeutered: z.boolean(),
  whatsappAlerts: z.boolean(),
  whatsappNumber: z.string().optional(),
});

export type PetFormData = z.infer<typeof petSchema>;

// Helper to format pet data for form (handles date formatting)
export const petToFormData = (pet: any): PetFormData => ({
  name: pet.name || "",
  species: pet.species || "",
  breed: pet.breed || "",
  gender: pet.gender || "",
  dateOfBirth: pet.dateOfBirth ? pet.dateOfBirth.split("T")[0] : "",
  weight: pet.weight || "",
  microchipNumber: pet.microchipNumber || "",
  emirate: pet.emirate || "",
  isNeutered: pet.isNeutered ?? false,
  whatsappAlerts: pet.whatsappAlerts ?? false,
  whatsappNumber: pet.whatsappNumber || "",
});
