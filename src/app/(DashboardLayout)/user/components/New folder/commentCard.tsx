"use client";
import { useState } from "react";
import { Avatar, Button, Chip, Tooltip } from "@heroui/react";
import {
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  MapPin,
  Star,
  MessageCircle,
  Check,
  CornerDownRight,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

import {
  useVoteCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useMarkHelpfulLeadMutation,
} from "@/src/redux/features/comments/commentsApi";
import { TTargetType } from "@/src/redux/features/comments/commentsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { ImageLightbox } from "../../quickAccess/lost-found/components/imagelightbox";
import { TComment } from "@/src/types";
import EditComment from "./editComment";
import AddCommentCard from "./addCommentCard";

interface CommentCardProps {
  comment: TComment & { replies?: TComment[] };
  targetId: string;
  targetType: TTargetType;
  isPostOwner?: boolean;
  depth?: number;
  onCommentUpdated?: (updated: TComment) => void;
}

const MAX_DEPTH = 4;

const CommentCard = ({
  comment,
  targetId,
  targetType,
  isPostOwner = false,
  onCommentUpdated,
  depth = 0,
}: CommentCardProps) => {
  const user = useAppSelector(useCurrentUser);
  const [voteComment] = useVoteCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [markHelpfulLead] = useMarkHelpfulLeadMutation();

  const [commentData, setCommentData] = useState(comment);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDownvoting, setIsDownvoting] = useState(false);

  if (isDeleted) return null;

  const isOwner = user?._id === commentData?.commenter?.commenterId;
  const isSighting = commentData?.isSighting;
  const isHelpfulLead = commentData?.isHelpfulLead;
  const isLostFound = targetType === "LostFound";
  const replies = (commentData as any)?.replies as TComment[] | undefined;

  const handleUpvote = async () => {
    if (!user || isUpvoting) return;
    setIsUpvoting(true);
    try {
      const res = await voteComment({
        commentId: commentData._id,
        voteType: "upvote",
      }).unwrap();
      setCommentData(res.data);
    } catch {
      toast.error("Failed to upvote");
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleDownvote = async () => {
    if (!user || isDownvoting) return;
    setIsDownvoting(true);
    try {
      const res = await voteComment({
        commentId: commentData._id,
        voteType: "downvote",
      }).unwrap();
      setCommentData(res.data);
    } catch {
      toast.error("Failed to downvote");
    } finally {
      setIsDownvoting(false);
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
      className={`relative ${
        depth > 0
          ? "pl-6 before:absolute before:left-2 before:top-0 before:bottom-4 before:w-px before:bg-zinc-300 dark:before:bg-zinc-700 after:absolute after:left-2 after:top-5 after:h-px after:w-4 after:bg-zinc-300 dark:after:bg-zinc-700 mt-2"
          : "mt-3"
      }`}
    >
      <div className="flex">
        {/* Avatar */}
        <div className="relative shrink-0 mt-2 pe-1">
          <Avatar
            size="sm"
            name={commentData?.commenter?.name?.charAt(0).toUpperCase() || "U"}
            src={commentData?.commenter?.profilePhoto || undefined}
            classNames={{
              base: "bg-steel-blue/20 dark:bg-steel-blue/30 size-8",
              name: "text-steel-blue dark:text-lime-burst text-[11px] font-bold",
            }}
          />
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0 bg-default-100 rounded-md p-2">
          {/* Name row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                {commentData?.commenter?.name || "Anonymous"}
              </span>
              {isPostOwner &&
                user?._id === commentData?.commenter?.commenterId && (
                  <Chip
                    size="sm"
                    classNames={{
                      base: "bg-steel-blue/10 dark:bg-lime-burst/10 h-3.5 px-1",
                      content:
                        "text-steel-blue dark:text-lime-burst text-[8px] font-bold uppercase",
                    }}
                  >
                    OWNER
                  </Chip>
                )}
              {isHelpfulLead && (
                <Chip
                  size="sm"
                  startContent={<Star className="size-2.5 fill-current" />}
                  classNames={{
                    base: "bg-lime-burst/20 h-3.5 px-1",
                    content:
                      "text-lime-700 dark:text-lime-burst text-[8px] font-bold uppercase",
                  }}
                >
                  Helpful
                </Chip>
              )}
              <span className="text-[10px] text-zinc-400">
                {formatDistanceToNow(new Date(commentData?.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {/* Mark Helpful + edit/delete */}
            <div className="flex items-center gap-1 shrink-0">
              {isLostFound && isPostOwner && isSighting && !isEditing && (
                <Tooltip
                  content={
                    isHelpfulLead ? "Remove helpful mark" : "Mark as helpful"
                  }
                >
                  <button
                    onClick={handleMarkHelpfulLead}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide transition-all ${
                      isHelpfulLead
                        ? "text-zinc-900 bg-lime-burst shadow-sm"
                        : "text-lime-700 dark:text-lime-burst border border-dashed border-lime-burst/50 hover:bg-lime-burst/10"
                    }`}
                  >
                    <Check className="size-2.5" />
                    {isHelpfulLead ? "Helpful" : "Mark helpful"}
                  </button>
                </Tooltip>
              )}
              {isOwner && !isEditing && (
                <>
                  <Tooltip showArrow content="Edit">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 rounded-md text-zinc-400 hover:text-steel-blue dark:hover:text-lime-burst hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Pencil className="size-3" />
                    </button>
                  </Tooltip>
                  <Tooltip showArrow content="Delete" color="danger">
                    <button
                      onClick={handleDelete}
                      className="p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </Tooltip>
                </>
              )}
            </div>
          </div>

          {/* sighting location pill (view mode) */}
          {!isEditing && isSighting && commentData?.sightingLocation && (
            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30">
              <MapPin className="size-2.5 text-amber-600 dark:text-amber-400" />
              <span className="text-[9px] font-medium text-amber-700 dark:text-amber-400">
                {commentData.sightingLocation}
              </span>
            </div>
          )}

          {/* Content / Edit */}
          {isEditing ? (
            <EditComment
              commentId={commentData._id}
              initialContent={commentData?.content || ""}
              currentImage={commentData?.sightingPhoto || null}
              currentLocation={commentData?.sightingLocation || ""}
              isSighting={!!isSighting}
              onCancel={() => setIsEditing(false)}
              onSuccess={(updatedComment) => {
                setCommentData(updatedComment);
                onCommentUpdated?.(updatedComment);
                setIsEditing(false);
              }}
            />
          ) : (
            <p className="mt-0.5 text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
              {commentData?.content}
            </p>
          )}

          {/* sighting photo (view mode) */}
          {!isEditing && isSighting && commentData?.sightingPhoto && (
            <img
              src={commentData.sightingPhoto}
              alt="Sighting"
              className="mt-1.5 rounded-sm max-h-20 object-cover border border-amber-300/40 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setLightboxIndex(0)}
            />
          )}

          {/* Footer actions */}
          {!isEditing && (
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800/60 p-0.5">
                <button
                  onClick={handleUpvote}
                  disabled={isUpvoting}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-zinc-500 hover:text-steel-blue dark:hover:text-lime-burst transition-all text-[10px] font-semibold disabled:opacity-50"
                >
                  {isUpvoting ? (
                    <div className="size-3 animate-spin rounded-full border-2 border-steel-blue border-t-transparent dark:border-lime-burst" />
                  ) : (
                    <ArrowUp className="size-3" />
                  )}
                  <span>{commentData?.upvotes}</span>
                </button>
                <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700" />
                <button
                  onClick={handleDownvote}
                  disabled={isDownvoting}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-zinc-500 hover:text-red-500 transition-all text-[10px] font-semibold disabled:opacity-50"
                >
                  {isDownvoting ? (
                    <div className="size-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                  ) : (
                    <ArrowDown className="size-3" />
                  )}
                  <span>{commentData?.downvotes}</span>
                </button>
              </div>

              {depth < MAX_DEPTH && (
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
                  {replies && replies.length > 0 && (
                    <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400">
                      ({replies.length})
                    </span>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Reply composer */}
          {isReplying && !isEditing && (
            <div className="mt-2">
              <AddCommentCard
                targetType={targetType}
                targetId={targetId}
                parentCommentId={commentData._id}
                autoExpand
                onSuccess={() => setIsReplying(false)}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}

          {/* Recursive reply threads */}
          {replies && replies.length > 0 && (
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
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {lightboxIndex !== null && commentData?.sightingPhoto && (
        <ImageLightbox
          images={[commentData.sightingPhoto]}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};

export default CommentCard;
