import { Input, Card, CardBody } from "@heroui/react";

interface StepContactProps {
  form: {
    posterPhone: string;
    type: string;
    species: string;
    petName: string;
    area: string;
    emirate: string;
    dateLostFound: string;
  };
  errors: Record<string, string>;
  updateField: (field: string, value: string) => void;
}

const INPUT_CLASSES = {
  input: "focus:outline-none focus:ring-0",
  inputWrapper:
    "focus:outline-none focus:ring-0 focus:border-default-300 border-1",
};

export const StepContact = ({
  form,
  errors,
  updateField,
}: StepContactProps) => (
  <div className="space-y-4 text-center">
    <div className="text-5xl">📞</div>
    <h2 className="text-xl font-bold">Almost there!</h2>
    <p className="text-sm text-default-500">
      Leave your phone number so people can contact you
    </p>

    <Input
      label="Phone number *"
      type="tel"
      placeholder="+971 50 XXX XXXX"
      size="sm"
      radius="sm"
      variant="bordered"
      value={form.posterPhone}
      onValueChange={(value) => updateField("posterPhone", value)}
      isInvalid={!!errors.posterPhone}
      errorMessage={errors.posterPhone}
      classNames={INPUT_CLASSES}
    />

    <Card className="mt-6 bg-white dark:bg-black/20 border border-default-200 dark:border-white/10">
      <CardBody className="p-4 text-left">
        <p className="font-bold text-sm text-gray-900 dark:text-white mb-2">
          Quick review:
        </p>
        <div className="space-y-1 text-xs text-default-600 dark:text-default-400">
          <p>
            <span className="text-default-400">Type:</span> {form.type || "—"}
          </p>
          <p>
            <span className="text-default-400">Pet:</span> {form.species || "—"}
            {form.petName ? ` (${form.petName})` : ""}
          </p>
          <p>
            <span className="text-default-400">Location:</span>{" "}
            {form.area || "—"}, {form.emirate || "—"}
          </p>
          <p>
            <span className="text-default-400">Date:</span>{" "}
            {form.dateLostFound || "—"}
          </p>
        </div>
      </CardBody>
    </Card>
  </div>
);
