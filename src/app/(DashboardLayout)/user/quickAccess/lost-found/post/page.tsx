"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { useCreateLostFoundPostMutation } from "@/src/redux/features/lostFound/lostFoundApi";
import { LF_EMIRATES, LF_SPECIES } from "@/src/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";

const SPECIES_EMOJI = {
  dog: "🐕",
  cat: "🐈",
  bird: "🦜",
  rabbit: "🐇",
  reptile: "🦎",
  other: "🐾",
};

const STEPS = [
  {
    id: "basic",
    title: "Basic info",
    emoji: "🐾",
    description: "Lost/found & pet type",
  },
  {
    id: "details",
    title: "Details",
    emoji: "📋",
    description: "Pet details & location",
  },
  {
    id: "contact",
    title: "Contact",
    emoji: "📞",
    description: "Your phone number",
  },
];

export default function PostLostFoundPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    type: "",
    species: "",
    petName: "",
    breed: "",
    color: "",
    description: "",
    microchipNumber: "",
    emirate: "",
    area: "",
    dateLostFound: "",
    reward: "",
    posterPhone: "",
  });

  const [createPost, { isLoading }] = useCreateLostFoundPostMutation();

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canContinue = () => {
    if (currentStep === 0) return form.type && form.species;
    if (currentStep === 1)
      return (
        form.color &&
        form.description?.length >= 10 &&
        form.emirate &&
        form.area &&
        form.dateLostFound
      );
    return form.posterPhone;
  };

  const handleSubmit = async () => {
    try {
      await createPost({
        type: form.type,
        species: form.species,
        emirate: form.emirate,
        petName: form.petName,
        breed: form.breed,
        color: form.color,
        description: form.description,
        microchipNumber: form.microchipNumber,
        area: form.area,
        dateLostFound: form.dateLostFound,
        reward: form.reward ? Number(form.reward) : undefined,
        posterPhone: form.posterPhone,
        photos: [],
      }).unwrap();
      toast.success("Report posted! 🐾");
      router.push("/user/quickAccess/lost-found");
    } catch {
      toast.error("Failed to post");
    }
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-transparent p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/user/quickAccess/lost-found"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-white mb-6"
        >
          ← Back
        </Link>

        {/* Two column layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT SIDE - Vertical Stepper */}
          <div className="md:w-64 flex-shrink-0">
            <div className="sticky top-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst/90 mb-4">
                PROGRESS
              </p>
              {STEPS.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div key={step.id} className="flex gap-3 mb-4">
                    {/* Step indicator */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                          ${isCompleted ? "bg-green-500 text-white" : ""}
                          ${isActive && !isCompleted ? "bg-steel-blue dark:bg-lime-burst text-white" : ""}
                          ${!isActive && !isCompleted ? "bg-gray-100 dark:bg-white/10 text-gray-400" : ""}
                        `}
                      >
                        {isCompleted ? <Check size={14} /> : step.emoji}
                      </div>
                      {index < STEPS.length - 1 && (
                        <div
                          className={`w-0.5 h-10 mt-1 rounded ${index < currentStep ? "bg-green-500" : "bg-gray-200 dark:bg-white/10"}`}
                        />
                      )}
                    </div>

                    {/* Step text */}
                    <div className="flex-1 pt-1">
                      <p
                        className={`text-xs font-semibold ${isActive ? "text-steel-blue dark:text-lime-burst" : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE - Form */}
          <div className="flex-1">
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              {/* Step 0: Basic info */}
              {currentStep === 0 && (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-bold mb-2">Lost or found?</p>
                    <div className="flex gap-3">
                      {[
                        {
                          val: "lost",
                          emoji: "😢",
                          label: "Lost",
                          color: "border-red-400 bg-red-50 dark:bg-red-900/20",
                        },
                        {
                          val: "found",
                          emoji: "🙌",
                          label: "Found",
                          color:
                            "border-green-400 bg-green-50 dark:bg-green-900/20",
                        },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => update("type", opt.val)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all
                            ${form.type === opt.val ? opt.color : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"}
                          `}
                        >
                          <span>{opt.emoji}</span>
                          <span className="font-medium text-sm">
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold mb-2">Pet type</p>
                    <div className="grid grid-cols-3 gap-2">
                      {LF_SPECIES.map((s) => (
                        <button
                          key={s}
                          onClick={() => update("species", s)}
                          className={`flex flex-col items-center py-3 rounded-xl border-2 transition-all
                            ${form.species === s ? "border-steel-blue bg-steel-blue/5 dark:bg-steel-blue/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"}
                          `}
                        >
                          <span className="text-2xl">{SPECIES_EMOJI[s]}</span>
                          <span className="text-xs capitalize mt-1">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <Input
                    label="Pet name (optional)"
                    size="sm"
                    value={form.petName}
                    onChange={(e) => update("petName", e.target.value)}
                  />
                  <Input
                    label="Breed (optional)"
                    size="sm"
                    value={form.breed}
                    onChange={(e) => update("breed", e.target.value)}
                  />
                  <Input
                    label="Color & markings *"
                    size="sm"
                    value={form.color}
                    onChange={(e) => update("color", e.target.value)}
                    isRequired
                  />
                  <Textarea
                    label="Description *"
                    placeholder="Any special features, collar, behavior..."
                    size="sm"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    minRows={2}
                  />
                  <Input
                    label="Microchip number (optional)"
                    size="sm"
                    value={form.microchipNumber}
                    onChange={(e) => update("microchipNumber", e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label="Emirate *"
                      size="sm"
                      selectedKeys={form.emirate ? [form.emirate] : []}
                      onChange={(e) => update("emirate", e.target.value)}
                    >
                      {LF_EMIRATES.map((e) => (
                        <SelectItem key={e}>{e}</SelectItem>
                      ))}
                    </Select>
                    <Input
                      label="Area *"
                      size="sm"
                      placeholder="e.g. JBR"
                      value={form.area}
                      onChange={(e) => update("area", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Date *"
                      type="date"
                      size="sm"
                      value={form.dateLostFound}
                      onChange={(e) => update("dateLostFound", e.target.value)}
                    />
                    {form.type === "lost" && (
                      <Input
                        label="Reward (AED)"
                        type="number"
                        size="sm"
                        placeholder="Optional"
                        value={form.reward}
                        onChange={(e) => update("reward", e.target.value)}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Contact */}
              {currentStep === 2 && (
                <div className="space-y-4 text-center">
                  <div className="text-5xl">📞</div>
                  <h2 className="text-xl font-bold">Almost there!</h2>
                  <p className="text-sm text-gray-500">
                    Leave your phone number so people can contact you
                  </p>
                  <Input
                    label="Phone number *"
                    type="tel"
                    size="sm"
                    placeholder="+971 50 XXX XXXX"
                    value={form.posterPhone}
                    onChange={(e) => update("posterPhone", e.target.value)}
                  />

                  <div className="mt-6 p-4 bg-white dark:bg-black/20 rounded-xl text-left text-sm">
                    <p className="font-bold mb-2">Quick review:</p>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <p>
                        <span className="text-gray-400">Type:</span>{" "}
                        {form.type || "—"}
                      </p>
                      <p>
                        <span className="text-gray-400">Pet:</span>{" "}
                        {form.species || "—"}{" "}
                        {form.petName ? `(${form.petName})` : ""}
                      </p>
                      <p>
                        <span className="text-gray-400">Location:</span>{" "}
                        {form.area || "—"}, {form.emirate || "—"}
                      </p>
                      <p>
                        <span className="text-gray-400">Date:</span>{" "}
                        {form.dateLostFound || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
                {currentStep > 0 && (
                  <Button
                    onPress={goBack}
                    variant="bordered"
                    size="sm"
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                {currentStep < 2 ? (
                  <Button
                    onPress={goNext}
                    isDisabled={!canContinue()}
                    size="sm"
                    className="flex-1 bg-steel-blue dark:bg-lime-burst/60 text-white dark:text-black"
                  >
                    Continue →
                  </Button>
                ) : (
                  <Button
                    onPress={handleSubmit}
                    isLoading={isLoading}
                    isDisabled={!canContinue()}
                    size="sm"
                    className="flex-1 bg-steel-blue dark:bg-lime-burst/60 text-white dark:text-black"
                  >
                    Post Report 🐾
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
