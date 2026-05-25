"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useGetMyPetsQuery } from "@/src/redux/features/pets/petsApi";
import { useGetInsuranceRecommendationMutation } from "@/src/redux/features/insurance/insuranceApi";
import { TPet } from "@/src/types";
import { calcAge } from "./components/helper";
import { QUESTIONS } from "./components/constants";
import { Header } from "./components/header";
import { PetSelector } from "./components/petSelector";
import { QuestionCard } from "./components/questionCard";
import { RecommendationResult } from "./components/recommendationResult";

export type InsuranceFormData = {
  petName: string;
  species: string;
  breed: string;
  ageYears: string;
  existingConditions: "no" | "yes" | "unsure" | "";
  conditionsList: string;
  budget: string;
};

export default function InsuranceCalculatorPage() {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "form" | "result">("select");
  const [form, setForm] = useState<InsuranceFormData>({
    petName: "",
    species: "",
    breed: "",
    ageYears: "",
    existingConditions: "",
    conditionsList: "",
    budget: "",
  });

  const { data: petsData, isLoading: petsLoading } = useGetMyPetsQuery({});
  const pets: TPet[] = petsData?.data ?? [];

  const [
    getRecommendation,
    { isLoading: isGenerating, data: result, error: apiError },
  ] = useGetInsuranceRecommendationMutation();

  function handleSelectPet(pet: TPet | null) {
    if (!pet) {
      setSelectedPetId(null);
      setForm({
        petName: "",
        species: "",
        breed: "",
        ageYears: "",
        existingConditions: "",
        conditionsList: "",
        budget: "",
      });
    } else {
      setSelectedPetId(pet._id);
      setForm({
        petName: pet.name,
        species: pet.species,
        breed: pet.breed ?? "",
        ageYears: calcAge(pet.dateOfBirth),
        existingConditions: "",
        conditionsList: "",
        budget: "",
      });
    }
    setStep("form");
  }

  function handleChange(field: keyof InsuranceFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleCondition(condition: string) {
    const current = form.conditionsList
      ? form.conditionsList
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const updated = current.includes(condition)
      ? current.filter((c) => c !== condition)
      : [...current, condition];
    handleChange("conditionsList", updated.join(", "));
  }

  async function handleSubmit() {
    const submitData = {
      petName: form.petName,
      species: form.species,
      breed: form.breed,
      ageYears: form.ageYears,
      existingConditions:
        form.existingConditions === "yes"
          ? form.conditionsList
          : form.existingConditions,
      budget: form.budget,
    };
    try {
      const res = await getRecommendation(submitData).unwrap();
      // console.log(res);
      setStep("result");
    } catch (err) {
      console.error("Failed to get recommendation:", err);
    }
  }

  const isFormComplete =
    form.petName.trim() !== "" &&
    form.species.trim() !== "" &&
    form.breed.trim() !== "" &&
    form.ageYears.trim() !== "" &&
    form.existingConditions !== "" &&
    form.budget !== "" &&
    (form.existingConditions !== "yes" || form.conditionsList.trim() !== "");

  const insuranceResult = result;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent p-3 sm:p-4 transition-colors">
      <div className="max-w-full mx-auto">
        <Header />

        {step === "select" && (
          <PetSelector
            pets={pets}
            isLoading={petsLoading}
            onSelectPet={handleSelectPet}
          />
        )}

        {step === "form" && (
          <div className="space-y-3">
            {selectedPetId && (
              <div className="bg-steel-blue/10 dark:bg-steel-blue/20 border border-steel-blue/30 rounded-md px-4 py-2.5 text-xs text-steel-blue dark:text-white/70">
                ℹ️ Pre-filled from your pet's profile. You can edit any field
                below.
              </div>
            )}

            {QUESTIONS.map((q) => (
              <QuestionCard
                key={q.id}
                q={q}
                form={form}
                onChange={handleChange}
                onToggleCondition={toggleCondition}
              />
            ))}

            <Button
              onPress={handleSubmit}
              isDisabled={!isFormComplete || isGenerating}
              isLoading={isGenerating}
              className="w-full bg-steel-blue dark:bg-lime-burst text-white dark:text-black font-bold py-2.5 rounded-md text-sm"
            >
              {isGenerating
                ? "Analyzing..."
                : `✨ Find Best Plan for ${form.petName || form.species}`}
            </Button>

            {apiError && (
              <p className="text-red-500 text-xs text-center">
                Failed to get recommendation. Please try again.
              </p>
            )}
          </div>
        )}

        {step === "result" && insuranceResult && (
          <RecommendationResult
            result={insuranceResult}
            petName={form.petName}
            onTryAgain={() => setStep("select")}
          />
        )}
      </div>
    </div>
  );
}
