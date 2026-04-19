"use client";

import { useState } from "react";
import { Calendar, DollarSign, FileText, User } from "lucide-react";
import { RECORD_TYPES } from "./constants";
import { inputClass, labelClass } from "../petInfo/constants";
import { toast } from "sonner";

interface HealthRecordFormProps {
  initialData?: {
    type: string;
    title: string;
    date: string;
    nextDueDate: string;
    vetName: string;
    cost: string;
    notes: string;
  };
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
}

export default function HealthRecordForm({
  initialData,
  onSubmit,
  isLoading,
  submitLabel,
}: HealthRecordFormProps) {
  const [form, setForm] = useState({
    type: initialData?.type || "vaccine",
    title: initialData?.title || "",
    date: initialData?.date || "",
    nextDueDate: initialData?.nextDueDate || "",
    vetName: initialData?.vetName || "",
    cost: initialData?.cost || "",
    notes: initialData?.notes || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date) {
      toast.error("Title and date are required");
      return;
    }
    await onSubmit(form);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Type Selection */}
      <div>
        <label className={labelClass}>Record Type</label>
        <div className="grid grid-cols-5 gap-2">
          {RECORD_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = form.type === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setForm({ ...form, type: type.value })}
                className={`
                  flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all border
                  ${
                    isSelected
                      ? "bg-lime-burst/40 dark:bg-lime-burst/20 border-lime-burst text-steel-blue dark:text-lime-burst"
                      : "bg-steel-blue/5 dark:bg-white/5 border-steel-blue/15 dark:border-white/10 hover:bg-steel-blue/10 dark:text-white/80 text-steel-blue"
                  }
                `}
              >
                <Icon size={18} />
                <span className="text-[10px] font-medium ">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g., Rabies Booster"
          className={inputClass}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Date *</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Next Due Date</label>
          <input
            name="nextDueDate"
            type="date"
            value={form.nextDueDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Vet & Cost */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Vet Name</label>
          <input
            name="vetName"
            value={form.vetName}
            onChange={handleChange}
            placeholder="Dr. Ahmed"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Cost (AED)</label>
          <input
            name="cost"
            type="number"
            value={form.cost}
            onChange={handleChange}
            placeholder="150"
            className={inputClass}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Additional notes..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-3 rounded-xl font-semibold text-sm mt-2 bg-lime-burst hover:bg-lime-burst/90 text-gray-900 disabled:opacity-50"
      >
        {isLoading ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}
