"use client";
import { useState } from "react";
import { Avatar, Button, Chip, Tooltip } from "@heroui/react";
import {
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  MapPin,
  Eye,
  Star,
  MessageCircle,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

import EditComment from "./editComment";
import {
  useVoteCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useMarkHelpfulLeadMutation,
} from "@/src/redux/features/comments/commentsApi";
import { TTargetType } from "@/src/redux/features/comments/commentsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";

interface CommentCardProps {
  comment: any;
  targetId: string;
  targetType: TTargetType;
  isPostOwner?: boolean;
  // future: thread depth
  depth?: number;
}

const CommentCard = ({
  comment,
  targetId,
  targetType,
  isPostOwner = false,
  depth = 0,
}: CommentCardProps) => {
  const user = useAppSelector(useCurrentUser);
  const [voteComment] = useVoteCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [markHelpfulLead] = useMarkHelpfulLeadMutation();

  const [commentData, setCommentData] = useState(comment);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  if (isDeleted) return null;

  const isOwner = user?._id === commentData?.commenter?.commenterId;
  const isSighting = commentData?.isSighting;
  const isHelpfulLead = commentData?.isHelpfulLead;
  const isLostFound = targetType === "LostFound";

  const handleUpvote = async () => {
    try {
      const res = await voteComment({
        commentId: commentData._id,
        voteType: "upvote",
      }).unwrap();
      setCommentData(res.data);
    } catch {
      toast.error("Failed to upvote");
    }
  };

  const handleDownvote = async () => {
    try {
      const res = await voteComment({
        commentId: commentData._id,
        voteType: "downvote",
      }).unwrap();
      setCommentData(res.data);
    } catch {
      toast.error("Failed to downvote");
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting...");
    try {
      await deleteComment({ commentId: commentData._id, targetId }).unwrap();
      setIsDeleted(true);
      toast.success("Comment deleted", { id: toastId });
    } catch {
      toast.error("Failed to delete", { id: toastId });
    }
  };

  const handleUpdate = async (newContent: string) => {
    const toastId = toast.loading("Updating...");
    try {
      const res = await updateComment({
        commentId: commentData._id,
        content: newContent,
      }).unwrap();
      setCommentData(res.data);
      setIsEditing(false);
      toast.success("Updated!", { id: toastId });
    } catch {
      toast.error("Failed to update", { id: toastId });
    }
  };

  const handleMarkHelpfulLead = async () => {
    const toastId = toast.loading("Updating...");
    try {
      const res = await markHelpfulLead({
        commentId: commentData._id,
        isHelpfulLead: !isHelpfulLead,
      }).unwrap();
      setCommentData(res.data);
      toast.success(
        res.data.isHelpfulLead ? "Marked as helpful lead! 🎉" : "Unmarked",
        { id: toastId },
      );
    } catch {
      toast.error("Failed", { id: toastId });
    }
  };

  return (
    <div
      className={`
        relative rounded-xl border transition-all duration-200
        ${
          isHelpfulLead
            ? "border-lime-burst/40 bg-lime-burst/5 dark:bg-lime-burst/5"
            : isSighting
              ? "border-amber-400/30 bg-amber-500/5 dark:bg-amber-500/5"
              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40"
        }
        ${depth > 0 ? "ml-8 mt-2" : ""}
      `}
    >
      {/* helpful lead banner */}
      {isHelpfulLead && (
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-lime-burst/20 dark:bg-lime-burst/10 rounded-t-xl border-b border-lime-burst/20">
          <Star className="size-3 text-lime-600 dark:text-lime-burst fill-current" />
          <span className="text-[11px] font-bold text-lime-700 dark:text-lime-burst uppercase tracking-wide">
            Helpful Lead
          </span>
        </div>
      )}

      <div className="p-3 space-y-2">
        {/* top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar
              size="sm"
              name={
                commentData?.commenter?.name?.charAt(0).toUpperCase() || "U"
              }
              src={commentData?.commenter?.profilePhoto || undefined}
              classNames={{
                base: "bg-steel-blue/20 dark:bg-steel-blue/30 shrink-0",
                name: "text-steel-blue dark:text-lime-burst text-xs font-bold",
              }}
            />
            <div>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {commentData?.commenter?.name || "Anonymous"}
              </span>
              <span className="text-[11px] text-zinc-400 ml-2">
                {formatDistanceToNow(new Date(commentData?.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          {/* badges */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isSighting && (
              <Chip
                size="sm"
                startContent={<Eye className="size-3" />}
                classNames={{
                  base: "bg-amber-500/15 h-5",
                  content:
                    "text-amber-600 dark:text-amber-400 text-[10px] font-semibold px-1",
                }}
              >
                Sighting
              </Chip>
            )}

            {/* owner actions */}
            {isOwner && !isEditing && (
              <div className="flex items-center gap-1">
                <Tooltip content="Edit">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 rounded-md text-zinc-400 hover:text-steel-blue dark:hover:text-lime-burst hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Pencil className="size-3" />
                  </button>
                </Tooltip>
                <Tooltip content="Delete" color="danger">
                  <button
                    onClick={handleDelete}
                    className="p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        {/* sighting location */}
        {isSighting && commentData?.sightingLocation && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
            <MapPin className="size-3" />
            <span>{commentData.sightingLocation}</span>
          </div>
        )}

        {/* content */}
        {isEditing ? (
          <EditComment
            comment={commentData.content}
            onCancel={() => setIsEditing(false)}
            onSubmit={handleUpdate}
          />
        ) : (
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pl-8">
            {commentData?.content}
          </p>
        )}

        {/* sighting photo */}
        {isSighting && commentData?.sightingPhoto && (
          <div className="pl-8">
            <img
              src={commentData.sightingPhoto}
              alt="Sighting photo"
              className="rounded-lg max-h-48 object-cover border border-zinc-200 dark:border-zinc-700"
            />
          </div>
        )}

        {/* footer actions */}
        <div className="flex items-center justify-between pl-7 pt-1">
          <div className="flex items-center gap-1">
            {/* upvote */}
            <button
              onClick={handleUpvote}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-zinc-500 hover:text-steel-blue dark:hover:text-lime-burst hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs"
            >
              <ArrowUp className="size-3.5" />
              <span>{commentData?.upvotes}</span>
            </button>

            {/* downvote */}
            <button
              onClick={handleDownvote}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-xs"
            >
              <ArrowDown className="size-3.5" />
              <span>{commentData?.downvotes}</span>
            </button>

            {/* reply — wired for future threads, disabled for now */}
            <Tooltip content="Replies coming soon">
              <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors text-xs opacity-60">
                <MessageCircle className="size-3.5" />
                <span>Reply</span>
              </button>
            </Tooltip>
          </div>

          {/* mark helpful lead — post owner only, lost & found only */}
          {isLostFound && isPostOwner && isSighting && (
            <Tooltip
              content={
                isHelpfulLead
                  ? "Remove helpful lead mark"
                  : "Mark as helpful lead"
              }
            >
              <button
                onClick={handleMarkHelpfulLead}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                  isHelpfulLead
                    ? "text-lime-600 dark:text-lime-burst bg-lime-burst/10"
                    : "text-zinc-400 hover:text-lime-600 dark:hover:text-lime-burst hover:bg-lime-burst/10"
                }`}
              >
                <Check className="size-3.5" />
                {isHelpfulLead ? "Helpful lead" : "Mark helpful"}
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* future: render replies here using parentId */}
      {/* {comment.replies?.map(reply => <CommentCard key={reply._id} comment={reply} depth={depth + 1} ... />)} */}
    </div>
  );
};

export default CommentCard;
