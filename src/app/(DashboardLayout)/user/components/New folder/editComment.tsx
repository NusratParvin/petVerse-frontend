"use client";
import { useState, useRef } from "react";
import { Tooltip, Spinner } from "@heroui/react";
import { Check, X, ImagePlus, MapPin } from "lucide-react";
import { toast } from "sonner";

import { useUpdateCommentMutation } from "@/src/redux/features/comments/commentsApi";
import { ImageLightbox } from "../../quickAccess/lost-found/components/imagelightbox";
import { uploadToCloudinary } from "@/src/components/home/cloudinaryUpload ";

interface EditCommentProps {
  commentId: string;
  initialContent: string;
  currentImage?: string | null;
  currentLocation?: string;
  isSighting?: boolean;
  onCancel: () => void;
  onSuccess: (updatedComment: any) => void;
}

const EditComment = ({
  commentId,
  initialContent,
  currentImage,
  currentLocation = "",
  isSighting = false,
  onCancel,
  onSuccess,
}: EditCommentProps) => {
  const [updateComment] = useUpdateCommentMutation();
  const [content, setContent] = useState(initialContent);
  const [location, setLocation] = useState(currentLocation);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(
    currentImage || "",
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const imgInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      setUploadedImageUrl(imageUrl);
    } catch (error) {
      toast.error(`Failed to upload image: ${error}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => setUploadedImageUrl("");

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Content cannot be empty");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Updating...");

    try {
      const updateData: any = {
        commentId,
        content,
        sightingLocation: location,
      };

      // Only include image if it changed
      if (uploadedImageUrl !== currentImage) {
        updateData.sightingPhoto = uploadedImageUrl;
      } else if (uploadedImageUrl === null && currentImage) {
        updateData.sightingPhoto = "";
      }

      if (location !== currentLocation) {
        updateData.sightingLocation = location;

        if (!isSighting && location) {
          updateData.isSighting = true;
        }
      }

      console.log(updateData);
      const res = await updateComment(updateData).unwrap();
      console.log(res);
      onSuccess(res.data);
      toast.success("Updated!", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-1.5 space-y-1">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus
        rows={2}
        className="w-full resize-none text-[11px] text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800/60 rounded-md px-2 py-1 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-steel-blue dark:focus:border-lime-burst leading-relaxed"
      />

      {/* Sighting location edit */}
      {/* {isSighting && ( */}
      <div className="relative">
        <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 size-2.5 text-amber-500" />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where did you spot them?"
          className="w-full pl-6 pr-2 py-1 text-[10px] rounded-md bg-amber-50/60 dark:bg-amber-500/5 border border-amber-300/50 dark:border-amber-500/30 text-zinc-800 dark:text-zinc-200 placeholder-amber-700/40 focus:outline-none focus:border-amber-500"
        />
      </div>
      {/* )} */}

      {/* Image upload and preview section */}
      <div className="flex items-center justify-between">
        {/* Left side: Image upload icon and preview */}
        <div className="flex items-center gap-4">
          <input
            ref={imgInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          {isUploadingImage ? (
            <Spinner
              size="sm"
              variant="wave"
              color="current"
              className="text-steel-blue dark:text-lime-burst"
            />
          ) : (
            <ImagePlus
              className="size-4 text-zinc-600 hover:text-steel-blue dark:hover:text-lime-burst cursor-pointer transition-colors"
              onClick={() => imgInputRef.current?.click()}
            />
          )}

          {/* Image preview thumbnail */}
          {uploadedImageUrl && (
            <div className="relative group">
              <img
                src={uploadedImageUrl}
                alt="Preview"
                className="h-10 w-12 rounded-sm object-cover border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setLightboxIndex(0)}
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="size-2.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right side: Cancel and Save icons */}
        <div className="flex items-center gap-1">
          <Tooltip content="Cancel">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="p-1.5 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              <X className="size-3.5" />
            </button>
          </Tooltip>
          <Tooltip content="Save">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving || !content.trim()}
              className="p-1.5 rounded-full bg-lime-burst text-zinc-900 hover:brightness-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="size-3.5 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
              ) : (
                <Check className="size-3.5" strokeWidth={3} />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxIndex !== null && uploadedImageUrl && (
        <ImageLightbox
          images={[uploadedImageUrl]}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};

export default EditComment;
