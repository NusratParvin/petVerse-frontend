// components/StepUpload.tsx
import { Button } from "@heroui/react";
import { RefObject } from "react";
import { TPet } from "@/src/types";

interface Step2Props {
  selectedPet: TPet | null;
  inputMode: "upload" | "text";
  onInputModeChange: (mode: "upload" | "text") => void;
  files: File[];
  onAddFiles: (files: FileList | null) => void;
  onRemoveFile: (index: number) => void;
  rawText: string;
  onRawTextChange: (text: string) => void;
  isParsing: boolean;
  onBack: () => void;
  onParse: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

const MAX_FILES = 5;
const formatFileSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)}KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

export function Step2({
  selectedPet,
  inputMode,
  onInputModeChange,
  files,
  onAddFiles,
  onRemoveFile,
  rawText,
  onRawTextChange,
  isParsing,
  onBack,
  onParse,
  fileInputRef,
}: Step2Props) {
  const canProceed =
    inputMode === "upload" ? files.length > 0 : rawText.trim().length >= 10;
  const getPetEmoji = (species: string) => {
    switch (species) {
      case "dog":
        return "🐶";
      case "cat":
        return "🐱";
      case "bird":
        return "🐦";
      default:
        return "🐾";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Pet pill */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-default-100 border border-default-200">
        <span className="text-lg">
          {getPetEmoji(selectedPet?.species || "")}
        </span>
        <div>
          <p className="text-xs font-semibold text-default-900">
            {selectedPet?.name}
          </p>
          <p className="text-[10px] text-default-400 capitalize">
            {selectedPet?.species} · {selectedPet?.breed}
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 rounded-lg bg-default-100 w-fit">
        {(["upload", "text"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onInputModeChange(mode)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all
              ${
                inputMode === mode
                  ? "bg-white dark:bg-default-100/10 text-default-900 shadow-sm"
                  : "text-default-500 hover:text-default-700"
              }`}
          >
            {mode === "upload" ? "📎 Upload Invoice" : "✏️ Paste Text"}
          </button>
        ))}
      </div>

      {/* Upload mode */}
      {inputMode === "upload" && (
        <div className="flex flex-col gap-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-default-50"
          >
            <span className="text-3xl">📄</span>
            <div className="text-center">
              <p className="text-xs font-medium">
                Drop invoices here or click to browse
              </p>
              <p className="text-[10px] text-default-400 mt-0.5">
                JPG, PNG, WEBP, PDF · up to {MAX_FILES} files · 10MB each
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => onAddFiles(e.target.files)}
            />
          </div>

          {files.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-default-100"
                >
                  <span className="text-sm">
                    {f.type === "application/pdf" ? "📕" : "🖼️"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{f.name}</p>
                    <p className="text-[10px] text-default-400">
                      {formatFileSize(f.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveFile(i)}
                    className="text-default-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Text mode */}
      {inputMode === "text" && (
        <textarea
          value={rawText}
          onChange={(e) => onRawTextChange(e.target.value)}
          placeholder="Paste vet notes, WhatsApp messages, or discharge instructions..."
          rows={9}
          className="w-full rounded-xl border p-3 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-between mt-1">
        <Button variant="flat" size="sm" radius="lg" onPress={onBack}>
          ← Back
        </Button>
        <Button
          color="primary"
          size="sm"
          radius="lg"
          isDisabled={!canProceed || isParsing}
          isLoading={isParsing}
          onPress={onParse}
        >
          {isParsing ? "Processing..." : "Extract Records →"}
        </Button>
      </div>
    </div>
  );
}
