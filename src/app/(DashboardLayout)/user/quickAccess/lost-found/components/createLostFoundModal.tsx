"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { useCreateLostFoundPostMutation } from "@/src/redux/features/lostFound/lostFoundApi";
import { LF_EMIRATES, LF_SPECIES } from "@/src/types";
import { toast } from "sonner";

type Props = { isOpen: boolean; onClose: () => void; onSuccess: () => void };

const STEPS = ["Type & Pet", "Location & Date", "Contact & Photos"];

export default function CreateLostFoundModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    type: "lost" as "lost" | "found",
    petName: "",
    species: "dog",
    breed: "",
    color: "",
    description: "",
    emirate: "",
    area: "",
    dateLostFound: "",
    posterPhone: "",
    microchipNumber: "",
    reward: "",
    photos: [] as string[],
  });

  const [createPost, { isLoading }] = useCreateLostFoundPostMutation();

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function canProceed(): boolean {
    if (step === 0) return !!(form.species && form.color && form.description);
    if (step === 1) return !!(form.emirate && form.area && form.dateLostFound);
    if (step === 2) return !!form.posterPhone;
    return true;
  }

  async function handleSubmit() {
    try {
      await createPost({
        ...form,
        reward: form.reward ? Number(form.reward) : undefined,
        dateLostFound: form.dateLostFound,
        species: form.species as any,
        emirate: form.emirate as any,
      }).unwrap();
      toast.success("Post created! 🐾");
      onSuccess();
      onClose();
      setStep(0);
      setForm({
        type: "lost",
        petName: "",
        species: "dog",
        breed: "",
        color: "",
        description: "",
        emirate: "",
        area: "",
        dateLostFound: "",
        posterPhone: "",
        microchipNumber: "",
        reward: "",
        photos: [],
      });
    } catch {
      toast.error("Failed to post. Please try again.");
    }
  }

  const inputClass = {
    input: "text-xs",
    inputWrapper:
      "bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: "bg-white dark:bg-[#0a1628] border border-gray-200 dark:border-white/10",
        header: "border-b border-gray-100 dark:border-white/10",
        footer: "border-t border-gray-100 dark:border-white/10",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <p className="text-sm font-bold">🐾 Post Lost / Found Pet</p>
          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-1">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                    i <= step
                      ? "bg-steel-blue dark:bg-lime-burst text-white dark:text-black"
                      : "bg-gray-200 dark:bg-white/10 text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-[10px] hidden sm:block ${i === step ? "text-gray-900 dark:text-white font-medium" : "text-gray-400"}`}
                >
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <div className="w-4 h-px bg-gray-200 dark:bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </ModalHeader>

        <ModalBody className="py-4 space-y-3">
          {/* Step 0: Type & Pet */}
          {step === 0 && (
            <>
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Post type *
                </p>
                <RadioGroup
                  value={form.type}
                  onValueChange={(v) => update("type", v)}
                  orientation="horizontal"
                >
                  <Radio value="lost" classNames={{ label: "text-xs" }}>
                    🔴 I lost my pet
                  </Radio>
                  <Radio value="found" classNames={{ label: "text-xs" }}>
                    🟢 I found a pet
                  </Radio>
                </RadioGroup>
              </div>

              <Input
                label="Pet name (optional)"
                placeholder="e.g. Max"
                value={form.petName}
                onValueChange={(v) => update("petName", v)}
                size="sm"
                classNames={inputClass}
              />

              <Select
                label="Species *"
                selectedKeys={[form.species]}
                onChange={(e) => update("species", e.target.value)}
                size="sm"
                classNames={{
                  trigger: inputClass.inputWrapper,
                  value: "text-xs",
                }}
              >
                {LF_SPECIES.map((s) => (
                  <SelectItem key={s} className="text-xs capitalize">
                    {s}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Breed"
                placeholder="e.g. Golden Retriever"
                value={form.breed}
                onValueChange={(v) => update("breed", v)}
                size="sm"
                classNames={inputClass}
              />

              <Input
                label="Color / markings *"
                placeholder="e.g. Golden brown, white spot on chest"
                value={form.color}
                onValueChange={(v) => update("color", v)}
                size="sm"
                classNames={inputClass}
                isRequired
              />

              <Textarea
                label="Description *"
                placeholder="Distinctive features, behaviour, collar color..."
                value={form.description}
                onValueChange={(v) => update("description", v)}
                minRows={3}
                classNames={{
                  input: "text-xs",
                  inputWrapper: inputClass.inputWrapper,
                }}
                isRequired
              />

              <Input
                label="Microchip number (if known)"
                placeholder="e.g. 784XXXXXXXXXXXXXX"
                value={form.microchipNumber}
                onValueChange={(v) => update("microchipNumber", v)}
                size="sm"
                classNames={inputClass}
              />
            </>
          )}

          {/* Step 1: Location & Date */}
          {step === 1 && (
            <>
              <Select
                label="Emirate *"
                selectedKeys={form.emirate ? [form.emirate] : []}
                onChange={(e) => update("emirate", e.target.value)}
                size="sm"
                classNames={{
                  trigger: inputClass.inputWrapper,
                  value: "text-xs",
                }}
                isRequired
              >
                {LF_EMIRATES.map((e) => (
                  <SelectItem key={e} className="text-xs">
                    {e}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Area / Neighbourhood *"
                placeholder="e.g. JBR, Al Reem Island, Mirdif"
                value={form.area}
                onValueChange={(v) => update("area", v)}
                size="sm"
                classNames={inputClass}
                isRequired
              />

              <Input
                label="Date lost / found *"
                type="date"
                value={form.dateLostFound}
                onValueChange={(v) => update("dateLostFound", v)}
                size="sm"
                classNames={inputClass}
                isRequired
              />

              {form.type === "lost" && (
                <Input
                  label="Reward (AED)"
                  type="number"
                  placeholder="Optional reward amount"
                  value={form.reward}
                  onValueChange={(v) => update("reward", v)}
                  size="sm"
                  classNames={inputClass}
                  startContent={
                    <span className="text-gray-400 text-xs">AED</span>
                  }
                />
              )}
            </>
          )}

          {/* Step 2: Contact */}
          {step === 2 && (
            <>
              <Input
                label="Your phone number *"
                placeholder="+971 5X XXX XXXX"
                value={form.posterPhone}
                onValueChange={(v) => update("posterPhone", v)}
                size="sm"
                classNames={inputClass}
                isRequired
              />
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                📷 Photo upload coming soon — for now describe the pet clearly
                above.
              </p>
              {/* Summary preview */}
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-gray-900 dark:text-white mb-1.5">
                  📋 Summary
                </p>
                <p>
                  <span className="text-gray-400">Type:</span>{" "}
                  {form.type === "lost" ? "🔴 Lost" : "🟢 Found"}
                </p>
                {form.petName && (
                  <p>
                    <span className="text-gray-400">Name:</span> {form.petName}
                  </p>
                )}
                <p>
                  <span className="text-gray-400">Species:</span> {form.species}
                  {form.breed ? ` · ${form.breed}` : ""}
                </p>
                <p>
                  <span className="text-gray-400">Color:</span> {form.color}
                </p>
                <p>
                  <span className="text-gray-400">Location:</span> {form.area},{" "}
                  {form.emirate}
                </p>
                <p>
                  <span className="text-gray-400">Date:</span>{" "}
                  {form.dateLostFound}
                </p>
                {form.reward && (
                  <p>
                    <span className="text-gray-400">Reward:</span> AED{" "}
                    {form.reward}
                  </p>
                )}
              </div>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <div className="flex w-full items-center justify-between gap-2">
            <Button
              size="sm"
              variant="light"
              onPress={step === 0 ? onClose : () => setStep((s) => s - 1)}
              className="text-xs text-gray-500"
            >
              {step === 0 ? "Cancel" : "← Back"}
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                size="sm"
                isDisabled={!canProceed()}
                onPress={() => setStep((s) => s + 1)}
                className="bg-steel-blue dark:bg-lime-burst/60 text-white dark:text-black text-xs font-semibold"
              >
                Next →
              </Button>
            ) : (
              <Button
                size="sm"
                isLoading={isLoading}
                isDisabled={!canProceed()}
                onPress={handleSubmit}
                className="bg-steel-blue dark:bg-lime-burst/60 text-white dark:text-black text-xs font-semibold"
              >
                Post Now 🐾
              </Button>
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
