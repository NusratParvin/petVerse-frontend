"use client";
import { Button, Chip, Skeleton } from "@heroui/react";
import { MessageCircle, Eye, PawPrint, Sparkles } from "lucide-react";
import { TComment } from "@/src/types";
import { TTargetType } from "@/src/redux/features/comments/commentsApi";
import CommentCard from "./commentCard";

interface CommentListProps {
  comments: TComment[];
  targetId: string;
  targetType: TTargetType;
  isPostOwner: boolean;
  isLoading: boolean;
  hasMore?: boolean;
  onLoadMore: () => void;
  onCommentUpdated: (updated: TComment) => void;
  onCommentDeleted: (id: string) => void;
}

const CommentList = ({
  comments,
  targetId,
  targetType,
  isPostOwner,
  isLoading,
  hasMore,
  onLoadMore,
  onCommentUpdated,
  onCommentDeleted,
}: CommentListProps) => {
  const isLostFound = targetType === "LostFound";
  const sightings = comments.filter((c: any) => c.isSighting);
  const regularComments = comments.filter((c: any) => !c.isSighting);

  const sharedProps = {
    targetId,
    targetType,
    isPostOwner,
    onCommentUpdated,
    onCommentDeleted,
  };

  if (isLoading)
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );

  if (comments.length === 0)
    return (
      <div className="text-center py-10 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
        <MessageCircle className="size-5 mx-auto text-steel-blue dark:text-lime-burst mb-2" />
        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          {isLostFound ? "No sightings or comments yet" : "No comments yet"}
        </p>
      </div>
    );

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-steel-blue/10 dark:bg-lime-burst/10 border border-steel-blue/20 dark:border-lime-burst/20">
          <PawPrint
            className="size-3 text-steel-blue dark:text-lime-burst"
            strokeWidth={2.5}
          />
          <h2 className="font-bold text-[11px] text-steel-blue dark:text-lime-burst uppercase tracking-wider">
            {isLostFound ? "Sightings & Comments" : "Comments"}
          </h2>
          <span className="text-[10px] font-bold text-steel-blue/70 dark:text-lime-burst/70 ml-0.5">
            {comments.length}
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

      {/* Sightings */}
      {isLostFound && sightings.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-1">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30">
              <Sparkles className="size-2.5 text-amber-600" />
              <p className="text-[9px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                Sightings ({sightings.length})
              </p>
            </div>
          </div>
          {sightings.map((comment: any) => (
            <CommentCard key={comment._id} comment={comment} {...sharedProps} />
          ))}
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
            </div>
          )}
          {regularComments.map((comment: any) => (
            <CommentCard key={comment._id} comment={comment} {...sharedProps} />
          ))}
        </div>
      )}

      {hasMore && (
        <Button
          size="sm"
          variant="bordered"
          onPress={onLoadMore}
          isLoading={isLoading}
          className="w-full text-[11px] h-8 font-bold uppercase tracking-wider text-steel-blue dark:text-lime-burst border border-dashed border-steel-blue/40 dark:border-lime-burst/40 rounded-xl"
        >
          Load more
        </Button>
      )}
    </div>
  );
};

export default CommentList;
