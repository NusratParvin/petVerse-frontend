"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useCreateMyPetMutation } from "@/src/redux/features/pets/petsApi";

const SPECIES = ["dog", "cat", "bird", "fish", "rabbit", "reptile", "other"];
const GENDERS = ["male", "female", "unknown"];
const EMIRATES = [
  "dubai",
  "abu-dhabi",
  "sharjah",
  "ajman",
  "ras-al-khaimah",
  "fujairah",
  "umm-al-quwain",
];

export default function AddPetModal({ onClose }: { onClose: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === "petverse-dark";
  const [createPet, { isLoading }] = useCreateMyPetMutation();

  const [form, setForm] = useState({
    name: "",
    species: "dog",
    breed: "",
    gender: "unknown",
    dateOfBirth: "",
    weight: "",
    microchipNumber: "",
    emirate: "",
    isNeutered: false,
    whatsappAlerts: false,
    whatsappNumber: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.species) {
      toast.error("Name and species are required");
      return;
    }
    try {
      await createPet({
        ...form,
        weight: form.weight ? Number(form.weight) : undefined,
      }).unwrap();
      toast.success(`${form.name} added successfully! 🐾`);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add pet");
    }
  };

  const overlay = {
    position: "fixed" as const,
    inset: 0,
    zIndex: 100,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  };
  const modal = {
    background: isDark ? "#0d1020" : "#ffffff",
    border: isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(70,130,180,0.15)",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "480px",
    maxHeight: "90vh",
    overflowY: "auto" as const,
    padding: "24px",
  };
  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "10px",
    fontSize: "13px",
    outline: "none",
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(70,130,180,0.04)",
    border: isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(70,130,180,0.12)",
    color: isDark ? "rgba(255,255,255,0.85)" : "#1a1a2e",
  };
  const labelStyle = {
    fontSize: "11px",
    fontWeight: 500,
    color: isDark ? "rgba(255,255,255,0.4)" : "rgba(30,30,60,0.5)",
    marginBottom: "4px",
    display: "block",
  };

  return (
    <div
      style={overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={modal}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-grotesk font-bold text-lg"
            style={{ color: isDark ? "rgba(255,255,255,0.92)" : "#1a1a2e" }}
          >
            Add a Pet 🐾
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(70,130,180,0.08)",
              color: isDark ? "rgba(255,255,255,0.5)" : "#4682B4",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label style={labelStyle}>Pet Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Max"
              style={inputStyle}
            />
          </div>

          {/* Species + Gender row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Species *</label>
              <select
                name="species"
                value={form.species}
                onChange={handleChange}
                style={inputStyle}
              >
                {SPECIES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                style={inputStyle}
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Breed */}
          <div>
            <label style={labelStyle}>Breed</label>
            <input
              name="breed"
              value={form.breed}
              onChange={handleChange}
              placeholder="e.g. Golden Retriever"
              style={inputStyle}
            />
          </div>

          {/* DOB + Weight row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Date of Birth</label>
              <input
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Weight (kg)</label>
              <input
                name="weight"
                type="number"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g. 28"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Emirate */}
          <div>
            <label style={labelStyle}>Emirate</label>
            <select
              name="emirate"
              value={form.emirate}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select emirate</option>
              {EMIRATES.map((e) => (
                <option key={e} value={e}>
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
            <label style={labelStyle}>Microchip Number</label>
            <input
              name="microchipNumber"
              value={form.microchipNumber}
              onChange={handleChange}
              placeholder="15-digit ISO number"
              style={inputStyle}
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isNeutered"
                checked={form.isNeutered}
                onChange={handleChange}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: isDark ? "rgba(255,255,255,0.6)" : "#1a1a2e",
                }}
              >
                Neutered
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="whatsappAlerts"
                checked={form.whatsappAlerts}
                onChange={handleChange}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: isDark ? "rgba(255,255,255,0.6)" : "#1a1a2e",
                }}
              >
                WhatsApp Alerts
              </span>
            </label>
          </div>

          {/* WhatsApp number — only if alerts enabled */}
          {form.whatsappAlerts && (
            <div>
              <label style={labelStyle}>WhatsApp Number</label>
              <input
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
                placeholder="+971XXXXXXXXX"
                style={inputStyle}
              />
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 mt-2"
            style={{ background: "#B8FF2E", color: "#0a0e1a" }}
          >
            {isLoading ? "Adding..." : "Add Pet 🐾"}
          </button>
        </div>
      </div>
    </div>
  );
}
