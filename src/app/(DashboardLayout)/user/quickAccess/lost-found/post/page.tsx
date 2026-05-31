"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Card,
  CardBody,
  RadioGroup,
  Radio,
  Progress,
} from "@heroui/react";
import { useCreateLostFoundPostMutation } from "@/src/redux/features/lostFound/lostFoundApi";
import { LF_EMIRATES } from "@/src/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { PawPrint, ClipboardList, Phone } from "lucide-react";

export const SPECIES_OPTIONS = [
  { value: "dog", label: "Dog", emoji: "🐕" },
  { value: "cat", label: "Cat", emoji: "🐈" },
  { value: "bird", label: "Bird", emoji: "🦜" },
  { value: "fish", label: "Fish", emoji: "🐠" },
  { value: "rabbit", label: "Rabbit", emoji: "🐇" },
  { value: "reptile", label: "Reptile", emoji: "🦎" },
  { value: "other", label: "Other", emoji: "🐾" },
] as const;

const STEPS = [
  {
    id: "basic",
    title: "Basic info",
    emoji: <PawPrint size={16} />,
    description: "Lost/found & pet type",
  },
  {
    id: "details",
    title: "Details",
    emoji: <ClipboardList size={16} />,
    description: "Pet details & location",
  },
  {
    id: "contact",
    title: "Contact",
    emoji: <Phone size={16} />,
    description: "Your phone number",
  },
];

