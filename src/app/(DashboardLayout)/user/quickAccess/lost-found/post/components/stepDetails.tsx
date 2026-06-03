import { Input, Textarea, Select, SelectItem } from "@heroui/react";
import { LF_EMIRATES } from "@/src/types";

interface StepDetailsProps {
  form: {
    petName: string;
    breed: string;
    color: string;
    description: string;
    microchipNumber: string;
    emirate: string;
    area: string;
    dateLostFound: string;
    reward: string;
    type: string;
  };
  errors: Record<string, string>;
  updateField: (field: string, value: string) => void;
}

const INPUT_CLASSES = {
  input: "focus:outline-none focus:ring-0",
  inputWrapper:
    "focus:outline-none focus:ring-0 focus:border-default-300 border-1",
};

export const StepDetails = ({
  form,
  errors,
  updateField,
}: StepDetailsProps) => (
  <div className="space-y-4">
    <Input
      label="Pet name (optional)"
      size="sm"
      radius="sm"
      variant="bordered"
      value={form.petName}
      onValueChange={(value) => updateField("petName", value)}
      classNames={INPUT_CLASSES}
    />

    <Input
      label="Breed (optional)"
      size="sm"
      radius="sm"
      variant="bordered"
      value={form.breed}
      onValueChange={(value) => updateField("breed", value)}
      classNames={INPUT_CLASSES}
    />

    <Input
      label="Color & markings *"
      size="sm"
      radius="sm"
      variant="bordered"
      value={form.color}
      onValueChange={(value) => updateField("color", value)}
      isInvalid={!!errors.color}
      errorMessage={errors.color}
      classNames={INPUT_CLASSES}
    />

    <Textarea
      label="Description *"
      placeholder="Any special features, collar, behavior..."
      size="sm"
      radius="sm"
      variant="bordered"
      minRows={2}
      value={form.description}
      onValueChange={(value) => updateField("description", value)}
      isInvalid={!!errors.description}
      errorMessage={errors.description}
      classNames={INPUT_CLASSES}
    />

    <Input
      label="Microchip number (optional)"
      size="sm"
      radius="sm"
      variant="bordered"
      value={form.microchipNumber}
      onValueChange={(value) => updateField("microchipNumber", value)}
      classNames={INPUT_CLASSES}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Select
        label="Emirate *"
        size="sm"
        radius="sm"
        variant="bordered"
        selectedKeys={form.emirate ? [form.emirate] : []}
        onChange={(e) => updateField("emirate", e.target.value)}
        isInvalid={!!errors.emirate}
        errorMessage={errors.emirate}
      >
        {LF_EMIRATES.map((e) => (
          <SelectItem key={e}>{e}</SelectItem>
        ))}
      </Select>

      <Input
        label="Area *"
        placeholder="e.g. JBR"
        size="sm"
        radius="sm"
        variant="bordered"
        value={form.area}
        onValueChange={(value) => updateField("area", value)}
        isInvalid={!!errors.area}
        errorMessage={errors.area}
        classNames={INPUT_CLASSES}
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Input
        label="Date *"
        type="date"
        size="sm"
        radius="sm"
        variant="bordered"
        value={form.dateLostFound}
        onValueChange={(value) => updateField("dateLostFound", value)}
        isInvalid={!!errors.dateLostFound}
        errorMessage={errors.dateLostFound}
        classNames={INPUT_CLASSES}
      />

      {form.type === "lost" && (
        <Input
          label="Reward (AED)"
          type="number"
          placeholder="Optional"
          size="sm"
          radius="sm"
          variant="bordered"
          value={form.reward}
          onValueChange={(value) => updateField("reward", value)}
          startContent={<span className="text-default-400">AED</span>}
          classNames={INPUT_CLASSES}
        />
      )}
    </div>
  </div>
);
