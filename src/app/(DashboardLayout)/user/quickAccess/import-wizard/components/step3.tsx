import { Button } from "@heroui/react";
import { TYPE_META } from "./constants";
import { ParsedHealthRecord } from "@/src/types";

interface Step3Props {
  records: ParsedHealthRecord[];
  aiSummary: string;
  checked: Set<number>;
  onToggleRecord: (index: number) => void;
  onToggleAll: () => void;
  onBack: () => void;
  onSave: () => void;
}

export function Step3({
  records,
  aiSummary,
  checked,
  onToggleRecord,
  onToggleAll,
  onBack,
  onSave,
}: Step3Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* AI Summary */}
      <div className="flex items-start gap-2 p-3 rounded-md bg-primary/5 dark:shadow-sm dark:shadow-primary-500 border border-primary/20">
        <span className="text-xl">🤖</span>
        <div>
          <p className="text-xs font-semibold text-primary dark:text-lime-burst mb-0.5">
            AI Summary
          </p>
          <p className="text-xs text-default-600">{aiSummary}</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-6 text-default-400 text-sm">
          No records detected. Try a clearer image or more detailed text.
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-xs text-default-500">
              {checked.size} of {records.length} selected
            </p>
            <button
              onClick={onToggleAll}
              className="text-[11px] text-primary hover:underline"
            >
              {checked.size === records.length ? "Deselect all" : "Select all"}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {records.map((record, index) => (
              <RecordCard
                key={index}
                record={record}
                isChecked={checked.has(index)}
                onToggle={() => onToggleRecord(index)}
              />
            ))}
          </div>
        </>
      )}

      <div className="flex gap-2 justify-between mt-1  pb-44">
        <Button
          variant="flat"
          size="sm"
          radius="md"
          onPress={onBack}
          className="w-40 font-medium"
        >
          ← Back
        </Button>
        <Button
          size="sm"
          radius="md"
          isDisabled={checked.size === 0}
          onPress={onSave}
          className="w-40 bg-steel-blue/90 text-white font-medium"
        >
          Save {checked.size} Record{checked.size !== 1 ? "s" : ""} →
        </Button>
      </div>
    </div>
  );
}

//   single record
function RecordCard({ record, isChecked, onToggle }: any) {
  const meta = TYPE_META[record.type] ?? TYPE_META.other;

  return (
    <button
      onClick={onToggle}
      className={`flex items-start gap-3 p-3 rounded-md border text-left transition-all  
        ${isChecked ? "border-primary/40 bg-primary/5 dark:shadow-sm dark:shadow-primary-500" : "border-default-200 opacity-50"}`}
    >
      <div
        className={`w-4 h-4 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center
          ${isChecked ? "bg-steel-blue border-steel-blue  " : "border-default-300 "}`}
      >
        {isChecked && (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-xs font-semibold">
            {meta.emoji} {record.title}
          </span>
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${meta.color}`}
          >
            {meta.label}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          <span className="text-[11px] text-default-400">📅 {record.date}</span>
          {record.nextDueDate && (
            <span className="text-[11px] text-default-400">
              🔔 Due {record.nextDueDate}
            </span>
          )}
          {record.vetName && (
            <span className="text-[11px] text-default-400">
              👨‍⚕️ {record.vetName}
            </span>
          )}
          {record.clinicName && (
            <span className="text-[11px] text-default-400">
              🏥 {record.clinicName}{" "}
            </span>
          )}
          {record.cost && (
            <span className="text-[11px] text-default-400">
              💰 AED {record.cost}
            </span>
          )}
        </div>
        {record.notes && (
          <p className="text-[11px] text-default-400 mt-0.5 italic truncate">
            {record.notes}
          </p>
        )}
      </div>
    </button>
  );
}
