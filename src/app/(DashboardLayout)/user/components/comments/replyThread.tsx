"use client";
import { useState } from "react";
import { MessageCircle, CornerDownRight } from "lucide-react";
import { TComment } from "@/src/types";
import { TTargetType } from "@/src/redux/features/comments/commentsApi";
import AddCommentCard from "./addCommentCard";
import CommentCard from "./commentCard";

interface ReplyThreadProps {
  initialReplies: TComment[];
  targetId: string;
  targetType: TTargetType;
  parentCommentId: string;
  isPostOwner: boolean;
  depth: number;
  onCommentUpdated: (updated: TComment) => void;
  onCommentDeleted: (id: string) => void;
}

const ReplyThread = ({
  initialReplies,
  targetId,
  targetType,
  parentCommentId,
  isPostOwner,
  depth,
  onCommentUpdated,
  onCommentDeleted,
}: ReplyThreadProps) => {
  const [replies, setReplies] = useState<TComment[]>(initialReplies);
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const handleNewReply = (newReply: TComment) => {
    setReplies((prev) => [...prev, newReply]);
    setShowReplies(true);
    setIsReplying(false);
  };

  const handleReplyDeleted = (id: string) => {
    setReplies((prev) => prev.filter((r) => r._id !== id));
  };

  const handleReplyUpdated = (updated: TComment) => {
    setReplies((prev) =>
      prev.map((r) => (r._id === updated._id ? updated : r)),
    );
    onCommentUpdated(updated);
  };

  return (
    <div className="mt-1.5">
      <div className="flex items-center gap-2">
        {/* Reply button */}
        <button
          onClick={() => setIsReplying((v) => !v)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-colors ${
            isReplying
              ? "text-steel-blue dark:text-lime-burst bg-steel-blue/10 dark:bg-lime-burst/10"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          }`}
        >
          <MessageCircle className="size-3" />
          <span>{isReplying ? "Cancel" : "Reply"}</span>
        </button>

        {/* Show/hide replies toggle — separate from reply button */}
        {replies.length > 0 && (
          <button
            onClick={() => setShowReplies((v) => !v)}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <CornerDownRight className="size-3" />
            <span>
              {showReplies
                ? "Hide"
                : `${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
            </span>
          </button>
        )}
      </div>

      {/* Composer */}
      {isReplying && (
        <div className="mt-2">
          <AddCommentCard
            targetType={targetType}
            targetId={targetId}
            parentCommentId={parentCommentId}
            autoExpand
            onSuccess={handleNewReply}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {/* Replies */}
      {showReplies && replies.length > 0 && (
        <div className="mt-1">
          {replies.map((reply) => (
            <div key={reply._id} className="relative">
              <CornerDownRight className="absolute -left-0.5 top-3 size-3 text-zinc-300 dark:text-zinc-700 pointer-events-none" />
              <CommentCard
                comment={reply as any}
                targetId={targetId}
                targetType={targetType}
                isPostOwner={isPostOwner}
                depth={depth + 1}
                onCommentUpdated={handleReplyUpdated}
                onCommentDeleted={handleReplyDeleted}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyThread;
