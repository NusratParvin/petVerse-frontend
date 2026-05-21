interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-all
                ${
                  i < currentStep
                    ? "bg-steel-blue border-steel-blue text-white"
                    : i === currentStep
                      ? "bg-steel-blue/10 border-steel-blue text-steel-blue"
                      : "bg-default-100 dark:bg-default-100/10 border-default-200 text-default-400"
                }`}
            >
              {i < currentStep ? "✓" : i + 1}
            </div>
            <span
              className={`text-[10px] hidden sm:block ${
                i === currentStep
                  ? "text-steel-blue font-medium"
                  : "text-default-400"
              }`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-px flex-1 mx-1 mb-4 transition-all ${
                i < currentStep ? "bg-steel-blue" : "bg-default-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
