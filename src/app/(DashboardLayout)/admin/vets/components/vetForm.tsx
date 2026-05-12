"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { EMIRATES, VET_SPECIALITIES, DAYS } from "@/src/constant";
import {
  inputClass,
  labelClass,
} from "../../../user/my-pets/components/modal/petInfo/constants";
import { TVet } from "@/src/types";
import { X, Upload, Plus } from "lucide-react";

type WorkingHour = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

type PriceRange = {
  basePrice: number;
  maxPrice: number;
};

type VetFormData = {
  clinicName: string;
  emirate: string;
  area: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  coverPhoto: string;
  photos: string[];
  about: string;
  // googleMapsUrl: string;
  specialities: string[];
  workingHours: WorkingHour[];
  priceRange: PriceRange;
  rating: number;
  reviewCount: number;
  longitude: number;
  latitude: number;
  emergency: boolean;
};

interface VetFormProps {
  initial?: Partial<TVet>;
  onSubmit: (data: Partial<VetFormData>) => Promise<void>;
  isLoading: boolean;
  isEdit?: boolean;
}

const getChangedFields = (
  dirtyFields: Record<string, any>,
  allValues: VetFormData,
) => {
  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [
      key,
      allValues[key as keyof VetFormData],
    ]),
  );
};

const buildDefaultWorkingHours = () =>
  DAYS.map((day) => ({
    day,
    open: "09:00",
    close: "18:00",
    closed: false,
  }));

const buildDefaultValues = (initial?: Partial<TVet>): VetFormData => ({
  clinicName: initial?.clinicName ?? "",
  emirate: initial?.emirate ?? "",
  area: initial?.area ?? "",
  address: initial?.address ?? "",
  phone: initial?.phone ?? "",
  whatsapp: initial?.whatsapp ?? "",
  email: initial?.email ?? "",
  website: initial?.website ?? "",
  coverPhoto: initial?.coverPhoto ?? "",
  photos: initial?.photos ?? [],
  about: initial?.about ?? "",
  // googleMapsUrl: initial?.googleMapsUrl ?? "",
  specialities: initial?.specialities ?? [],
  workingHours: initial?.workingHours ?? buildDefaultWorkingHours(),
  priceRange: initial?.priceRange ?? { basePrice: 0, maxPrice: 0 },
  rating: initial?.rating ?? 0,
  reviewCount: initial?.reviewCount ?? 0,
  longitude: initial?.longitude ?? 0,
  latitude: initial?.latitude ?? 0,
  emergency: initial?.emergency ?? false,
});

