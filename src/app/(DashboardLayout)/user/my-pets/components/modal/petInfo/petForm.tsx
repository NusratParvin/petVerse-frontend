"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petSchema, PetFormData } from "./schema";
import {
  SPECIES,
  GENDERS,
  EMIRATES,
  inputClass,
  labelClass,
} from "./constants";
import Image from "next/image";
import { useState } from "react";
import { Upload, X } from "lucide-react";

interface PetFormProps {
  defaultValues: PetFormData;
  onSubmit: (data: PetFormData) => Promise<void>;

  isLoading: boolean;
  submitLabel: string;
}

export default function PetForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel,
}: PetFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [imagePreview, setImagePreview] = useState<string>(
    defaultValues.profilePhoto || "",
  );

  const whatsappAlerts = watch("whatsappAlerts");

  const today = new Date().toISOString().split("T")[0];
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    setIsUploading(true);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET as string);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      setImagePreview(data.secure_url as string);
      setValue("profilePhoto", data.secure_url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setValue("profilePhoto", "");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-3 gap-4  "
    >
      <div className="flex flex-col gap-2   col-span-2">
        {/* Name */}
        <div>
          <label className={labelClass}>Pet Name *</label>
          <input
            {...register("name")}
            className={inputClass}
            placeholder="e.g. Max"
          />
          {errors.name && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Species + Gender */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Species *</label>
            <select {...register("species")} className={inputClass}>
              {" "}
              <option
                value=""
                className="dark:text-gray-800 dark:bg-steel-blue/30 text-[11px]"
              >
                Select species
              </option>
              {SPECIES.map((s) => (
                <option
                  key={s}
                  value={s}
                  className="dark:text-gray-800 dark:bg-steel-blue/30 text-[11px]"
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select {...register("gender")} className={inputClass}>
              {" "}
              <option
                value=""
                className="dark:text-gray-800 dark:bg-steel-blue/30 text-[11px]"
              >
                Select gender
              </option>
              {GENDERS.map((g) => (
                <option
                  key={g}
                  value={g}
                  className="dark:text-gray-800 dark:bg-steel-blue/30 text-[11px]"
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Breed */}
        <div>
          <label className={labelClass}>Breed</label>
          <input
            {...register("breed")}
            className={inputClass}
            placeholder="e.g. Golden Retriever"
          />
        </div>

        {/* DOB + Weight */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              {...register("dateOfBirth")}
              type="date"
              max={today}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Weight (kg)</label>
            <input
              {...register("weight", { valueAsNumber: true })}
              type="number"
              step="0.1"
              className={inputClass}
              placeholder="e.g. 28"
            />
            {errors.weight && (
              <p className="text-red-500 text-[10px] mt-1">
                {errors.weight.message}
              </p>
            )}
          </div>
        </div>

        {/* Emirate & Microchip  */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mb-3">
          {/* Emirate */}
          <div>
            <label className={labelClass}>Emirate</label>
            <select {...register("emirate")} className={inputClass}>
              <option
                value=""
                className="dark:text-gray-800 dark:bg-steel-blue/30 text-[11px]"
              >
                Select emirate
              </option>
              {EMIRATES.map((e) => (
                <option
                  key={e}
                  value={e}
                  className="dark:text-gray-800 dark:bg-steel-blue/30 text-[11px]"
                >
                  {e
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>

          {/* Microchip */}
          <div>
            <label className={labelClass}>Microchip Number</label>
            <input
              {...register("microchipNumber")}
              className={inputClass}
              placeholder="15-digit ISO number"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("isNeutered")}
              className="w-4 h-4 accent-lime-burst"
            />
            <span className="text-xs text-gray-600 dark:text-white/60">
              Neutered
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("whatsappAlerts")}
              className="w-4 h-4 accent-lime-burst"
            />
            <span className="text-xs text-gray-600 dark:text-white/60">
              WhatsApp Alerts
            </span>
          </label>
        </div>

        {/* WhatsApp Number - Conditional */}
        {whatsappAlerts && (
          <div>
            <label className={labelClass}>WhatsApp Number *</label>
            <input
              {...register("whatsappNumber")}
              className={inputClass}
              placeholder="+971XXXXXXXXX"
              required={whatsappAlerts}
            />
            {errors.whatsappNumber && (
              <p className="text-red-500 text-[10px] mt-1">
                {errors.whatsappNumber.message}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 mt-2 bg-lime-burst text-gray-900 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>

      {/* Image Upload Section */}
      <div>
        <label className={labelClass}>Profile Photo</label>
        <div className="flex flex-col items-center gap-3  ">
          {/* Image Preview */}
          {imagePreview ? (
            <div className="relative w-44 h-44 rounded-md overflow-hidden border border-steel-blue/30 dark:border-lime-burst/25 bg-steel-blue/10 dark:bg-steel-blue/5">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-all"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ) : (
            <div className="w-44 h-44 rounded-md border border-dashed border-steel-blue/30 dark:border-lime-burst/25 bg-steel-blue/5 dark:bg-steel-blue/5 flex flex-col items-center justify-center gap-1">
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-steel-blue/50 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload
                  size={20}
                  className="text-steel-blue/50 dark:text-white/40"
                />
              )}
              <span className="text-[9px] text-steel-blue/50 dark:text-white/40">
                {isUploading ? "Uploading..." : "Upload"}
              </span>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            id="profilePhoto"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => document.getElementById("profilePhoto")?.click()}
            className="text-[10px] font-medium px-3 py-1 rounded-full border border-steel-blue/30 dark:border-lime-burst/25 text-steel-blue dark:text-white/60 hover:bg-steel-blue/10 dark:hover:bg-white/5 transition-all"
          >
            {imagePreview ? "Change Photo" : "Add Photo"}
          </button>
        </div>
        <input
          type="hidden"
          {...register("profilePhoto")}
          value={imagePreview}
        />
      </div>
    </form>
  );
}
