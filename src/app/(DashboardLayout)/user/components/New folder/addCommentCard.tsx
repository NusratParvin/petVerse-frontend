"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Avatar, Textarea, Chip, Switch } from "@heroui/react";
import { Eye, MapPin, ImagePlus, X } from "lucide-react";
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

  // sighting mode only relevant for LostFound
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
      // sighting fields — only sent for LostFound
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
    <div className="rounded-md bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-1.5 space-y-1">
      <div className="flex items-center gap-2">
        <Avatar
          size="sm"
          name={user?.name?.charAt(0).toUpperCase() || "U"}
          src={user?.profilePhoto || undefined}
          classNames={{
            base: "bg-steel-blue/20 dark:bg-steel-blue/30 shrink-0",
            name: "text-steel-blue dark:text-lime-burst font-bold",
          }}
        />

        <div className="flex-1 space-y-1">
          {/* collapsed state — just a placeholder */}
          {!isExpanded ? (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="w-full text-left p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-zinc-400 dark:text-zinc-500 text-xs hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              {isLostFound
                ? "Report a sighting or leave a comment..."
                : "Write a comment..."}
            </button>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              {/* text area */}
              <Textarea
                {...register("content", { required: true })}
                placeholder={
                  isSighting
                    ? "Describe where and when you saw this pet..."
                    : "Write your comment..."
                }
                minRows={2}
                maxRows={5}
                classNames={{
                  input: "text-xs text-zinc-800 dark:text-zinc-200 ",
                  inputWrapper:
                    "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-steel-blue dark:hover:border-lime-burst transition-colors !rounded-md  ",
                }}
              />

              {/* sighting location field */}
              {isLostFound && isSighting && (
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-zinc-400" />
                  <input
                    {...register("sightingLocation")}
                    placeholder="Where did you see them? (area, landmark...)"
                    className="w-full pl-6 p-1.5 text-xs rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-steel-blue dark:focus:border-lime-burst transition-colors"
                  />
                </div>
              )}

              {/* actions */}
              <div className="flex items-center justify-between">
                <div className="flex flex-row gap-3">
                  <div className="flex items-center gap-2">
                    {/* placeholder for future photo upload */}
                    <button
                      type="button"
                      title="Add photo (coming soon)"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <ImagePlus className="size-4" />
                    </button>
                  </div>

                  {/* sighting toggle — lost & found only */}
                  {isLostFound && (
                    <div className="flex items-center gap-2 ">
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
                      <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                        I spotted this pet
                      </span>
                      {isSighting && (
                        <Chip
                          size="sm"
                          startContent={
                            <Eye className="size-3 pe-0.5 text-amber-700" />
                          }
                          classNames={{
                            base: "bg-amber-500/15 px-2 ",
                            content:
                              "text-amber-600 dark:text-amber-400 text-[10px] font-semibold",
                          }}
                        >
                          Sighting
                        </Chip>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={() => {
                      reset();
                      setIsExpanded(false);
                      setIsSighting(false);
                    }}
                    // startContent={<X className="size-3" />}
                    className="text-zinc-500 text-[10px] !rounded-md  py-1 px-3 border-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={isLoading}
                    isDisabled={!contentValue?.trim()}
                    className={`text-[10px] font-semibold !rounded-md py-1 px-2 ${
                      isSighting
                        ? "bg-amber-500 text-black"
                        : "bg-steel-blue text-white dark:bg-lime-burst dark:text-zinc-900"
                    }`}
                  >
                    {isSighting ? "Report Sighting" : "Post"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCommentCard;
