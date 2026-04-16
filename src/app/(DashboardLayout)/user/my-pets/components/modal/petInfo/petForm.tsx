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
  selectClass,
} from "./constants";

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
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues,
  });

  const whatsappAlerts = watch("whatsappAlerts");

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      {/* Name */}
      <div>
        <label className={labelClass}>Pet Name *</label>
        <input
          {...register("name")}
          className={inputClass}
          placeholder="e.g. Max"
        />
        {errors.name && (
          <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>
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
      <div className="grid grid-cols-2 gap-3">
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
    </form>
  );
}
