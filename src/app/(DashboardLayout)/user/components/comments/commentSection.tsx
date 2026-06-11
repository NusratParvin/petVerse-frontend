"use client";
import { useState } from "react";
import { Button, Chip, Skeleton } from "@heroui/react";
import { MessageCircle, Eye } from "lucide-react";

import { useGetCommentsByTargetQuery } from "@/src/redux/features/comments/commentsApi";
import { TTargetType } from "@/src/redux/features/comments/commentsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import AddCommentCard from "./addCommentCard";
import CommentCard from "./commentCard";

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

  console.log(user);
  const { data, isLoading, refetch } = useGetCommentsByTargetQuery({
    targetType,
    targetId,
    page,
  });

  const comments = data?.data?.comments ?? [];

  const sightings = comments?.filter((c: any) => c.isSighting);
  const regularComments = comments?.filter((c: any) => !c.isSighting);

  return (
    <section className="w-full mt-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="size-4 text-steel-blue dark:text-lime-burst" />
          <h2 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
            {targetType === "LostFound" ? "Sightings & Comments" : "Comments"}
          </h2>
        </div>
        <Chip
          size="sm"
          classNames={{
            base: "bg-steel-blue/10 dark:bg-lime-burst/10",
            content:
              "text-steel-blue dark:text-lime-burst font-semibold text-[11px]",
          }}
        >
          {comments.length}
        </Chip>

        {/* sighting count badge — lost & found only */}
        {targetType === "LostFound" && sightings.length > 0 && (
          <Chip
            size="sm"
            startContent={<Eye className="size-3" />}
            classNames={{
              base: "bg-amber-500/10",
              content:
                "text-amber-600 dark:text-amber-400 font-semibold text-[11px]",
            }}
          >
            {sightings.length} sighting{sightings.length !== 1 ? "s" : ""}
          </Chip>
        )}
      </div>

      {/* Add comment */}
      <AddCommentCard targetType={targetType} targetId={targetId} />

      {/* Comment list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-zinc-400 dark:text-zinc-600">
          <MessageCircle className="size-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            {targetType === "LostFound"
              ? "No sightings or comments yet. Be the first to help!"
              : "No comments yet. Start the conversation!"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Sightings first for Lost & Found */}
          {targetType === "LostFound" && sightings.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold px-1">
                Sightings
              </p>
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
            <div className="space-y-2">
              {targetType === "LostFound" && sightings.length > 0 && (
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold px-1 pt-2">
                  Comments
                </p>
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

          <Button onPress={() => setPage(page + 1)}>Load More</Button>
        </div>
      )}
    </section>
  );
};

export default CommentSection;
