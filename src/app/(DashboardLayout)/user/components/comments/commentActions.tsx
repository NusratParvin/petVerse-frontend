"use client";
import { useState } from "react";
import { ArrowUp, ArrowDown, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useVoteCommentMutation } from "@/src/redux/features/comments/commentsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { TComment } from "@/src/types";

interface CommentActionsProps {
  commentId: string;
  upvotes: number;
  downvotes: number;
  onVoted: (updated: TComment) => void;
}

const CommentActions = ({
  commentId,
  upvotes,
  downvotes,
  onVoted,
}: CommentActionsProps) => {
  const user = useAppSelector(useCurrentUser);
  const [voteComment] = useVoteCommentMutation();
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDownvoting, setIsDownvoting] = useState(false);

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!user) return;
    if (voteType === "upvote") setIsUpvoting(true);
    else setIsDownvoting(true);
    try {
      const res = await voteComment({ commentId, voteType }).unwrap();
      onVoted(res.data);
    } catch {
      toast.error("Failed to vote");
    } finally {
      setIsUpvoting(false);
      setIsDownvoting(false);
    }
  };

  return (
    <div className="flex items-center gap-1 mt-1.5">
      <div className="flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800/60 p-0.5">
        <button
          onClick={() => handleVote("upvote")}
          disabled={isUpvoting}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-zinc-500 hover:text-steel-blue dark:hover:text-lime-burst text-[10px] font-semibold disabled:opacity-50"
        >
          {isUpvoting ? (
            <div className="size-3 animate-spin rounded-full border-2 border-steel-blue border-t-transparent" />
          ) : (
            <ArrowUp className="size-3" />
          )}
          <span>{upvotes}</span>
        </button>
        <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700" />
        <button
          onClick={() => handleVote("downvote")}
          disabled={isDownvoting}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-zinc-500 hover:text-red-500 text-[10px] font-semibold disabled:opacity-50"
        >
          {isDownvoting ? (
            <div className="size-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          ) : (
            <ArrowDown className="size-3" />
          )}
          <span>{downvotes}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentActions;
