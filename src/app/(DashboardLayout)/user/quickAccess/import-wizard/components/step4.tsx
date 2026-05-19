import { Button } from "@heroui/react";
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
  return (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-3xl">
        🎉
      </div>

      <div>
        <p className="text-default-900 font-semibold text-sm">
          {savedCount} record{savedCount !== 1 ? "s" : ""} saved to{" "}
          {selectedPet?.name}'s profile!
        </p>
        <p className="text-default-400 text-xs mt-1">
          View them grouped by visit on the Pet Profile page.
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 w-full max-w-xs">
        <Button
          variant="flat"
          color="primary"
          size="sm"
          radius="lg"
          className="w-full"
          isLoading={isExporting}
          onPress={onExport}
        >
          {isExporting ? "Generating PDF…" : "⬇ Download Health Passport PDF"}
        </Button>
        <p className="text-[10px] text-default-400">
          A clean PDF with all of {selectedPet?.name}'s imported records
        </p>
      </div>

      <Button variant="flat" size="sm" radius="lg" onPress={onReset}>
        Import More Records
      </Button>
    </div>
  );
}
