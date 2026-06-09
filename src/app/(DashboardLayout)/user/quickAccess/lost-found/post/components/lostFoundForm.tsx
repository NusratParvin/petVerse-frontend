"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardBody, Button } from "@heroui/react";
import { useRouter, useParams } from "next/navigation"; // ← Add useParams
import { toast } from "sonner";
import { isFuture, isValid, parseISO } from "date-fns";
import {
  useCreateLostFoundPostMutation,
  useUpdateLostFoundPostMutation, // ← Add update hook
  useGetLostFoundPostByIdQuery, // ← Add fetch hook
} from "@/src/redux/features/lostFound/lostFoundApi";
import { TEmirate, TSpecies } from "@/src/types";
import { DesktopStepper, MobileStepper } from "./stepper";
import { StepBasicInfo } from "./stepBasicInfo";
import { StepDetails } from "./stepDetails";
import { StepPhotos } from "./stepphotos";

// Types
export interface FormData {
  type: string;
  species: TSpecies | "";
  petName: string;
  breed: string;
  color: string;
  description: string;
  microchipNumber: string;
  emirate: TEmirate | "";
  area: string;
  dateLostFound: string;
  reward: string;
  posterPhone: string;
  photos: string[];
}

export const SPECIES_OPTIONS = [
  { value: "dog", label: "Dog", emoji: "🐕" },
  { value: "cat", label: "Cat", emoji: "🐈" },
  { value: "bird", label: "Bird", emoji: "🦜" },
  { value: "fish", label: "Fish", emoji: "🐠" },
  { value: "rabbit", label: "Rabbit", emoji: "🐇" },
  { value: "reptile", label: "Reptile", emoji: "🦎" },
  { value: "other", label: "Other", emoji: "🐾" },
] as const;

const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  0: ["type", "species"],
  1: [
    "color",
    "description",
    "emirate",
    "area",
    "dateLostFound",
    "posterPhone",
  ],
  2: [],
};

function getFieldError(field: keyof FormData, value: string): string {
  if (field === "type") return value ? "" : "Please select Lost or Found";
  if (field === "species") return value ? "" : "Please select a pet type";
  if (field === "color") return value ? "" : "Color & markings is required";
  if (field === "emirate") return value ? "" : "Please select an emirate";
  if (field === "area") return value ? "" : "Area is required";

  if (field === "description") {
    if (!value) return "Description is required";
    if (value.length < 10) return "Description must be at least 10 characters";
  }

  if (field === "dateLostFound") {
    if (!value) return "Date is required";
    const d = parseISO(value);
    if (!isValid(d)) return "Invalid date format";
    if (isFuture(d)) return "Date cannot be in the future";
  }

  if (field === "posterPhone") {
    if (!value) return "Phone number is required";
    const uaeRegex = /^(\+971|0)?[50|52|54|55|56|58|2|3|4|6|7|9]\d{7}$/;
    if (!uaeRegex.test(value) && value.length < 12)
      return "Enter a valid UAE phone number";
  }

  return "";
}

const INITIAL_FORM: FormData = {
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
  photos: [],
};

// Helper to check if we're in edit mode
const useEditMode = () => {
  const params = useParams();
  const id = params?.id as string;
  return { isEdit: !!id, id };
};

