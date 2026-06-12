"use client";
import { useEffect, useState } from "react";
import { Button, Chip, Skeleton } from "@heroui/react";
import { MessageCircle, Eye, PawPrint, Sparkles } from "lucide-react";

import { useGetCommentsByTargetQuery } from "@/src/redux/features/comments/commentsApi";
import { TTargetType } from "@/src/redux/features/comments/commentsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import AddCommentCard from "./addCommentCard";
import CommentCard from "./commentCard";
import { TComment } from "@/src/types";

interface CommentSectionProps {
  targetType: TTargetType;
  targetId: string;
  postOwnerId?: string;
}

const CommentSection = ({
  targetType,
  targetId,
  postOwnerId,
}: CommentSectionProps) => {
  const user = useAppSelector(useCurrentUser);
  const isPostOwner = user?._id === postOwnerId;
  const [page, setPage] = useState(1);
  const [allComments, setAllComments] = useState<TComment[]>([]);

  const { data, isLoading } = useGetCommentsByTargetQuery({
    targetType,
    targetId,
    page,
  });

  const comments = data?.data?.comments ?? [];
  const hasMore = data?.data?.hasMore;

  useEffect(() => {
    if (!data?.data?.comments) return;
    if (page === 1) {
      setAllComments(comments);
    } else if (page > 1) {
      setAllComments((prev) => [...prev, ...comments]);
    }
  }, [data]);

  const sightings = allComments?.filter((c: any) => c.isSighting);
  const regularComments = allComments?.filter((c: any) => !c.isSighting);
  const isLostFound = targetType === "LostFound";

  return (
    <section className="w-full mt-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-steel-blue/10 dark:bg-lime-burst/10 border border-steel-blue/20 dark:border-lime-burst/20">
          <PawPrint
            className="size-2.5 text-steel-blue dark:text-lime-burst"
            strokeWidth={2.5}
          />
          <h2 className="font-semibold text-[9px] text-steel-blue dark:text-lime-burst uppercase tracking-wider">
            {isLostFound ? "Sightings & Comments" : "Comments"}
          </h2>
          <span className="text-[9px] font-bold text-steel-blue/70 dark:text-lime-burst/70 ml-0.5">
            {allComments.length}
          </span>
        </div>

        {isLostFound && sightings.length > 0 && (
          <Chip
            size="sm"
            startContent={<Eye className="size-2.5" />}
            classNames={{
              base: "bg-amber-500/10 h-5 border border-amber-400/30",
              content:
                "text-amber-700 dark:text-amber-400 font-bold text-[10px] px-1",
            }}
          >
            {sightings.length} spotted
          </Chip>
        )}
      </div>

      {/* Add comment */}
      <AddCommentCard targetType={targetType} targetId={targetId} />

      {/* Comment list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : allComments?.length === 0 ? (
        <div className="relative text-center py-10 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-hidden">
          {/* decorative paws */}
          <PawPrint
            className="absolute top-3 left-6 size-5 text-steel-blue/10 dark:text-lime-burst/10 -rotate-12"
            strokeWidth={2}
          />
          <PawPrint
            className="absolute bottom-3 right-8 size-4 text-steel-blue/10 dark:text-lime-burst/10 rotate-45"
            strokeWidth={2}
          />
          <PawPrint
            className="absolute top-1/2 right-12 size-3 text-steel-blue/10 dark:text-lime-burst/10 rotate-12"
            strokeWidth={2}
          />

          <div className="inline-flex size-10 rounded-full bg-steel-blue/10 dark:bg-lime-burst/10 items-center justify-center mb-2">
            <MessageCircle className="size-5 text-steel-blue dark:text-lime-burst" />
          </div>
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {isLostFound ? "No sightings or comments yet" : "No comments yet"}
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
            Be the first to start the conversation 🐾
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Sightings first for Lost & Found */}
          {isLostFound && sightings.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 px-1">
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30">
                  <Sparkles className="size-2.5 text-amber-600" />
                  <p className="text-[9px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                    Sightings ({sightings.length})
                  </p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-400/30 to-transparent" />
              </div>
              <div className="space-y-2">
                {sightings.map((comment: any) => (
                  <CommentCard
                    key={comment._id}
                    comment={comment}
                    targetId={targetId}
                    targetType={targetType}
                    isPostOwner={isPostOwner}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular comments */}
          {regularComments.length > 0 && (
            <div className="space-y-2">
              {isLostFound && sightings.length > 0 && (
                <div className="flex items-center gap-1.5 px-1 pt-1">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-steel-blue/10 dark:bg-lime-burst/10 border border-steel-blue/20 dark:border-lime-burst/20">
                    <MessageCircle className="size-2.5 text-steel-blue dark:text-lime-burst" />
                    <p className="text-[9px] uppercase tracking-wider text-steel-blue dark:text-lime-burst font-bold">
                      Comments ({regularComments.length})
                    </p>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-steel-blue/30 dark:from-lime-burst/30 to-transparent" />
                </div>
              )}
              <div className="space-y-2">
                {regularComments.map((comment: any) => (
                  <CommentCard
                    key={comment._id}
                    comment={comment}
                    targetId={targetId}
                    targetType={targetType}
                    isPostOwner={isPostOwner}
                  />
                ))}
              </div>
            </div>
          )}

          {hasMore && (
            <div className="pt-1">
              <Button
                size="sm"
                variant="bordered"
                isDisabled={!hasMore}
                onPress={() => setPage(page + 1)}
                isLoading={isLoading}
                startContent={
                  !isLoading && (
                    <PawPrint className="size-3" strokeWidth={2.5} />
                  )
                }
                className="w-full text-[11px] h-8 font-bold uppercase tracking-wider text-steel-blue dark:text-lime-burst border border-dashed border-steel-blue/40 dark:border-lime-burst/40 hover:bg-steel-blue/5 dark:hover:bg-lime-burst/5 rounded-xl"
              >
                Load more
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
