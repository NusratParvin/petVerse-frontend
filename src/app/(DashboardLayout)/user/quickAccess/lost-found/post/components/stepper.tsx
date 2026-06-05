import { Button, Progress } from "@heroui/react";
import { Check, PawPrint, ClipboardList, Camera } from "lucide-react";

const STEPS = [
  {
    id: "basic",
    title: "Basic info",
    emoji: <PawPrint size={16} />,
    description: "Lost/found & pet type",
  },
  {
    id: "details",
    title: "Details",
    emoji: <ClipboardList size={16} />,
    description: "Pet details & contact",
  },
  {
    id: "photos",
    title: "Photos",
    emoji: <Camera size={16} />,
    description: "Photos & review",
  },
];

const StepIcon = ({
  index,
  currentStep,
  goToStep,
}: {
  index: number;
  currentStep: number;
  goToStep: (i: number) => void;
}) => {
  const isActive = index === currentStep;
  const isCompleted = index < currentStep;

  return (
    <Button
      isIconOnly
      size="sm"
      radius="full"
      isDisabled={index > currentStep}
      onPress={() => goToStep(index)}
      className={`w-10 h-10 transition-all duration-300 text-white
        ${
          isCompleted
            ? "bg-[#21bd5b]"
            : isActive
              ? "bg-[#4682B4] dark:bg-lime-burst scale-105"
              : "bg-[#e5e7eb] dark:bg-[#4a4a4a]"
        }
      `}
      style={{
        boxShadow: isActive ? "0 0 0 4px rgba(70,130,180,0.3)" : "none",
        border: "none",
      }}
    >
      {isCompleted ? (
        <Check size={16} strokeWidth={3} />
      ) : (
        <span className="dark:text-black/70">{STEPS[index].emoji}</span>
      )}
    </Button>
  );
};

export const MobileStepper = ({
  currentStep,
  goToStep,
}: {
  currentStep: number;
  goToStep: (i: number) => void;
}) => (
  <div className="mb-6">
    <div className="flex items-center justify-between">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center flex-1">
          <StepIcon
            index={index}
            currentStep={currentStep}
            goToStep={goToStep}
          />
          <span
            className={`text-[9px] font-medium mt-1 text-center
            ${
              index === currentStep
                ? "text-[#4682B4] dark:text-lime-burst"
                : index < currentStep
                  ? "text-[#21bd5b] dark:text-[#2dd17b]"
                  : "text-[#9ca3af] dark:text-[#6b7280]"
            }
          `}
          >
            {step.title}
          </span>
        </div>
      ))}
    </div>
    <Progress
      value={((currentStep + 1) / STEPS.length) * 100}
      className="mt-4"
      size="sm"
      classNames={{
        indicator: "bg-[#4682B4] dark:bg-lime-burst",
        track: "bg-[#e5e7eb] dark:bg-[#4a4a4a]",
      }}
    />
  </div>
);

export const DesktopStepper = ({
  currentStep,
  goToStep,
}: {
  currentStep: number;
  goToStep: (i: number) => void;
}) => (
  <div className="sticky top-4">
    <p className="text-base font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst mb-4">
      Create post
    </p>
    {STEPS.map((step, index) => {
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;
      return (
        <div key={step.id} className="flex gap-4 mb-1 ms-3">
          <div className="flex flex-col items-center">
            <StepIcon
              index={index}
              currentStep={currentStep}
              goToStep={goToStep}
            />
            {index < STEPS.length - 1 && (
              <div
                style={{
                  backgroundColor: index < currentStep ? "#21bd5b" : "#e5e7eb",
                  width: "2px",
                  height: "80px",
                  marginTop: "8px",
                  borderRadius: "9999px",
                }}
              />
            )}
          </div>
          <div className="flex-1">
            <p
              className={`font-bold text-[12px] ${
                isActive
                  ? "text-[#4682B4] dark:text-lime-burst"
                  : isCompleted
                    ? "text-[#21bd5b] dark:text-[#2dd17b]"
                    : "text-[#9ca3af] dark:text-[#6b7280]"
              }
            `}
            >
              {step.title}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-300 font-medium">
              {step.description}
            </p>
            {isCompleted && (
              <p
                className="text-[9px] font-medium mt-1.5"
                style={{ color: "#21bd5b" }}
              >
                <span className="animate-pulse">✓</span> Completed
              </p>
            )}
            {isActive && (
              <div className="flex items-center gap-1 mt-1.5">
                <div className="w-1 h-1 rounded-full bg-steel-blue dark:bg-lime-burst animate-pulse" />
                <p className="text-[9px] text-steel-blue dark:text-lime-burst font-medium">
                  Current step
                </p>
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);
