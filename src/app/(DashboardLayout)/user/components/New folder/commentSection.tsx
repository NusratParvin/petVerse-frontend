"use client";
import { useEffect, useState } from "react";
import { Button, Chip, Skeleton } from "@heroui/react";
import { MessageCircle, Eye } from "lucide-react";

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

  // console.log(allComments, page, hasMore);

  const sightings = allComments?.filter((c: any) => c.isSighting);
  const regularComments = allComments?.filter((c: any) => !c.isSighting);

  return (
    <section className="w-full mt-4 space-y-3">
      {/* Header   */}
      <div className="flex items-center gap-2 px-1">
        <div className="flex items-center gap-1.5">
          <MessageCircle className="size-3.5 text-steel-blue dark:text-lime-burst" />
          <h2 className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">
            {targetType === "LostFound" ? "Sightings & Comments" : "Comments"}
          </h2>
        </div>
        <Chip
          size="sm"
          classNames={{
            base: "bg-steel-blue/10 dark:bg-lime-burst/10 h-5",
            content:
              "text-steel-blue dark:text-lime-burst font-semibold text-[10px] px-1",
          }}
        >
          {allComments.length}
        </Chip>

        {/* sighting count badge — lost & found only */}
        {targetType === "LostFound" && sightings.length > 0 && (
          <Chip
            size="sm"
            startContent={<Eye className="size-2.5" />}
            classNames={{
              base: "bg-amber-500/10 h-5",
              content:
                "text-amber-600 dark:text-amber-400 font-semibold text-[10px] px-1",
            }}
          >
            {sightings.length}
          </Chip>
        )}
      </div>

      {/* Add comment */}
      <AddCommentCard targetType={targetType} targetId={targetId} />

      {/* Comment list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : allComments?.length === 0 ? (
        <div className="text-center py-6 text-zinc-400 dark:text-zinc-600">
          <MessageCircle className="size-6 mx-auto mb-1 opacity-30" />
          <p className="text-xs">
            {targetType === "LostFound"
              ? "No sightings or comments yet"
              : "No comments yet"}
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
            Be the first to start the conversation
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Sightings first for Lost & Found */}
          {targetType === "LostFound" && sightings.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 px-1">
                <Eye className="size-2.5 text-amber-500" />
                <p className="text-[9px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                  Sightings ({sightings.length})
                </p>
              </div>
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
          )}

          {/* Regular comments */}
          {regularComments.length > 0 && (
            <div className="space-y-1.5">
              {targetType === "LostFound" && sightings.length > 0 && (
                <div className="flex items-center gap-1.5 px-1 pt-1">
                  <MessageCircle className="size-2.5 text-steel-blue dark:text-lime-burst" />
                  <p className="text-[9px] uppercase tracking-wider text-steel-blue dark:text-lime-burst font-bold">
                    Comments ({regularComments.length})
                  </p>
                </div>
              )}
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
          )}

          {/* Load More Button - Styled with your colors */}
          {hasMore && (
            <div className="pt-1">
              <Button
                size="sm"
                variant="light"
                isDisabled={!hasMore}
                onPress={() => setPage(page + 1)}
                isLoading={isLoading}
                className="w-full text-xs h-8 font-medium text-steel-blue dark:text-lime-burst hover:bg-steel-blue/5 dark:hover:bg-lime-burst/5"
              >
                Load more comments
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
