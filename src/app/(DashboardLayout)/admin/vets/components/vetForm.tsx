"use client";

import { useState } from "react";
import { EMIRATES, VET_SPECIALITIES, DAYS } from "@/src/constant";
import { inputClass } from "../../../user/my-pets/components/modal/petInfo/constants";

type WorkingHour = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

type ServiceRate = {
  service: string;
  priceFrom: number;
  priceTo: number;
};

type VetFormData = {
  name: string;
  clinicName: string;
  emirate: string;
  area: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  coverPhoto: string;
  about: string;
  googleMapsUrl: string;
  specialities: string[];
  workingHours: WorkingHour[];
  serviceRates: ServiceRate[];
  rating: number;
  reviewCount: number;
};

interface VetFormProps {
  initial: VetFormData;
  onSubmit: (data: VetFormData) => Promise<void>;
  isLoading: boolean;
}

export default function VetForm({
  initial,
  onSubmit,
  isLoading,
}: VetFormProps) {
  const [form, setForm] = useState<VetFormData>(initial);

  const toggleSpeciality = (s: string) => {
    setForm((f) => ({
      ...f,
      specialities: f.specialities.includes(s)
        ? f.specialities.filter((x) => x !== s)
        : [...f.specialities, s],
    }));
  };

  const updateHours = (
    index: number,
    field: keyof WorkingHour,
    value: string | boolean,
  ) => {
    setForm((f) => {
      const updated = [...f.workingHours];
      updated[index] = { ...updated[index], [field]: value };
      return { ...f, workingHours: updated };
    });
  };

  const updateRate = (
    index: number,
    field: keyof ServiceRate,
    value: string | number,
  ) => {
    setForm((f) => {
      const updated = [...f.serviceRates];
      updated[index] = {
        ...updated[index],
        [field]: field === "service" ? (value as string) : Number(value),
      };
      return { ...f, serviceRates: updated };
    });
  };

  const addRate = () =>
    setForm((f) => ({
      ...f,
      serviceRates: [
        ...f.serviceRates,
        { service: "", priceFrom: 0, priceTo: 0 },
      ],
    }));

  const removeRate = (index: number) =>
    setForm((f) => ({
      ...f,
      serviceRates: f.serviceRates.filter((_, i) => i !== index),
    }));

  return (
    <div className="p-8 flex flex-col gap-5">
      {/* Basic Info - Same as before */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-gray-600 dark:text-white/60 text-xs mb-1 block">
            Clinic Name *
          </label>
          <input
            value={form.clinicName}
            onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
            className={inputClass}
            placeholder="e.g. German Vet Clinic"
          />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">
            Doctor Name *
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            placeholder="Dr. Ahmed..."
          />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">Emirate *</label>
          <select
            value={form.emirate}
            onChange={(e) => setForm({ ...form, emirate: e.target.value })}
            className={inputClass}
          >
            {EMIRATES.map((e) => (
              <option key={e.value} value={e.value} className="bg-[#020812]">
                {e.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">Area *</label>
          <input
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            className={inputClass}
            placeholder="Jumeirah"
          />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">Phone *</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
            placeholder="+971 4 ..."
          />
        </div>
        <div className="col-span-2">
          <label className="text-white/60 text-xs mb-1 block">Address *</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className={inputClass}
            placeholder="Full address"
          />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">WhatsApp</label>
          <input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className={inputClass}
            placeholder="+971 50 ..."
          />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            placeholder="info@clinic.com"
          />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">Website</label>
          <input
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">
            Cover Photo URL
          </label>
          <input
            value={form.coverPhoto}
            onChange={(e) => setForm({ ...form, coverPhoto: e.target.value })}
            className={inputClass}
            placeholder="Cloudinary URL"
          />
        </div>
        <div className="col-span-2">
          <label className="text-white/60 text-xs mb-1 block">
            Google Maps URL
          </label>
          <input
            value={form.googleMapsUrl}
            onChange={(e) =>
              setForm({ ...form, googleMapsUrl: e.target.value })
            }
            className={inputClass}
            placeholder="https://maps.google.com/..."
          />
        </div>
        <div className="col-span-2">
          <label className="text-white/60 text-xs mb-1 block">About</label>
          <textarea
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            className={`${inputClass} resize-none h-20`}
            placeholder="Clinic description..."
          />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">
            Rating (0-5)
          </label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: parseFloat(e.target.value) })
            }
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-white/60 text-xs mb-1 block">
            Review Count
          </label>
          <input
            type="number"
            min={0}
            value={form.reviewCount}
            onChange={(e) =>
              setForm({ ...form, reviewCount: parseInt(e.target.value) })
            }
            className={inputClass}
          />
        </div>
      </div>
      {/* Specialities */}
      <div>
        <label className="text-white/60 text-xs mb-2 block">
          Specialities *
        </label>
        <div className="flex flex-wrap gap-2">
          {VET_SPECIALITIES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSpeciality(s)}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${form.specialities.includes(s) ? "bg-[#4682B4]/30 border-[#4682B4] text-[#4682B4]" : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      {/* Working Hours */}
      <div>
        <label className="text-white/60 text-xs mb-2 block">
          Working Hours
        </label>
        <div className="flex flex-col gap-2">
          {form.workingHours.map((h, i) => (
            <div key={h.day} className="flex items-center gap-2 text-sm">
              <span className="text-white/60 w-20 text-xs">
                {h.day.slice(0, 3)}
              </span>
              <input
                type="time"
                value={h.open}
                disabled={h.closed}
                onChange={(e) => updateHours(i, "open", e.target.value)}
                className={`${inputClass} w-28 text-xs ${h.closed ? "opacity-30" : ""}`}
              />
              <span className="text-white/30">–</span>
              <input
                type="time"
                value={h.close}
                disabled={h.closed}
                onChange={(e) => updateHours(i, "close", e.target.value)}
                className={`${inputClass} w-28 text-xs ${h.closed ? "opacity-30" : ""}`}
              />
              <label className="flex items-center gap-1 text-white/50 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={h.closed}
                  onChange={(e) => updateHours(i, "closed", e.target.checked)}
                  className="accent-[#FF4D6D]"
                />
                Closed
              </label>
            </div>
          ))}
        </div>
      </div>
      {/* Service Rates */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-white/60 text-xs">Service Rates</label>
          <button
            type="button"
            onClick={addRate}
            className="text-[#4682B4] text-xs hover:underline"
          >
            + Add
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {form.serviceRates.map((r, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={r.service}
                onChange={(e) => updateRate(i, "service", e.target.value)}
                className={`${inputClass} flex-1`}
                placeholder="Service name"
              />
              <input
                type="number"
                value={r.priceFrom}
                onChange={(e) => updateRate(i, "priceFrom", e.target.value)}
                className={`${inputClass} w-20`}
                placeholder="From"
              />
              <input
                type="number"
                value={r.priceTo}
                onChange={(e) => updateRate(i, "priceTo", e.target.value)}
                className={`${inputClass} w-20`}
                placeholder="To"
              />
              <button
                type="button"
                onClick={() => removeRate(i)}
                className="text-[#FF4D6D] hover:opacity-80 text-sm px-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* </div> */}

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/60 font-bold text-sm hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSubmit(form)}
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-xl bg-lime-burst text-gray-900 font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Clinic"}
        </button>
      </div>
    </div>
  );
}