const LostFoundForm = () => {
  const router = useRouter();
  const { isEdit, id } = useEditMode(); // ← Detect edit mode
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch existing data if in edit mode
  const { data: existingData, isLoading: isLoadingPost } =
    useGetLostFoundPostByIdQuery(id, {
      skip: !isEdit,
    });

  const [createPost, { isLoading: isCreating }] =
    useCreateLostFoundPostMutation();
  const [updatePost, { isLoading: isUpdating }] =
    useUpdateLostFoundPostMutation();
  const isLoading = isCreating || isUpdating;

  // Pre-fill form when editing
  useEffect(() => {
    if (isEdit && existingData?.data) {
      const post = existingData.data;
      setForm({
        type: post.type,
        species: post.species,
        petName: post.petName || "",
        breed: post.breed || "",
        color: post.color,
        description: post.description,
        microchipNumber: post.microchipNumber || "",
        emirate: post.emirate,
        area: post.area,
        dateLostFound: post.dateLostFound?.split("T")[0] || "",
        reward: post.reward?.toString() || "",
        posterPhone: post.posterPhone,
        photos: post.photos || [],
      });
    }
  }, [isEdit, existingData]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({
      ...prev,
      [field]: getFieldError(field as keyof FormData, value),
    }));
  };

  const updatePhotos = (urls: string[]) => {
    setForm((prev) => ({ ...prev, photos: urls }));
  };

  const validateCurrentStep = (): boolean => {
    const fields = STEP_FIELDS[currentStep];
    const newErrors: Record<string, string> = {};
    let valid = true;

    for (const field of fields) {
      const error = getFieldError(field, form[field] as string);
      if (error) {
        newErrors[field] = error;
        valid = false;
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return valid;
  };

  const canContinue = STEP_FIELDS[currentStep].every(
    (f) => !getFieldError(f, form[f] as string),
  );

  const goNext = () => {
    if (validateCurrentStep() && currentStep < 2) {
      setCurrentStep((s) => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (index: number) => {
    if (index < currentStep) {
      setCurrentStep(index);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    if (!form.type || !form.species || !form.emirate) return;

    const payload = {
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
      photos: form.photos,
    };

    try {
      if (isEdit) {
        console.log(payload);
        await updatePost({ id, payload }).unwrap();
        toast.success("Report updated! 🐾");
      } else {
        // ← Create new post
        await createPost(payload).unwrap();
        toast.success("Report posted! 🐾");
      }
      router.push("/user/quickAccess/lost-found");
      router.refresh();
    } catch {
      toast.error(isEdit ? "Failed to update" : "Failed to post");
    }
  };

  // Loading state for edit mode
  if (isEdit && isLoadingPost) {
    return <div className="text-center py-20">Loading post...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-transparent p-4 mb-44">
      <div className="w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-12">
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white">
              {isEdit ? "Edit Report" : "Report Lost / Found Pet"} 📢
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Help reunite pets with their families · Your report will be seen
              by thousands
            </p>
          </div>
          <Link
            href="/user/quickAccess/lost-found"
            className="text-xs text-gray-400 hover:text-steel-blue dark:hover:text-lime-burst transition-colors"
          >
            ← Back to Posts
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mx-4">
          <div
            className={isMobile ? "w-full" : "lg:w-52 md:w-44 flex-shrink-0"}
          >
            {isMobile ? (
              <MobileStepper currentStep={currentStep} goToStep={goToStep} />
            ) : (
              <DesktopStepper currentStep={currentStep} goToStep={goToStep} />
            )}
          </div>

          <div className="flex-1">
            <Card className="bg-default-50 dark:bg-white/5 border border-default-200 dark:border-white/10 rounded-md shadow-md">
              <CardBody className="p-6">
                {currentStep === 0 && (
                  <StepBasicInfo
                    form={form}
                    errors={errors}
                    updateField={updateField}
                  />
                )}
                {currentStep === 1 && (
                  <StepDetails
                    form={form}
                    errors={errors}
                    updateField={updateField}
                  />
                )}
                {currentStep === 2 && (
                  <StepPhotos
                    form={form}
                    errors={errors}
                    updatePhotos={updatePhotos}
                  />
                )}

                <div className="flex gap-3 mt-6 pt-4 border-t border-default-200 dark:border-white/10 mb-12">
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
                      isDisabled={!canContinue}
                      size="sm"
                      radius="sm"
                      className="flex-1 bg-steel-blue text-white font-bold dark:bg-lime-burst/70 dark:text-black/80 py-2"
                    >
                      Continue →
                    </Button>
                  ) : (
                    <Button
                      onPress={handleSubmit}
                      isLoading={isLoading}
                      size="sm"
                      radius="sm"
                      className="flex-1 bg-steel-blue text-white font-bold dark:bg-lime-burst/70 dark:text-black/80 py-2"
                    >
                      {isEdit ? "Update Report" : "Post Report"} 🐾
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

export default LostFoundForm;
