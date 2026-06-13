"use client";
import { useState } from "react";
import { Avatar, Chip, Tooltip } from "@heroui/react";
import { MapPin, Star, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  useDeleteCommentMutation,
  useMarkHelpfulLeadMutation,
} from "@/src/redux/features/comments/commentsApi";
import { TTargetType } from "@/src/redux/features/comments/commentsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { ImageLightbox } from "../../quickAccess/lost-found/components/imagelightbox";
import { TComment } from "@/src/types";
import EditComment from "./editComment";
import CommentActions from "./commentActions";
import ReplyThread from "./replyThread";

interface CommentCardProps {
  comment: TComment & { replies?: TComment[] };
  targetId: string;
  targetType: TTargetType;
  isPostOwner: boolean;
  depth?: number;
  onCommentUpdated: (updated: TComment) => void;
  onCommentDeleted: (id: string) => void;
}

const CommentCard = ({
  comment,
  targetId,
  targetType,
  isPostOwner,
  depth = 0,
  onCommentUpdated,
  onCommentDeleted,
}: CommentCardProps) => {
  const user = useAppSelector(useCurrentUser);
  const [deleteComment] = useDeleteCommentMutation();
  const [markHelpfulLead] = useMarkHelpfulLeadMutation();

  const [commentData, setCommentData] = useState(comment);
  const [isEditing, setIsEditing] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isOwner = user?._id === commentData?.commenter?.commenterId;
  const isSighting = commentData?.isSighting;
  const isHelpfulLead = commentData?.isHelpfulLead;
  const isLostFound = targetType === "LostFound";

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting...");
    try {
      await deleteComment({ commentId: commentData._id, targetId }).unwrap();
      onCommentDeleted(commentData._id);
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

        <div className="flex-1 min-w-0 bg-default-100 rounded-md p-2">
          {/* Header row */}
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

            {/* Actions */}
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
                    {isHelpfulLead ? "✓ Helpful" : "Mark helpful"}
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

          {/* Location pill */}
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
                onCommentUpdated(updatedComment);
                setIsEditing(false);
              }}
            />
          ) : (
            <p className="mt-0.5 text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
              {commentData?.content}
            </p>
          )}

          {/* Sighting photo */}
          {!isEditing && isSighting && commentData?.sightingPhoto && (
            <img
              src={commentData.sightingPhoto}
              alt="Sighting"
              className="mt-1.5 rounded-sm max-h-20 object-cover border border-amber-300/40 cursor-pointer hover:opacity-90"
              onClick={() => setLightboxIndex(0)}
            />
          )}

          {/* Votes + Reply toggle */}
          {!isEditing && (
            <CommentActions
              commentId={commentData._id}
              upvotes={commentData.upvotes}
              downvotes={commentData.downvotes}
              onVoted={(updated) => setCommentData(updated)}
            />
          )}

          {/* Reply thread */}
          {!isEditing && depth < 4 && (
            <ReplyThread
              initialReplies={(commentData as any).replies ?? []}
              targetId={targetId}
              targetType={targetType}
              parentCommentId={commentData._id}
              isPostOwner={isPostOwner}
              depth={depth}
              onCommentUpdated={onCommentUpdated}
              onCommentDeleted={onCommentDeleted}
            />
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
