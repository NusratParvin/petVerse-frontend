"use client";

import { useState, useRef } from "react";
import { Button, Spinner } from "@heroui/react";
import {
  useAddHealthRecordMutation,
  useGetMyPetsQuery,
} from "@/src/redux/features/pets/petsApi";
import {
  useParseVetNotesMutation,
  ParsedHealthRecord,
} from "@/src/redux/features/importWizard/importWizardApi";
import { downloadHealthPassport } from "./HealthPassportPDF";
import { TPet } from "@/src/types";

// ── Record type config ────────────────────────────────────────────────────────
const TYPE_META: Record<
  string,
  { label: string; color: string; emoji: string }
> = {
  vaccine: {
    label: "Vaccine",
    emoji: "💉",
    color:
      "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700",
  },
  "vet-visit": {
    label: "Vet Visit",
    emoji: "🏥",
    color:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  },
  medication: {
    label: "Medication",
    emoji: "💊",
    color:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  },
  grooming: {
    label: "Grooming",
    emoji: "✂️",
    color:
      "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-700",
  },
  "lab-test": {
    label: "Lab Test",
    emoji: "🔬",
    color:
      "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700",
  },
  surgery: {
    label: "Surgery",
    emoji: "🔪",
    color:
      "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
  },
  imaging: {
    label: "Imaging",
    emoji: "🩻",
    color:
      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700",
  },
  hospitalization: {
    label: "Hospitalization",
    emoji: "🛏️",
    color:
      "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700",
  },
  other: {
    label: "Other",
    emoji: "📄",
    color:
      "bg-default-100 dark:bg-default-100/10 text-default-500 border-default-200 dark:border-default-700",
  },
};

const STEPS = ["Select Pet", "Upload / Paste", "Review", "Done"];
const MAX_FILES = 5;
const ACCEPTED = "image/jpeg,image/png,image/webp,application/pdf";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatFileSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)}KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

