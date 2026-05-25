"use client";

import { Input, Select, SelectItem, RadioGroup, Radio } from "@heroui/react";
import { COMMON_CONDITIONS } from "./constants";
import { InsuranceFormData } from "../page";

type FormFieldProps = {
  q: any;
  value: string;
  onChange: (field: keyof InsuranceFormData, value: string) => void;
  onToggleCondition?: (condition: string) => void;
  conditionsList?: string;
  existingConditions?: string;
};

export const FormField = ({
  q,
  value,
  onChange,
  onToggleCondition,
  conditionsList = "",
  existingConditions = "",
}: FormFieldProps) => {
  return (
    <>
      {(q.type === "text" || q.type === "number") && (
        <Input
          type={q.type}
          value={value}
          onChange={(e) => onChange(q.id, e.target.value)}
          placeholder={q.placeholder}
          size="sm"
          variant="bordered"
          classNames={{ input: "text-xs", inputWrapper: "h-9" }}
        />
      )}

      {q.type === "select" && (
        <Select
          selectedKeys={value ? [value] : []}
          onChange={(e) => onChange(q.id, e.target.value)}
          placeholder="Select..."
          size="sm"
          variant="bordered"
          classNames={{ trigger: "h-9", value: "text-xs" }}
        >
          {q.options?.map((opt: any) => (
            <SelectItem key={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </Select>
      )}

      {q.type === "radio" && q.id !== "existingConditions" && (
        <RadioGroup
          value={value}
          onValueChange={(val) => onChange(q.id, val)}
          orientation="horizontal"
          className="gap-2"
        >
          {q.options?.map((opt: any) => (
            <Radio
              key={opt.value}
              value={opt.value}
              size="sm"
              classNames={{ label: "text-xs" }}
            >
              {opt.label}
            </Radio>
          ))}
        </RadioGroup>
      )}

      {q.type === "radio" && q.id === "existingConditions" && (
        <>
          <RadioGroup
            value={value}
            onValueChange={(val) => onChange(q.id, val)}
            orientation="horizontal"
            className="gap-2"
          >
            {q.options?.map((opt: any) => (
              <Radio
                key={opt.value}
                value={opt.value}
                size="sm"
                classNames={{ label: "text-xs" }}
              >
                {opt.label}
              </Radio>
            ))}
          </RadioGroup>

          {existingConditions === "yes" && onToggleCondition && (
            <ConditionsSelector
              conditionsList={conditionsList}
              onToggleCondition={onToggleCondition}
            />
          )}
        </>
      )}
    </>
  );
};

const ConditionsSelector = ({ conditionsList, onToggleCondition }: any) => {
  const selectedConditions = conditionsList
    .split(",")
    .map((s: string) => s.trim());

  return (
    <div className="mt-4 p-3 bg-gray-50 dark:bg-white/5 rounded-md">
      <label className="block font-semibold text-gray-900 dark:text-white text-xs mb-2">
        🩺 Select your pet's conditions:
      </label>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {COMMON_CONDITIONS.map((condition) => (
          <button
            key={condition}
            type="button"
            onClick={() => onToggleCondition(condition)}
            className={`px-2.5 py-1 rounded-full text-[10px] border transition-all ${
              selectedConditions.includes(condition)
                ? "bg-[#4682B4] border-[#4682B4] text-white"
                : "border-gray-200 dark:border-white/20 text-gray-600 dark:text-gray-400 hover:border-[#4682B4]"
            }`}
          >
            {condition}
          </button>
        ))}
      </div>
      <Input
        placeholder="Or type other conditions (comma separated)"
        value={conditionsList}
        onChange={(e) => onToggleCondition(e.target.value)}
        size="sm"
        variant="bordered"
        classNames={{ input: "text-xs", inputWrapper: "h-9" }}
      />
      <p className="text-[10px] text-gray-400 mt-2">
        💡 We'll match these conditions against what each provider covers
      </p>
    </div>
  );
};
