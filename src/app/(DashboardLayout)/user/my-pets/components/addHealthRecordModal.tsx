"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useAddHealthRecordMutation } from "@/src/redux/features/pets/petsApi";

const TYPES = ["vaccine", "vet-visit", "medication", "grooming", "other"];

export default function AddHealthRecordModal({
  petId,
  onClose,
}: {
  petId: string;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === "petverse-dark";
  const [addRecord, { isLoading }] = useAddHealthRecordMutation();

  const [form, setForm] = useState({
    type: "vaccine",
    title: "",
    date: "",
    nextDueDate: "",
    vetName: "",
    cost: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date) {
      toast.error("Title and date are required");
      return;
    }
    try {
      await addRecord({
        petId,
        ...form,
        cost: form.cost ? Number(form.cost) : undefined,
      }).unwrap();
      toast.success("Health record added! 💉");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add record");
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
    maxWidth: "440px",
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
    fontWeight: 500 as const,
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
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-grotesk font-bold text-lg"
            style={{ color: isDark ? "rgba(255,255,255,0.92)" : "#1a1a2e" }}
          >
            Add Health Record
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
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

        <div className="flex flex-col gap-4">
          <div>
            <label style={labelStyle}>Type *</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              style={inputStyle}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Rabies Booster"
              style={inputStyle}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Date *</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Next Due Date</label>
              <input
                name="nextDueDate"
                type="date"
                value={form.nextDueDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Vet Name</label>
              <input
                name="vetName"
                value={form.vetName}
                onChange={handleChange}
                placeholder="e.g. Dr. Ahmed"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Cost (AED)</label>
              <input
                name="cost"
                type="number"
                value={form.cost}
                onChange={handleChange}
                placeholder="e.g. 150"
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional notes..."
              rows={2}
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-sm mt-1"
            style={{ background: "#B8FF2E", color: "#0a0e1a" }}
          >
            {isLoading ? "Saving..." : "Save Record 💉"}
          </button>
        </div>
      </div>
    </div>
  );
}
