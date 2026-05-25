"use client";

import { Card, CardBody } from "@heroui/react";
import { FormField } from "./formField";
import { InsuranceFormData } from "../page";

type QuestionCardProps = {
  q: any;
  form: any;
  onChange: (field: keyof InsuranceFormData, value: string) => void;
  onToggleCondition?: (condition: string) => void;
};

export const QuestionCard = ({
  q,
  form,
  onChange,
  onToggleCondition,
}: QuestionCardProps) => {
  return (
    <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
      <CardBody className="p-4">
        <label className="block font-semibold text-gray-900 dark:text-white text-sm mb-2">
          {q.icon} {q.label}
        </label>

        <FormField
          q={q}
          value={form[q.id] as string}
          onChange={onChange}
          onToggleCondition={onToggleCondition}
          conditionsList={form.conditionsList}
          existingConditions={form.existingConditions}
        />
      </CardBody>
    </Card>
  );
};
