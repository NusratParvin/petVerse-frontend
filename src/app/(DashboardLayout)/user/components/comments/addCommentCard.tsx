"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Avatar, Textarea, Chip, Switch } from "@heroui/react";
import { Eye, MapPin, ImagePlus, PawPrint, Send } from "lucide-react";
import { toast } from "sonner";

import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAddCommentMutation } from "@/src/redux/features/comments/commentsApi";
import { TTargetType } from "@/src/redux/features/comments/commentsApi";

type FormData = {
  content: string;
  sightingLocation?: string;
};

interface AddCommentCardProps {
  targetType: TTargetType;
  targetId: string;
}

const AddCommentCard = ({ targetType, targetId }: AddCommentCardProps) => {
  const user = useAppSelector(useCurrentUser);
  const { register, handleSubmit, reset, watch } = useForm<FormData>();
  const [addComment, { isLoading }] = useAddCommentMutation();

  const [isSighting, setIsSighting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const contentValue = watch("content");
  const isLostFound = targetType === "LostFound";

  const onSubmit = async (data: FormData) => {
    const commentData = {
      targetType,
      targetId,
      content: data.content,
      commenter: {
        name: user?.name,
        profilePhoto: user?.profilePhoto || "",
      },
      ...(isLostFound && {
        isSighting,
        sightingLocation: data.sightingLocation || "",
      }),
    };

    const toastId = toast.loading(
      isSighting ? "Reporting sighting..." : "Posting comment...",
    );

    try {
      await addComment(commentData).unwrap();
      reset();
      setIsSighting(false);
      setIsExpanded(false);
      toast.success(isSighting ? "Sighting reported! 🐾" : "Comment posted!", {
        id: toastId,
      });
    } catch {
      toast.error("Failed to post. Try again.", { id: toastId });
    }
  };

  return (
    <div
      className={`group relative rounded-md p-[1.5px] transition-all duration-300 ${
        isSighting
          ? "bg-gradient-to-br from-amber-400 via-amber-300 to-orange-400"
          : isExpanded
            ? "bg-gradient-to-br from-steel-blue/60 via-lime-burst/40 to-steel-blue/60 dark:from-lime-burst/60 dark:via-steel-blue/40 dark:to-lime-burst/60"
            : "bg-zinc-200 dark:bg-zinc-800"
      }`}
    >
      {/* paw watermark */}
      <PawPrint
        className="absolute -top-2 -right-2 size-8 text-steel-blue/10 dark:text-lime-burst/10 rotate-12 pointer-events-none"
        strokeWidth={1.5}
      />

      <div className="relative rounded-md bg-white dark:bg-zinc-900 p-1.5">
        <div className="flex items-start gap-2.5">
          <div className="relative shrink-0">
            <Avatar
              size="sm"
              name={user?.name?.charAt(0).toUpperCase() || "U"}
              src={user?.profilePhoto || undefined}
              classNames={{
                base: "bg-steel-blue/20 dark:bg-steel-blue/30 ring-2 ring-white dark:ring-zinc-900",
                name: "text-steel-blue dark:text-lime-burst font-bold",
              }}
            />
            {/* tiny paw stamp */}
            <div className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-lime-burst dark:bg-lime-burst grid place-items-center ring-2 ring-white dark:ring-zinc-900">
              <PawPrint className="size-2 text-zinc-900" strokeWidth={3} />
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            {!isExpanded ? (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="w-full text-left px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-xs hover:border-steel-blue dark:hover:border-lime-burst hover:text-steel-blue dark:hover:text-lime-burst transition-all"
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
                    isSighting
                      ? "Describe where & when you saw this pet..."
                      : "What's on your mind?"
                  }
                  minRows={2}
                  maxRows={5}
                  classNames={{
                    input: "text-xs text-zinc-800 dark:text-zinc-200",
                    inputWrapper:
                      "bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 hover:border-steel-blue dark:hover:border-lime-burst transition-colors !rounded-xl",
                  }}
                />

                {isLostFound && isSighting && (
                  <div className="relative animate-in slide-in-from-top-1 fade-in duration-200">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-amber-500" />
                    <input
                      {...register("sightingLocation")}
                      placeholder="Where did you spot them? (area, landmark...)"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-amber-50/60 dark:bg-amber-500/5 border border-amber-300/50 dark:border-amber-500/30 text-zinc-800 dark:text-zinc-200 placeholder-amber-700/40 dark:placeholder-amber-300/40 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                )}

                {/* ===== FUTURE: image upload preview slot =====
                {imagePreview && (
                  <div className="relative inline-block">
                    <img src={imagePreview} className="h-20 rounded-lg border border-zinc-200 dark:border-zinc-700" />
                    <button type="button" onClick={removeImage}
                      className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-zinc-900 text-white grid place-items-center">
                      <X className="size-3" />
                    </button>
                  </div>
                )}
                ================================================ */}

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* image upload — coming soon */}
                    <button
                      type="button"
                      title="Add photo (coming soon)"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-steel-blue dark:hover:text-lime-burst hover:bg-steel-blue/5 dark:hover:bg-lime-burst/10 transition-colors"
                    >
                      <ImagePlus className="size-4" />
                    </button>

                    {isLostFound && (
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
                                "text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wide",
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
                      onPress={() => {
                        reset();
                        setIsExpanded(false);
                        setIsSighting(false);
                      }}
                      className="text-zinc-500 text-[10px] !rounded-lg py-1 px-3 min-w-0 h-7"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      isLoading={isLoading}
                      isDisabled={!contentValue?.trim()}
                      endContent={!isLoading && <Send className="size-3" />}
                      className={`text-[10px] font-bold uppercase tracking-wide !rounded-lg py-1 px-3 h-7 shadow-sm ${
                        isSighting
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                          : "bg-gradient-to-r from-steel-blue to-steel-blue/90 dark:from-lime-burst dark:to-lime-burst/90 text-white dark:text-zinc-900"
                      }`}
                    >
                      {isSighting ? "Report" : "Post"}
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