export default function VetForm({
  initial,
  onSubmit,
  isLoading,
  isEdit = false,
}: VetFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<VetFormData>({
    defaultValues: buildDefaultValues(initial),
  });
  console.log(initial);
  useEffect(() => {
    if (isEdit && initial) {
      reset(buildDefaultValues(initial));
    }
  }, [isEdit, initial, reset]);

  const handleFormSubmit = handleSubmit((allValues) => {
    console.log(allValues);
    if (isEdit) {
      const changed = getChangedFields(dirtyFields, allValues);
      console.log(changed);
      if (!changed || Object.keys(changed).length === 0) {
        console.log("Nothing changed, skipping submit.");
        return;
      }
      onSubmit(changed);
    } else {
      onSubmit(allValues);
    }
  });

  const specialities = watch("specialities");
  const workingHours = watch("workingHours");
  const photos = watch("photos");
  const coverPhoto = watch("coverPhoto");

  // Specialities toggle
  const toggleSpeciality = (speciality: string) => {
    const current = specialities ?? [];
    const updated = current.includes(speciality)
      ? current.filter((s) => s !== speciality)
      : [...current, speciality];
    setValue("specialities", updated, { shouldDirty: true });
  };

  // Cover photo upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET as string);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        { method: "POST", body: formData },
      );
      const data = await res.json();
      setValue("coverPhoto", data.secure_url, { shouldDirty: true });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setValue("coverPhoto", "", { shouldDirty: true });
  };

  // Gallery upload

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploadingGallery(true);
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET as string);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        { method: "POST", body: formData },
      );
      const data = await res.json();
      return data.secure_url as string;
    });
    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const updated = [...(getValues("photos") ?? []), ...uploadedUrls];
      setValue("photos", updated, { shouldDirty: true });
    } catch (error) {
      console.error("Gallery upload failed:", error);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    const updated = (getValues("photos") ?? []).filter((_, i) => i !== index);
    setValue("photos", updated, { shouldDirty: true });
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
      {/*   Basic Info      */}
      <div className="grid grid-cols-2 gap-3">
        {/* Clinic Name */}
        <div className="col-span-2">
          <label className={labelClass}>Clinic Name *</label>
          <input
            {...register("clinicName", { required: "Clinic name is required" })}
            className={inputClass}
            placeholder="e.g. German Vet Clinic"
          />
          {errors.clinicName && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.clinicName.message}
            </p>
          )}
        </div>

        {/* Emirate */}
        <div>
          <label className={labelClass}>Emirate *</label>
          <select
            {...register("emirate", { required: "Emirate is required" })}
            className={inputClass}
          >
            <option value="">Select Emirate</option>
            {EMIRATES.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
          {errors.emirate && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.emirate.message}
            </p>
          )}
        </div>

        {/* Area */}
        <div>
          <label className={labelClass}>Area *</label>
          <input
            {...register("area", { required: "Area is required" })}
            className={inputClass}
            placeholder="Jumeirah"
          />
          {errors.area && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.area.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="col-span-2">
          <label className={labelClass}>Address *</label>
          <input
            {...register("address", { required: "Address is required" })}
            className={inputClass}
            placeholder="Full address"
          />
          {errors.address && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email</label>
          <input
            {...register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className={inputClass}
            placeholder="info@clinic.com"
          />
          {errors.email && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Website */}
        <div>
          <div className="flex flex-row justify-between items-center">
            <label className={labelClass}>Website</label>
            {errors.website && (
              <p className="text-red-500 text-[10px] italic mb-1">
                {errors.website.message}
              </p>
            )}
          </div>

          <input
            {...register("website", {
              pattern: {
                value: /^https:\/\//,
                message: "Website must start with https://",
              },
            })}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        {/* Phone / WhatsApp / Emergency */}
        <div className="col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Phone *</label>
              <input
                {...register("phone", { required: "Phone number is required" })}
                className={inputClass}
                placeholder="+971 4 ..."
              />
              {errors.phone && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input
                {...register("whatsapp")}
                className={inputClass}
                placeholder="+971 50 ..."
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  {...register("emergency")}
                  className="w-4 h-4 accent-coral"
                />
                <span className="text-xs text-gray-700 dark:text-white/70 whitespace-nowrap">
                  24/7 Emergency
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Longitude */}
        <div>
          <label className={labelClass}>Longitude</label>
          <input
            {...register("longitude", {
              required: false,
              valueAsNumber: true,
              min: {
                value: -180,
                message: "Longitude must be between -180 and 180",
              },
              max: {
                value: 180,
                message: "Longitude must be between -180 and 180",
              },
            })}
            type="number"
            step="any"
            className={inputClass}
            placeholder="e.g., 55.2708"
          />
          {errors.longitude && (
            <p className="text-pv-coral text-[10px] mt-1">
              {errors.longitude.message}
            </p>
          )}
        </div>

        {/* Latitude */}
        <div>
          <label className={labelClass}>Latitude</label>
          <input
            {...register("latitude", {
              required: false,
              valueAsNumber: true,
              min: {
                value: -90,
                message: "Latitude must be between -90 and 90",
              },
              max: {
                value: 90,
                message: "Latitude must be between -90 and 90",
              },
            })}
            type="number"
            step="any"
            className={inputClass}
            placeholder="e.g., 25.2048"
          />
          {errors.latitude && (
            <p className="text-pv-coral text-[10px] mt-1">
              {errors.latitude.message}
            </p>
          )}
        </div>

        {/* Google Maps URL */}
        {/* <div className="col-span-2">
          <label className={labelClass}>Google Maps URL</label>
          <input
            {...register("googleMapsUrl")}
            className={inputClass}
            placeholder="https://maps.google.com/..."
          />
        </div> */}

        {/* About */}
        <div className="col-span-2">
          <label className={labelClass}>About</label>
          <textarea
            {...register("about")}
            className={`${inputClass} resize-none h-20`}
            placeholder="Clinic description..."
          />
        </div>

        {/* Rating */}
        <div>
          <label className={labelClass}>Rating (0-5)</label>
          <input
            type="number"
            step="0.1"
            {...register("rating", { valueAsNumber: true, min: 0, max: 5 })}
            className={inputClass}
          />
        </div>

        {/* Review Count */}
        <div>
          <label className={labelClass}>Review Count</label>
          <input
            type="number"
            {...register("reviewCount", { valueAsNumber: true, min: 0 })}
            className={inputClass}
          />
        </div>

        {/*   Cover Photo   ─ */}
        <div className="col-span-2">
          <label className={labelClass}>Cover Photo</label>
          <div className="mt-2">
            {coverPhoto ? (
              <div className="relative inline-block">
                <img
                  src={coverPhoto}
                  alt="Cover preview"
                  className="w-32 h-32 rounded-lg object-cover border-2 border-steel-blue/30"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-steel-blue/30 dark:border-white/20 rounded-lg cursor-pointer hover:border-steel-blue/50 dark:hover:border-lime-burst/50 transition-colors bg-steel-blue/5 dark:bg-white/5">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload
                    size={24}
                    className="text-steel-blue dark:text-white/50 mb-2"
                  />
                  <p className="text-[10px] text-steel-blue dark:text-white/50 text-center px-2">
                    Upload cover
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            )}
            {isUploading && (
              <p className="text-xs text-steel-blue mt-2">Uploading...</p>
            )}
          </div>
        </div>

        {/*   Gallery Photos   */}
        <div className="col-span-2">
          <label className={labelClass}>Gallery Photos</label>
          <div className="mt-2">
            <div className="flex flex-wrap gap-3">
              {(photos ?? []).map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Gallery ${index + 1}`}
                    className="w-24 h-24 rounded-lg object-cover border border-steel-blue/30"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-steel-blue/30 dark:border-white/20 rounded-lg cursor-pointer hover:border-steel-blue/50 dark:hover:border-lime-burst/50 transition-colors bg-steel-blue/5 dark:bg-white/5">
                <div className="flex flex-col items-center justify-center">
                  <Plus
                    size={20}
                    className="text-steel-blue dark:text-white/50"
                  />
                  <p className="text-[9px] text-steel-blue dark:text-white/50 mt-1">
                    Add photo
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="hidden"
                  disabled={isUploadingGallery}
                />
              </label>
            </div>
            {isUploadingGallery && (
              <p className="text-xs text-steel-blue mt-2">
                Uploading photos...
              </p>
            )}
            <p className="text-[9px] text-steel-blue/60 dark:text-white/40 mt-2">
              Add photos of your clinic interior, staff, or facilities
            </p>
          </div>
        </div>
      </div>

      {/*   Specialities */}
      <div>
        <label className={labelClass}>Specialities *</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {VET_SPECIALITIES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSpeciality(s)}
              className={`text-xs px-3 py-1 rounded-xl border transition-all ${
                specialities?.includes(s)
                  ? "bg-steel-blue/30 border-steel-blue text-steel-blue"
                  : "bg-steel-blue/10 dark:bg-lime-burst/30 border-white/10 text-gray-500 dark:text-white/80 hover:border-white/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {errors.specialities && (
          <p className="text-red-500 text-[10px] mt-1">
            {errors.specialities.message}
          </p>
        )}
      </div>

      {/*   Working Hours */}
      <div>
        <label className={labelClass}>Working Hours</label>
        <div className="flex flex-col gap-2 md:w-1/2 w-full mt-3 ms-3">
          {workingHours?.map((h, i) => (
            <div key={h.day} className="flex items-center gap-2 text-sm">
              <span className="text-steel-blue dark:text-lime-burst font-semibold w-20 text-xs">
                {h.day.slice(0, 3)}
              </span>
              <input
                type="time"
                {...register(`workingHours.${i}.open`)}
                disabled={watch(`workingHours.${i}.closed`)}
                className={`${inputClass} w-28 text-xs`}
              />
              <span className="dark:text-white/70 text-gray-500">–</span>
              <input
                type="time"
                {...register(`workingHours.${i}.close`)}
                disabled={watch(`workingHours.${i}.closed`)}
                className={`${inputClass} w-28 text-xs`}
              />
              <label className="flex items-center gap-1 dark:text-white/70 text-gray-500 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  {...register(`workingHours.${i}.closed`)}
                  className="accent-coral"
                />
                Closed
              </label>
            </div>
          ))}
        </div>
      </div>

      {/*   Price Range      */}
      <div>
        <label className={labelClass}>Price Range (AED)</label>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[11px] text-gray-600 dark:text-white/40">
              From
            </label>
            <input
              type="number"
              {...register("priceRange.basePrice", { valueAsNumber: true })}
              className={inputClass}
              placeholder="e.g., 50"
            />
            <p className="text-[9px] text-steel-blue/60 dark:text-white/40">
              Minimum consultation fee
            </p>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[11px] text-gray-600 dark:text-white/40">
              Up to
            </label>
            <input
              type="number"
              {...register("priceRange.maxPrice", { valueAsNumber: true })}
              className={inputClass}
              placeholder="e.g., 500"
            />
            <p className="text-[9px] text-steel-blue/60 dark:text-white/40">
              Maximum consultation fee
            </p>
          </div>
        </div>
      </div>

      {/*   Submit Buttons   ─ */}
      <div className="flex gap-3 pt-4 border-t border-white/10 mb-8">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all duration-200
            border-steel-blue/30 dark:border-white/20
            text-gray-700 dark:text-white/80
            hover:bg-steel-blue/5 dark:hover:bg-white/10
            bg-white dark:bg-transparent"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-xl bg-lime-burst text-gray-900 font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create Clinic"}
        </button>
      </div>
    </form>
  );
}
