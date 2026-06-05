"use client";

import { useRef, useState } from "react";
import { Button, Spinner } from "@heroui/react";
import { X, ImagePlus, Upload } from "lucide-react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

//   upload one file to Cloudinary
async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET as string);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
    { method: "POST", body: formData },
  );

  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.secure_url as string;
}

interface CloudinaryUploadProps {
  // Current image URL(s) — pass a string for single, string[] for multiple
  value: string | string[];
  // Called with the new URL(s) after upload
  onChange: (value: string | string[]) => void;
  // "single" = one image (e.g. cover photo), "multiple" = gallery
  mode?: "single" | "multiple";
  // Max images allowed in multiple mode (default: 5)
  maxImages?: number;
  // Label shown above the upload area
  label?: string;
  // Helper text shown inside the dropzone
  hint?: string;
  // Show error message below
  error?: string;
}

export const CloudinaryUpload = ({
  value,
  onChange,
  mode = "single",
  maxImages = 5,
  label,
  hint,
  error,
}: CloudinaryUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Normalise value so we always work with arrays internally
  const images: string[] = Array.isArray(value) ? value : value ? [value] : [];

  const isFull = mode === "multiple" && images.length >= maxImages;
  const canUpload = !isUploading && !isFull;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      if (mode === "single") {
        // Only upload the first file; replace existing
        const url = await uploadToCloudinary(files[0]);
        onChange(url); // returns a string
      } else {
        // Upload all selected files in parallel
        const fileArray = Array.from(files).slice(0, maxImages - images.length);
        const urls = await Promise.all(fileArray.map(uploadToCloudinary));
        onChange([...images, ...urls]); // returns a string[]
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    if (mode === "single") {
      onChange(""); // returns empty string
    } else {
      onChange(images.filter((_, i) => i !== index)); // returns string[]
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (canUpload) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <p className="text-sm font-bold text-gray-800 dark:text-white/90">
          {label}
        </p>
      )}

      {/* Upload zone — shown when we can still add images */}
      {canUpload && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="
            flex flex-col items-center justify-center gap-2
            border-2 border-dashed border-steel-blue/30 dark:border-lime-burst/30
            rounded-lg p-6 cursor-pointer
            hover:border-steel-blue/60 dark:hover:border-lime-burst/60
            hover:bg-steel-blue/5 dark:hover:bg-lime-burst/5
            transition-all duration-200
          "
        >
          {isUploading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-steel-blue/10 dark:bg-lime-burst/10 flex items-center justify-center">
                <ImagePlus
                  size={20}
                  className="text-steel-blue dark:text-lime-burst"
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-steel-blue dark:text-lime-burst">
                  Click to upload
                  {mode === "multiple" && ` (${images.length}/${maxImages})`}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {hint ?? "JPG, PNG, WEBP up to 10MB"}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={mode === "multiple"}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Image preview grid */}
      {images.length > 0 && (
        <div
          className={`grid gap-2 ${
            mode === "single" ? "grid-cols-1" : "grid-cols-3 sm:grid-cols-4"
          }`}
        >
          {images.map((url, index) => (
            <div
              key={url}
              className="relative group rounded-lg overflow-hidden border border-default-200 dark:border-white/10"
            >
              {/* Image */}
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className={`w-full object-cover ${
                  mode === "single" ? "h-40" : "h-24"
                }`}
              />

              {/* Remove button — appears on hover */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="
                  absolute top-1 right-1
                  w-6 h-6 rounded-full
                  bg-black/60 hover:bg-rose-500
                  flex items-center justify-center
                  opacity-0 group-hover:opacity-100
                  transition-all duration-200
                "
              >
                <X size={12} className="text-white" />
              </button>

              {/* "Main photo" badge for first image in gallery */}
              {mode === "multiple" && index === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-black/50 text-white px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
            </div>
          ))}

          {/* "Add more" tile shown inside grid when not full */}
          {mode === "multiple" && !isFull && images.length > 0 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="
                h-24 rounded-lg border-2 border-dashed
                border-steel-blue/30 dark:border-lime-burst/30
                hover:border-steel-blue/60 dark:hover:border-lime-burst/60
                flex flex-col items-center justify-center gap-1
                text-steel-blue dark:text-lime-burst
                transition-all duration-200
              "
            >
              <Upload size={16} />
              <span className="text-[10px] font-semibold">Add more</span>
            </button>
          )}
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-rose-500 text-xs">{error}</p>}
    </div>
  );
};
