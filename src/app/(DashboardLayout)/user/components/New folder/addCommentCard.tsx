"use client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Avatar, Textarea, Chip, Switch, Spinner } from "@heroui/react";
import { Eye, MapPin, ImagePlus, PawPrint, Send, X } from "lucide-react";
import { toast } from "sonner";

import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAddCommentMutation } from "@/src/redux/features/comments/commentsApi";
import { TTargetType } from "@/src/redux/features/comments/commentsApi";
import { uploadToCloudinary } from "@/src/components/home/cloudinaryUpload ";

type FormData = {
  content: string;
  sightingLocation?: string;
};

interface AddCommentCardProps {
  targetType: TTargetType;
  targetId: string;
  parentCommentId?: string;
  autoExpand?: boolean;
  onSuccess?: (newComment?: any) => void;
  onCancel?: () => void;
}

const AddCommentCard = ({
  targetType,
  targetId,
  parentCommentId,
  autoExpand = false,
  onSuccess,
  onCancel,
}: AddCommentCardProps) => {
  const user = useAppSelector(useCurrentUser);
  const { register, handleSubmit, reset, watch } = useForm<FormData>();
  const [addComment, { isLoading }] = useAddCommentMutation();

  const [isSighting, setIsSighting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const contentValue = watch("content");
  const isLostFound = targetType === "LostFound";
  const isReply = !!parentCommentId;

  const imgInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      setUploadedImageUrl(imageUrl);
    } catch (error) {
      toast.error(`Failed to image upload-${error}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => setUploadedImageUrl(null);

  const handleCancel = () => {
    reset();
    setIsSighting(false);
    setUploadedImageUrl(null);
    setIsExpanded(autoExpand ? true : false);
    onCancel?.();
  };

  const onSubmit = async (data: FormData) => {
    const commentData: any = {
      targetType,
      targetId,
      content: data.content,
      commenter: {
        name: user?.name,
        profilePhoto: user?.profilePhoto || "",
      },
      ...(parentCommentId && { parentCommentId }),
      ...(uploadedImageUrl && { sightingPhoto: uploadedImageUrl }),
      ...(isLostFound && {
        isSighting,
        sightingLocation: data.sightingLocation || "",
      }),
    };

    const toastId = toast.loading(
      isReply
        ? "Posting reply..."
        : isSighting
          ? "Reporting sighting..."
          : "Posting comment...",
    );

    try {
      const res = await addComment(commentData).unwrap();
      reset();
      setIsSighting(false);
      setUploadedImageUrl(null);
      if (!autoExpand) setIsExpanded(false);
      toast.success(
        isReply
          ? "Reply posted!"
          : isSighting
            ? "Sighting reported! 🐾"
            : "Comment posted!",
        { id: toastId },
      );
      onSuccess?.(res.data);
    } catch {
      toast.error("Failed to post. Try again.", { id: toastId });
    }
  };

  return (
    <div
      className={`group relative rounded-md p-[1.5px] transition-all duration-300 ${
        isSighting
          ? "bg-gradient-to-br from-amber-400/50 via-amber-300/50 to-orange-400/50"
          : isExpanded
            ? "bg-gradient-to-br from-steel-blue/60 via-lime-burst/40 to-steel-blue/60 dark:from-lime-burst/60 dark:via-steel-blue/40 dark:to-lime-burst/60"
            : "bg-zinc-200 dark:bg-zinc-800"
      }`}
    >
      {!isReply && (
        <PawPrint
          className="absolute -top-3 -right-3 size-8 text-steel-blue/10 dark:text-lime-burst/10 rotate-12 pointer-events-none"
          strokeWidth={1.5}
        />
      )}

      <div className="relative rounded-md bg-white dark:bg-zinc-900 p-1.5">
        <div className="flex items-start gap-2.5">
          <div className="relative shrink-0">
            <Avatar
              size="sm"
              name={user?.name?.charAt(0).toUpperCase() || "U"}
              src={user?.profilePhoto || undefined}
              classNames={{
                base: "bg-steel-blue/20 dark:bg-steel-blue/30 ring-2 ring-zinc-300 dark:ring-zinc-800",
                name: "text-steel-blue dark:text-lime-burst font-bold",
              }}
            />
            {!isReply && (
              <div className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-lime-burst grid place-items-center ring-2 ring-white dark:ring-zinc-900">
                <PawPrint className="size-2 text-zinc-900" strokeWidth={3} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            {!isExpanded ? (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="w-full text-left px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800/60 border border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-xs hover:border-steel-blue dark:hover:border-lime-burst hover:text-steel-blue dark:hover:text-lime-burst transition-all"
              >
                {isLostFound
                  ? "🐾 Spotted them? Drop a sighting or a kind word..."
                  : "💬 Share your thoughts..."}
              </button>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <Textarea
                  {...register("content", { required: true })}
                  placeholder={
                    isReply
                      ? "Write a reply..."
                      : isSighting
                        ? "Describe where & when you saw this pet..."
                        : "What's on your mind?"
                  }
                  minRows={2}
                  maxRows={5}
                  classNames={{
                    input: "text-[11px] text-zinc-800 dark:text-zinc-200",
                    inputWrapper:
                      "bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 hover:border-steel-blue dark:hover:border-lime-burst transition-colors !rounded-md !p-1",
                  }}
                />

                {isLostFound && isSighting && !isReply && (
                  <div className="relative animate-in slide-in-from-top-1 fade-in duration-200">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 size-2.5 text-amber-500" />
                    <input
                      {...register("sightingLocation")}
                      placeholder="Where did you spot them? (area, landmark...)"
                      className="w-full pl-6 pr-3 py-1 text-[10px] rounded-md bg-amber-50/60 dark:bg-amber-500/5 border border-amber-300/50 dark:border-amber-500/30 text-zinc-800 dark:text-zinc-200 placeholder-amber-700/40 dark:placeholder-amber-300/40 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                {uploadedImageUrl && (
                  <div className="relative inline-block">
                    <img
                      src={uploadedImageUrl}
                      className="h-10 w-12 rounded-sm border border-zinc-200 dark:border-zinc-700"
                    />
                    <X
                      onClick={removeImage}
                      className="size-3.5 absolute -top-1 -right-1.5 p-[1px] rounded-full bg-zinc-600 text-white grid place-items-center cursor-pointer"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
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
                        className="size-4 text-zinc-600 hover:text-steel-blue dark:hover:text-lime-burst cursor-pointer"
                        onClick={() => imgInputRef.current?.click()}
                      />
                    )}

                    {isLostFound && !isReply && (
                      <div className="flex items-center gap-1.5 pl-1 border-l border-zinc-200 dark:border-zinc-700 ml-0.5">
                        <Switch
                          size="sm"
                          isSelected={isSighting}
                          onValueChange={setIsSighting}
                          classNames={{
                            wrapper: isSighting
                              ? "bg-amber-500 w-8 h-4"
                              : "bg-zinc-300 dark:bg-zinc-700 w-7 h-3.5",
                            thumb: "w-3 h-2.5",
                          }}
                        />
                        {isSighting ? (
                          <Chip
                            size="sm"
                            startContent={
                              <Eye className="size-3 pe-0.5 text-amber-700" />
                            }
                            classNames={{
                              base: "bg-amber-500/15 px-2 border border-amber-400/40",
                              content:
                                "text-amber-700 dark:text-amber-400 text-[8px] font-bold uppercase tracking-wide",
                            }}
                          >
                            Sighting
                          </Chip>
                        ) : (
                          <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                            I spotted this pet
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="light"
                      onPress={handleCancel}
                      className="text-zinc-500 text-[9px] !rounded-md py-1 px-3 min-w-0 h-7"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      isLoading={isLoading}
                      isDisabled={!contentValue?.trim() || isUploadingImage}
                      endContent={!isLoading && <Send className="size-3" />}
                      className={`text-[9px] font-bold uppercase tracking-wide !rounded-md py-1 px-3 h-7 shadow-sm ${
                        isSighting
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                          : "bg-gradient-to-r from-steel-blue to-steel-blue/90 dark:from-lime-burst dark:to-lime-burst/90 text-white dark:text-zinc-900"
                      }`}
                    >
                      {isReply ? "Reply" : isSighting ? "Report" : "Post"}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCommentCard;
