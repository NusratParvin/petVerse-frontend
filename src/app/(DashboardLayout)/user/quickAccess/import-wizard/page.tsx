"use client";

import { useState, useRef } from "react";
import {
  useAddHealthRecordMutation,
  useGetMyPetsQuery,
} from "@/src/redux/features/pets/petsApi";
import { useParseVetNotesMutation } from "@/src/redux/features/importWizard/importWizardApi";
import { downloadHealthPassport } from "./HealthPassportPDF";
import { ParsedHealthRecord, TPet } from "@/src/types";

// Import components

import { Step1 } from "./components/step1";
import { Step2 } from "./components/step2";
import { Step3 } from "./components/step3";
import { Step4 } from "./components/step4";
import { StepIndicator } from "./components/stepIndicator";

const STEPS = ["Select Pet", "Upload / Paste", "Review", "Done"];

export default function ImportWizard() {
  //   ALL STATE STAYS HERE
  const [step, setStep] = useState(0);
  const [selectedPet, setSelectedPet] = useState<TPet | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "text">("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [rawText, setRawText] = useState("");
  const [records, setRecords] = useState<ParsedHealthRecord[]>([]);
  const [aiSummary, setAiSummary] = useState("");
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [savedCount, setSavedCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);

  //   API HOOKS
  const { data: petsData, isLoading: petsLoading } = useGetMyPetsQuery({});
  const pets: TPet[] = petsData?.data ?? [];
  const [parseVetNotes, { isLoading: isParsing }] = useParseVetNotesMutation();
  const [addHealthRecord] = useAddHealthRecordMutation();

  //   HELPER FUNCTIONS
  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => s - 1);
  const resetWizard = () => {
    setStep(0);
    setSelectedPet(null);
    setFiles([]);
    setRawText("");
    setRecords([]);
    setAiSummary("");
    setChecked(new Set());
    setSavedCount(0);
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(
      (f) => f.size <= 10 * 1024 * 1024,
    );
    setFiles((prev) => [...prev, ...valid].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleParse = async () => {
    try {
      console.log(rawText);
      const res = await parseVetNotes({
        files: inputMode === "upload" ? files : undefined,
        text: inputMode === "text" ? rawText : undefined,
      }).unwrap();
      console.log(res);
      setRecords(res.data.records);
      setAiSummary(res.data.summary);
      setChecked(new Set(res.data.records.map((_, i) => i)));
      goNext();
    } catch {
      alert("Could not process your input. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!selectedPet) return;
    let count = 0;
    for (const i of checked) {
      const r = records[i];
      try {
        await addHealthRecord({
          petId: selectedPet._id,
          // body: {
          type: r.type,
          title: r.title,
          date: r.date,
          nextDueDate: r.nextDueDate,
          notes: r.notes,
          cost: r.cost,
          vetName: r.vetName,
          clinicName: r.clinicName,
          // },
        }).unwrap();
        count++;
      } catch {}
    }
    setSavedCount(count);
    goNext();
  };

  const handleExport = async () => {
    if (!selectedPet) return;
    setIsExporting(true);
    await downloadHealthPassport(
      selectedPet.name,
      selectedPet.species,
      selectedPet.breed,
      records.filter((_, i) => checked.has(i)),
    );
    setIsExporting(false);
  };

  //   RENDER
  return (
    <div className="flex flex-col gap-5 p-3 w-full mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 dark:text-white text-base font-bold flex items-center gap-2">
          Import Wizard <span>🪄</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
          Upload your vet invoice or paste notes — AI extracts and saves health
          records
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator steps={STEPS} currentStep={step} />

      {/* Step 0: Select Pet */}
      {step === 0 && (
        <Step1
          pets={pets}
          isLoading={petsLoading}
          selectedPet={selectedPet}
          onSelectPet={setSelectedPet}
          onContinue={goNext}
        />
      )}

      {/* Step 1: Upload */}
      {step === 1 && (
        <Step2
          selectedPet={selectedPet}
          inputMode={inputMode}
          onInputModeChange={setInputMode}
          files={files}
          onAddFiles={addFiles}
          onRemoveFile={removeFile}
          rawText={rawText}
          onRawTextChange={setRawText}
          isParsing={isParsing}
          onBack={goBack}
          onParse={handleParse}
          fileInputRef={fileInputRef}
        />
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <Step3
          records={records}
          aiSummary={aiSummary}
          checked={checked}
          onToggleRecord={(index) => {
            const next = new Set(checked);
            next.has(index) ? next.delete(index) : next.add(index);
            setChecked(next);
          }}
          onToggleAll={() => {
            setChecked(
              checked.size === records.length
                ? new Set()
                : new Set(records.map((_, i) => i)),
            );
          }}
          onBack={goBack}
          onSave={handleSave}
        />
      )}

      {/* Step 3: Done */}
      {step === 3 && (
        <Step4
          savedCount={savedCount}
          selectedPet={selectedPet}
          isExporting={isExporting}
          onExport={handleExport}
          onReset={resetWizard}
        />
      )}
    </div>
  );
}
