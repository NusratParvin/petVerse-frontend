import { Button, Tab, Tabs } from "@heroui/react";
import { RefObject } from "react";
import { speciesEmoji, TPet } from "@/src/types";

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

  return (
    <div className="flex flex-col gap-3">
      {/* Pet info*/}
      <div
        className="flex items-center gap-2 p-2.5 rounded-md 
        bg-default-100 dark:bg-default-50/30 
        border border-default-200 dark:border-default-100/20 dark:shadow-sm dark:shadow-primary-500"
      >
        <span className="text-lg">
          {speciesEmoji[selectedPet?.species || ""]}
        </span>
        <div>
          <p className="text-xs font-semibold text-default-900 dark:text-white/90">
            {selectedPet?.name}
          </p>
          <p className="text-[10px] text-default-400 dark:text-white/60 capitalize">
            {selectedPet?.species} · {selectedPet?.breed}
          </p>
        </div>
      </div>

      {/* Tabs -image/text */}
      <Tabs
        selectedKey={inputMode}
        onSelectionChange={(key) => onInputModeChange(key as "upload" | "text")}
        radius="md"
        size="sm"
      >
        <Tab
          key="upload"
          title={
            <div className="flex items-center gap-1.5 px-12">
              <span className="text-sm">📎</span>
              <span className="text-xs font-medium">Upload Invoice</span>
            </div>
          }
        />
        <Tab
          key="text"
          title={
            <div className="flex items-center gap-1.5 px-12">
              <span className="text-sm">✏️</span>
              <span className="text-xs font-medium">Paste Text</span>
            </div>
          }
        />
      </Tabs>

      {/* Tab content */}
      <div>
        {inputMode === "upload" ? (
          <div className="flex flex-col gap-2">
            {/* Upload area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed rounded-md p-6 
                flex flex-col items-center justify-center gap-2 cursor-pointer 
                transition-all duration-200
                border-default-300 dark:border-default-200/30
                bg-default-50/30 dark:bg-default-50/10
                hover:border-primary-400 dark:hover:border-primary-500
                hover:bg-primary-50/10 dark:hover:bg-primary-500/5 dark:shadow-sm dark:shadow-primary-400"
            >
              <span className="text-3xl">📄</span>
              <div className="text-center">
                <p className="text-xs font-medium text-default-700 dark:text-white/90">
                  Drop invoices here or click to browse
                </p>
                <p className="text-[10px] text-default-400 dark:text-white/60 mt-0.5">
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

            {/* File list */}
            {files.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 rounded-md 
                      transition-all duration-200
                      bg-default-100 dark:bg-default-50/30 dark:shadow-sm dark:shadow-primary-200"
                  >
                    <span className="text-sm">
                      {f.type === "application/pdf" ? "📕" : "🖼️"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-default-700 dark:text-white/90 truncate">
                        {f.name}
                      </p>
                      <p className="text-[10px] text-default-400 dark:text-white/80">
                        {formatFileSize(f.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveFile(i)}
                      className="text-default-400 hover:text-danger-500 transition-colors duration-200 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <textarea
              value={rawText}
              onChange={(e) => onRawTextChange(e.target.value)}
              placeholder="Paste vet notes, WhatsApp messages, or discharge instructions..."
              rows={9}
              className="w-full rounded-md border p-3 text-xs resize-none 
    bg-default-50/30 dark:bg-default-50/10
    border-default-300 dark:border-default-200/30
    placeholder:text-default-400 dark:placeholder:text-white/80
    text-default-700 dark:text-white/90
    focus:outline-none focus:ring-0 focus:border-default-300 dark:focus:border-default-200/30
    shadow-sm hover:shadow-md hover:dark:shadow-primary-500 transition-shadow duration-200"
            />
          </div>
        )}
      </div>

      {/* Actions   */}
      <div
        className="flex gap-2 justify-between mt-1 pt-1 
        border-t border-default-200 dark:border-default-100/20"
      >
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
          isDisabled={!canProceed || isParsing}
          isLoading={isParsing}
          onPress={onParse}
          className="w-40 bg-steel-blue/90 text-white  font-medium "
        >
          {isParsing ? "Processing..." : "Extract Records →"}
        </Button>
      </div>
    </div>
  );
}