const CreatePostLostFound = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        type: form.type as "lost" | "found",
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
      window.scrollTo(0, 0);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
      window.scrollTo(0, 0);
    }
  };

  // Render stepper based on screen size
  const renderStepper = () => {
    if (isMobile) {
      return (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <Button
                  isIconOnly
                  size="sm"
                  radius="full"
                  isDisabled={index > currentStep}
                  onPress={() => goToStep(index)}
                  color={
                    index < currentStep
                      ? "success"
                      : index === currentStep
                        ? "primary"
                        : "default"
                  }
                  variant={index <= currentStep ? "solid" : "flat"}
                  className="w-10 h-10"
                >
                  {index < currentStep ? <Check size={16} /> : step.emoji}
                </Button>
                <span
                  className={`text-[9px] font-medium mt-1 text-center ${
                    index === currentStep ? "text-primary" : "text-default-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <Progress
            value={((currentStep + 1) / STEPS.length) * 100}
            className="mt-4"
            color="primary"
            size="sm"
          />
        </div>
      );
    }

    // Vertical stepper for desktop
    return (
      <div className="sticky top-4">
        <p className="text-base font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst mb-4">
          Create post
        </p>
        {STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step.id} className="flex gap-4 mb-6 group ms-3">
              <div className="flex flex-col items-center">
                <Button
                  isIconOnly
                  size="sm"
                  radius="full"
                  isDisabled={index > currentStep}
                  onPress={() => goToStep(index)}
                  style={{
                    backgroundColor: isCompleted
                      ? "#21bd5b"
                      : isActive
                        ? "#4682B4"
                        : "#e5e7eb",
                    color: "white",
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                    boxShadow: isActive
                      ? "0 0 0 4px rgba(70, 130, 180, 0.3)"
                      : "none",
                    border: "none",
                  }}
                  className="w-10 h-10 transition-all duration-300 mt-1"
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={3} />
                  ) : (
                    <span className="text-lg">{step.emoji}</span>
                  )}
                </Button>
                {index < STEPS.length - 1 && (
                  <div
                    style={{
                      backgroundColor:
                        index < currentStep ? "#21bd5b" : "#e5e7eb",
                      width: "2px",
                      height: "80px",
                      marginTop: "8px",
                      borderRadius: "9999px",
                    }}
                  />
                )}
              </div>
              <div className="flex-1  ">
                <p
                  style={{
                    color: isActive
                      ? "#4682B4"
                      : isCompleted
                        ? "#21bd5b"
                        : "#9ca3af",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0 font-medium">
                  {step.description}
                </p>

                {/* Status indicators */}
                {isCompleted && !isActive && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[9px] text-green-600 dark:text-green-400 font-medium">
                      ✓ Completed
                    </p>
                  </div>
                )}

                {isActive && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <div className="w-1 h-1 rounded-full bg-steel-blue dark:bg-lime-burst animate-pulse" />
                    <p className="text-[9px] text-steel-blue dark:text-lime-burst font-medium">
                      Current step
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-transparent p-4">
      <div className="w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-12">
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Report Lost / Found Pet 📢
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Help reunite pets with their families · Your report will be seen
              by thousands
            </p>
          </div>
          <Link
            href="/user/quickAccess/lost-found"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-steel-blue dark:hover:text-lime-burst transition-colors mb-6"
          >
            ← Back to Posts
          </Link>
        </div>

        {/* Two column layout */}
        <div className="flex flex-col md:flex-row gap-6 mx-4 border">
          {/* LEFT SIDE - Stepper */}
          <div className={`${isMobile ? "w-full" : "md:w-52 flex-shrink-0"}`}>
            {renderStepper()}
          </div>

          {/* RIGHT SIDE - Form */}
          <div className="flex-1">
            <Card className="bg-default-50 dark:bg-white/5 border border-default-200 dark:border-white/10">
              <CardBody className="p-6">
                {/* Step 0: Basic info */}
                {currentStep === 0 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-bold mb-2">Lost or found?</p>
                      <div className="flex gap-3">
                        <Button
                          onPress={() => update("type", "lost")}
                          color={form.type === "lost" ? "danger" : "default"}
                          variant={form.type === "lost" ? "solid" : "bordered"}
                          className="flex-1 py-2 h-auto"
                          startContent={<span>😢</span>}
                        >
                          Lost
                        </Button>
                        <Button
                          onPress={() => update("type", "found")}
                          color={form.type === "found" ? "success" : "default"}
                          variant={form.type === "found" ? "solid" : "bordered"}
                          className="flex-1 py-2 h-auto"
                          startContent={<span>🙌</span>}
                        >
                          Found
                        </Button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-bold mb-2">Pet type</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SPECIES_OPTIONS.map((s) => (
                          <Button
                            key={s.value}
                            onPress={() => update("species", s.value)}
                            color={
                              form.species === s.value ? "primary" : "default"
                            }
                            variant={
                              form.species === s.value ? "solid" : "bordered"
                            }
                            className="flex flex-col items-center py-3 h-auto"
                            startContent={
                              <span className="text-2xl">{s.emoji}</span>
                            }
                          >
                            <span className="text-xs capitalize">
                              {s.label}
                            </span>
                          </Button>
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
                      variant="bordered"
                    />
                    <Input
                      label="Breed (optional)"
                      size="sm"
                      value={form.breed}
                      onChange={(e) => update("breed", e.target.value)}
                      variant="bordered"
                    />
                    <Input
                      label="Color & markings *"
                      size="sm"
                      value={form.color}
                      onChange={(e) => update("color", e.target.value)}
                      isRequired
                      variant="bordered"
                    />
                    <Textarea
                      label="Description *"
                      placeholder="Any special features, collar, behavior..."
                      size="sm"
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      minRows={2}
                      variant="bordered"
                    />
                    <Input
                      label="Microchip number (optional)"
                      size="sm"
                      value={form.microchipNumber}
                      onChange={(e) =>
                        update("microchipNumber", e.target.value)
                      }
                      variant="bordered"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Select
                        label="Emirate *"
                        size="sm"
                        selectedKeys={form.emirate ? [form.emirate] : []}
                        onChange={(e) => update("emirate", e.target.value)}
                        variant="bordered"
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
                        variant="bordered"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Date *"
                        type="date"
                        size="sm"
                        value={form.dateLostFound}
                        onChange={(e) =>
                          update("dateLostFound", e.target.value)
                        }
                        variant="bordered"
                      />
                      {form.type === "lost" && (
                        <Input
                          label="Reward (AED)"
                          type="number"
                          size="sm"
                          placeholder="Optional"
                          value={form.reward}
                          onChange={(e) => update("reward", e.target.value)}
                          startContent={
                            <span className="text-default-400">AED</span>
                          }
                          variant="bordered"
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
                    <p className="text-sm text-default-500">
                      Leave your phone number so people can contact you
                    </p>
                    <Input
                      label="Phone number *"
                      type="tel"
                      size="sm"
                      placeholder="+971 50 XXX XXXX"
                      value={form.posterPhone}
                      onChange={(e) => update("posterPhone", e.target.value)}
                      variant="bordered"
                    />

                    <Card className="mt-6 bg-white dark:bg-black/20 border border-default-200 dark:border-white/10">
                      <CardBody className="p-4">
                        <p className="font-bold mb-2 text-left">
                          Quick review:
                        </p>
                        <div className="space-y-1 text-xs text-default-600 dark:text-default-400 text-left">
                          <p>
                            <span className="text-default-400">Type:</span>{" "}
                            {form.type || "—"}
                          </p>
                          <p>
                            <span className="text-default-400">Pet:</span>{" "}
                            {form.species || "—"}{" "}
                            {form.petName ? `(${form.petName})` : ""}
                          </p>
                          <p>
                            <span className="text-default-400">Location:</span>{" "}
                            {form.area || "—"}, {form.emirate || "—"}
                          </p>
                          <p>
                            <span className="text-default-400">Date:</span>{" "}
                            {form.dateLostFound || "—"}
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-default-200 dark:border-white/10">
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
                      color="primary"
                      className="flex-1"
                    >
                      Continue →
                    </Button>
                  ) : (
                    <Button
                      onPress={handleSubmit}
                      isLoading={isLoading}
                      isDisabled={!canContinue()}
                      size="sm"
                      color="primary"
                      className="flex-1"
                    >
                      Post Report
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostLostFound;