// ─────────────────────────────────────────────────────────────────────────────
export default function ImportWizard() {
  const [step, setStep] = useState(0);
  const [selectedPet, setSelectedPet] = useState<TPet | null>(null);

  // Input mode: "upload" or "text"
  const [inputMode, setInputMode] = useState<"upload" | "text">("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [rawText, setRawText] = useState("");

  const [records, setRecords] = useState<ParsedHealthRecord[]>([]);
  const [aiSummary, setAiSummary] = useState("");
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [savedCount, setSavedCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: petsData, isLoading: petsLoading } = useGetMyPetsQuery({});
  const pets: TPet[] = petsData?.data ?? [];

  const [parseVetNotes, { isLoading: isParsing }] = useParseVetNotesMutation();
  const [addHealthRecord] = useAddHealthRecordMutation();

  // ── File handling ─────────────────────────────────────────────────────────
  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(
      (f) => f.size <= 10 * 1024 * 1024, // 10MB limit
    );
    setFiles((prev) => {
      const combined = [...prev, ...valid];
      return combined.slice(0, MAX_FILES); // cap at 5
    });
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  // ── Step navigation ───────────────────────────────────────────────────────
  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => s - 1);

  const canProceedToReview =
    inputMode === "upload" ? files.length > 0 : rawText.trim().length >= 10;

  // ── Step 2 → 3: call backend ──────────────────────────────────────────────
  const handleParse = async () => {
    try {
      console.log("hit", inputMode, files);
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

  // ── Step 3 → 4: save records ──────────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedPet) return;
    let count = 0;
    for (const i of checked) {
      const r = records[i];
      try {
        await addHealthRecord({
          petId: selectedPet._id,
          body: {
            type: r.type,
            title: r.title,
            date: r.date,
            nextDueDate: r.nextDueDate,
            notes: r.notes,
            cost: r.cost,
            vetName: r.vetName,
          },
        }).unwrap();
        count++;
      } catch {
        // skip failed records silently
      }
    }
    setSavedCount(count);
    goNext();
  };

  // ── PDF export ────────────────────────────────────────────────────────────
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

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setStep(0);
    setSelectedPet(null);
    setFiles([]);
    setRawText("");
    setRecords([]);
    setAiSummary("");
    setChecked(new Set());
    setSavedCount(0);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5 p-3 sm:p-5 w-full max-w-2xl mx-auto">
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

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-all
                ${
                  i < step
                    ? "bg-primary border-primary text-white"
                    : i === step
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-default-100 dark:bg-default-100/10 border-default-200 dark:border-default-700 text-default-400"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`text-[10px] hidden sm:block ${i === step ? "text-primary font-medium" : "text-default-400"}`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 mx-1 mb-4 transition-all ${i < step ? "bg-primary" : "bg-default-200 dark:bg-default-700"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 0: Select Pet ── */}
      {step === 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-default-600 dark:text-default-400">
            Which pet are these records for?
          </p>
          {petsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="sm" />
            </div>
          ) : pets.length === 0 ? (
            <p className="text-center py-8 text-default-400 text-sm">
              No pets found. Add a pet first.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {pets.map((pet) => (
                <button
                  key={pet._id}
                  onClick={() => setSelectedPet(pet)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
                    ${
                      selectedPet?._id === pet._id
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-default-200 dark:border-default-100/10 hover:border-primary/50"
                    }`}
                >
                  <div className="w-12 h-12 rounded-full bg-default-100 dark:bg-default-100/10 flex items-center justify-center text-2xl overflow-hidden">
                    {pet.profilePhoto ? (
                      <img
                        src={pet.profilePhoto}
                        alt={pet.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : pet.species === "dog" ? (
                      "🐶"
                    ) : pet.species === "cat" ? (
                      "🐱"
                    ) : pet.species === "bird" ? (
                      "🐦"
                    ) : (
                      "🐾"
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-default-900 dark:text-default-100">
                      {pet.name}
                    </p>
                    <p className="text-[10px] text-default-400 capitalize">
                      {pet.species}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
          <Button
            color="primary"
            size="sm"
            radius="lg"
            isDisabled={!selectedPet}
            onPress={goNext}
            className="self-end mt-1"
          >
            Continue →
          </Button>
        </div>
      )}

      {/* ── STEP 1: Upload or Paste ── */}
      {step === 1 && (
        <div className="flex flex-col gap-3">
          {/* Pet pill */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-default-100 dark:bg-default-100/5 border border-default-200 dark:border-default-100/10">
            <span className="text-lg">
              {selectedPet?.species === "dog"
                ? "🐶"
                : selectedPet?.species === "cat"
                  ? "🐱"
                  : selectedPet?.species === "bird"
                    ? "🐦"
                    : "🐾"}
            </span>
            <div>
              <p className="text-xs font-semibold text-default-900 dark:text-default-100">
                {selectedPet?.name}
              </p>
              <p className="text-[10px] text-default-400 capitalize">
                {selectedPet?.species} · {selectedPet?.breed}
              </p>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-1 p-1 rounded-lg bg-default-100 dark:bg-default-100/10 w-fit">
            {(["upload", "text"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${
                    inputMode === mode
                      ? "bg-white dark:bg-default-100/10 text-default-900 dark:text-white shadow-sm"
                      : "text-default-500 hover:text-default-700"
                  }`}
              >
                {mode === "upload" ? "📎 Upload Invoice" : "✏️ Paste Text"}
              </button>
            ))}
          </div>

          {/* Upload mode */}
          {inputMode === "upload" && (
            <div className="flex flex-col gap-2">
              {/* Drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  addFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                  ${
                    dragOver
                      ? "border-primary bg-primary/5"
                      : "border-default-200 dark:border-default-100/20 hover:border-primary/50 hover:bg-default-50 dark:hover:bg-default-100/5"
                  }`}
              >
                <span className="text-3xl select-none">📄</span>
                <div className="text-center">
                  <p className="text-xs font-medium text-default-700 dark:text-default-300">
                    Drop invoices here or click to browse
                  </p>
                  <p className="text-[10px] text-default-400 mt-0.5">
                    JPG, PNG, WEBP, PDF · up to {MAX_FILES} files · 10MB each
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED}
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>

              {/* File list */}
              {files.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-default-100 dark:bg-default-100/5 border border-default-200 dark:border-default-100/10"
                    >
                      <span className="text-sm shrink-0">
                        {f.type === "application/pdf" ? "📕" : "🖼️"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-default-900 dark:text-default-100 truncate">
                          {f.name}
                        </p>
                        <p className="text-[10px] text-default-400">
                          {formatFileSize(f.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(i)}
                        className="text-default-400 hover:text-red-500 transition-colors text-xs p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {files.length < MAX_FILES && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] text-primary hover:underline self-start"
                    >
                      + Add more ({MAX_FILES - files.length} remaining)
                    </button>
                  )}
                </div>
              )}

              <p className="text-[10px] text-default-400">
                💡 Works best with clear photos or PDF invoices from UAE vet
                clinics
              </p>
            </div>
          )}

          {/* Text mode */}
          {inputMode === "text" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-default-700 dark:text-default-300">
                Paste vet notes, WhatsApp messages, discharge instructions, or
                anything
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`Examples:\n• "Max got Rabies vaccine today, next due March 2026, Dr. Ahmed"\n• "Annual checkup — all good, weight 12kg, AED 150"\n• Paste a full discharge summary`}
                rows={9}
                className="w-full rounded-xl border border-default-200 dark:border-default-100/10
                           bg-white dark:bg-default-50/5
                           text-default-900 dark:text-default-100
                           placeholder:text-default-300 dark:placeholder:text-default-600
                           text-xs p-3 resize-none
                           focus:outline-none focus:ring-1 focus:ring-primary/50 transition"
              />
              <p className="text-[10px] text-default-400">
                {rawText.length} / 8000 characters
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-between mt-1">
            <Button variant="flat" size="sm" radius="lg" onPress={goBack}>
              ← Back
            </Button>
            <Button
              color="primary"
              size="sm"
              radius="lg"
              isDisabled={!canProceedToReview || isParsing}
              isLoading={isParsing}
              onPress={handleParse}
            >
              {isParsing
                ? files.length > 0
                  ? "Reading invoice…"
                  : "AI is reading notes…"
                : "Extract Records →"}
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Review ── */}
      {step === 2 && (
        <div className="flex flex-col gap-3">
          {/* AI summary */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
            <span className="text-base mt-0.5">🤖</span>
            <div>
              <p className="text-xs font-semibold text-primary mb-0.5">
                AI Summary
              </p>
              <p className="text-xs text-default-600 dark:text-default-400">
                {aiSummary}
              </p>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="text-center py-6 text-default-400 text-sm">
              No records detected. Try a clearer image or more detailed text.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs text-default-500">
                  {checked.size} of {records.length} selected
                </p>
                <button
                  onClick={() =>
                    setChecked(
                      checked.size === records.length
                        ? new Set()
                        : new Set(records.map((_, i) => i)),
                    )
                  }
                  className="text-[11px] text-primary hover:underline"
                >
                  {checked.size === records.length
                    ? "Deselect all"
                    : "Select all"}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {records.map((r, i) => {
                  const meta = TYPE_META[r.type] ?? TYPE_META.other;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        const next = new Set(checked);
                        next.has(i) ? next.delete(i) : next.add(i);
                        setChecked(next);
                      }}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all
                        ${
                          checked.has(i)
                            ? "border-primary/40 bg-primary/5 dark:bg-primary/8"
                            : "border-default-200 dark:border-default-100/10 opacity-50"
                        }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-4 h-4 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all
                        ${checked.has(i) ? "bg-primary border-primary" : "border-default-300"}`}
                      >
                        {checked.has(i) && (
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-semibold text-default-900 dark:text-default-100">
                            {meta.emoji} {r.title}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${meta.color}`}
                          >
                            {meta.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                          <span className="text-[11px] text-default-400">
                            📅 {r.date}
                          </span>
                          {r.nextDueDate && (
                            <span className="text-[11px] text-default-400">
                              🔔 Due {r.nextDueDate}
                            </span>
                          )}
                          {r.vetName && (
                            <span className="text-[11px] text-default-400">
                              👨‍⚕️ {r.vetName}
                            </span>
                          )}
                          {r.cost && (
                            <span className="text-[11px] text-default-400">
                              💰 AED {r.cost}
                            </span>
                          )}
                        </div>
                        {r.notes && (
                          <p className="text-[11px] text-default-400 mt-0.5 italic truncate">
                            {r.notes}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="flex gap-2 justify-between mt-1">
            <Button variant="flat" size="sm" radius="lg" onPress={goBack}>
              ← Back
            </Button>
            <Button
              color="primary"
              size="sm"
              radius="lg"
              isDisabled={checked.size === 0}
              onPress={handleSave}
            >
              Save {checked.size} Record{checked.size !== 1 ? "s" : ""} →
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Done ── */}
      {step === 3 && (
        <div className="flex flex-col items-center gap-5 py-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-3xl">
            🎉
          </div>
          <div>
            <p className="text-default-900 dark:text-default-100 font-semibold text-sm">
              {savedCount} record{savedCount !== 1 ? "s" : ""} saved to{" "}
              {selectedPet?.name}'s profile!
            </p>
            <p className="text-default-400 text-xs mt-1">
              View them grouped by visit on the Pet Profile page.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 w-full max-w-xs">
            <Button
              variant="flat"
              color="primary"
              size="sm"
              radius="lg"
              className="w-full"
              isLoading={isExporting}
              onPress={handleExport}
            >
              {isExporting
                ? "Generating PDF…"
                : "⬇ Download Health Passport PDF"}
            </Button>
            <p className="text-[10px] text-default-400">
              A clean PDF with all of {selectedPet?.name}'s imported records
            </p>
          </div>

          <Button variant="flat" size="sm" radius="lg" onPress={handleReset}>
            Import More Records
          </Button>
        </div>
      )}
    </div>
  );
}
