import { Button, Alert } from "@heroui/react";
import { TPet } from "@/src/types";

interface Step4Props {
  savedCount: number;
  selectedPet: TPet | null;
  isExporting: boolean;
  onExport: () => void;
  onReset: () => void;
}

export function Step4({
  savedCount,
  selectedPet,
  isExporting,
  onExport,
  onReset,
}: Step4Props) {
  const hasRecords = savedCount > 0;

  return (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl
        ${
          hasRecords
            ? "bg-emerald-100 dark:bg-steel-blue/30"
            : "bg-red-100 dark:bg-red-500/20"
        }`}
      >
        {hasRecords ? "🎉" : "😔"}
      </div>

      <div>
        <p className="text-default-900 font-semibold text-sm">
          {hasRecords ? (
            <>
              {savedCount} record{savedCount !== 1 ? "s" : ""} saved to{" "}
              {selectedPet?.name}'s profile!
            </>
          ) : (
            <>No records were found or saved</>
          )}
        </p>
        <p className="text-default-400 text-xs mt-1">
          {hasRecords
            ? "View them grouped by visit on the Pet Profile page."
            : "We couldn't extract any health records from your input."}
        </p>
      </div>

      {/* Download section - only when records exist */}
      {hasRecords && (
        <div className="flex flex-col items-center gap-2 w-full max-w-xs">
          <Button
            variant="flat"
            size="sm"
            radius="md"
            className="w-full bg-steel-blue text-white font-medium"
            isLoading={isExporting}
            onPress={onExport}
          >
            {isExporting ? "Generating PDF…" : "⬇ Download Health Passport PDF"}
          </Button>
          <p className="text-[10px] text-default-400">
            A clean PDF with all of {selectedPet?.name}'s imported records
          </p>
        </div>
      )}

      {/* Show different button text based on state */}
      <Button
        variant="flat"
        size="sm"
        radius="md"
        onPress={onReset}
        className="w-44 dark:bg-default-200/80 hover:dark:shadow-sm hover:dark:shadow-primary"
      >
        {hasRecords ? "Import More Records" : "Try Again"}
      </Button>
    </div>
  );
}
