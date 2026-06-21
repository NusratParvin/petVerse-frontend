"use client";
import { useEffect, useState } from "react";
import { Avatar, Chip, Tooltip } from "@heroui/react";
import {
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  MapPin,
  Star,
  MessageCircle,
  Check,
  PawPrint,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

import {
  useVoteCommentMutation,
  useDeleteCommentMutation,
  useMarkHelpfulLeadMutation,
  useGetRepliesByParentIdQuery,
} from "@/src/redux/features/comments/commentsApi";
import { TTargetType } from "@/src/redux/features/comments/commentsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { ImageLightbox } from "../../quickAccess/lost-found/components/imagelightbox";
import { TComment } from "@/src/types";
import EditComment from "./editComment";
import AddCommentCard from "./addCommentCard";

interface CommentCardProps {
  comment: TComment;
  targetId: string;
  targetType: TTargetType;
  isPostOwner: boolean;
  depth?: number;
  /** Only required for top-level cards so the section list can sync. */
  onCommentUpdated?: (updated: TComment) => void;
  onCommentDeleted?: (id: string) => void;
}

const MAX_DEPTH = 4;

/* ---------- creative thread connector ---------- */
const PawConnector = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute left-0 top-0 h-9 w-9 text-steel-blue/40 dark:text-lime-burst/40"
  >
    <svg viewBox="0 0 36 36" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="paw-thread" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* vertical drop, then a soft quarter-curve into the child avatar */}
      <path
        d="M14 -4 V18 Q14 30 28 30"
        fill="none"
        stroke="url(#paw-thread)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="0"
      />
    </svg>
    {/* paws walking along the curve */}
    <PawPrint
      className="absolute left-[10px] top-[10px] size-[9px] -rotate-12 text-steel-blue/60 dark:text-lime-burst/60"
      strokeWidth={2.5}
    />
    <PawPrint
      className="absolute left-[20px] top-[22px] size-[10px] rotate-[35deg] text-lime-burst"
      strokeWidth={2.5}
    />
  </span>
);

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
  const [voteComment] = useVoteCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [markHelpfulLead] = useMarkHelpfulLeadMutation();

  const [commentData, setCommentData] = useState<TComment>(comment);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDownvoting, setIsDownvoting] = useState(false);

  /* ---------- replies (self-fetch) ---------- */
  const [replyPage, setReplyPage] = useState(1);
  const [replies, setReplies] = useState<TComment[]>([]);
  const [replyTotal, setReplyTotal] = useState<number>(
    (commentData as any)?.replyCount ?? 0,
  );

  const { data: repliesData, isFetching: isFetchingReplies } =
    useGetRepliesByParentIdQuery(
      { parentId: commentData._id, page: replyPage },
      { skip: !showReplies },
    );

  useEffect(() => {
    if (!repliesData?.data?.replies) return;
    if (replyPage === 1) {
      setReplies(repliesData.data.replies);
    } else {
      setReplies((prev) => {
        const ids = new Set(prev.map((r) => r._id));
        return [
          ...prev,
          ...repliesData.data.replies.filter((r: TComment) => !ids.has(r._id)),
        ];
      });
    }
    if (typeof repliesData.data.total === "number")
      setReplyTotal(repliesData.data.total);
  }, [repliesData, replyPage]);

  if (isDeleted) return null;

  const isOwner = user?._id === commentData?.commenter?.commenterId;
  const isSighting = commentData?.isSighting;
  const isHelpfulLead = commentData?.isHelpfulLead;
  const isLostFound = targetType === "LostFound";
  const canReply = depth < MAX_DEPTH;
  const hasMoreReplies =
    !!repliesData?.data?.hasMore || replies.length < replyTotal;

  /* ---------- mutations ---------- */
  const syncSelf = (updated: TComment) => {
    setCommentData(updated);
    onCommentUpdated?.(updated);
  };

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!user) return;
    voteType === "upvote" ? setIsUpvoting(true) : setIsDownvoting(true);
    try {
      const res = await voteComment({
        commentId: commentData._id,
        voteType,
      }).unwrap();
      syncSelf(res.data);
    } catch {
      toast.error("Failed to vote");
    } finally {
      setIsUpvoting(false);
      setIsDownvoting(false);
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting...");
    try {
      await deleteComment({ commentId: commentData._id, targetId }).unwrap();
      setIsDeleted(true);
      onCommentDeleted?.(commentData._id);
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
      syncSelf(res.data);
      toast.success(
        res.data.isHelpfulLead ? "Marked as helpful lead! 🎉" : "Unmarked",
        { id: toastId },
      );
    } catch {
      toast.error("Failed", { id: toastId });
    }
  };

  /* ---------- reply list local handlers ---------- */
  const handleNewReply = (newReply: TComment) => {
    setReplies((prev) => [...prev, newReply]);
    setReplyTotal((n) => n + 1);
    setShowReplies(true);
    setIsReplying(false);
  };
  const handleNestedUpdated = (u: TComment) =>
    setReplies((prev) => prev.map((r) => (r._id === u._id ? u : r)));
  const handleNestedDeleted = (id: string) => {
    setReplies((prev) => prev.filter((r) => r._id !== id));
    setReplyTotal((n) => Math.max(0, n - 1));
  };

  return (
    <div className={`relative ${depth > 0 ? "pl-9 mt-2" : "mt-3"}`}>
      {depth > 0 && <PawConnector />}

      <div className="flex">
        {/* Avatar */}
        <div className="relative shrink-0 mt-2 pe-1">
          <Avatar
            size="sm"
            name={commentData?.commenter?.name?.charAt(0).toUpperCase() || "U"}
            src={commentData?.commenter?.profilePhoto || undefined}
            classNames={{
              base: "bg-steel-blue/20 dark:bg-steel-blue/30 size-8 ring-2 ring-white dark:ring-zinc-900",
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

          {/* sighting location pill */}
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
              onSuccess={(updated) => {
                syncSelf(updated);
                setIsEditing(false);
              }}
            />
          ) : (
            <p className="mt-0.5 text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
              {commentData?.content}
            </p>
          )}

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
            <div className="flex flex-wrap items-center gap-1 mt-1.5">
              {/* vote pill */}
              <div className="flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800/60 p-0.5">
                <button
                  onClick={() => handleVote("upvote")}
                  disabled={isUpvoting}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-zinc-500 hover:text-steel-blue dark:hover:text-lime-burst text-[10px] font-semibold disabled:opacity-50"
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
                  onClick={() => handleVote("downvote")}
                  disabled={isDownvoting}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-zinc-500 hover:text-red-500 text-[10px] font-semibold disabled:opacity-50"
                >
                  {isDownvoting ? (
                    <div className="size-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                  ) : (
                    <ArrowDown className="size-3" />
                  )}
                  <span>{commentData?.downvotes}</span>
                </button>
              </div>

              {/* reply compose */}
              {canReply && (
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
              )}

              {/* show/hide replies toggle */}
              {replyTotal > 0 && (
                <button
                  onClick={() => setShowReplies((v) => !v)}
                  className={`group flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all border ${
                    showReplies
                      ? "bg-lime-burst/15 border-lime-burst/40 text-lime-700 dark:text-lime-burst"
                      : "bg-steel-blue/5 border-dashed border-steel-blue/30 dark:border-lime-burst/30 text-steel-blue dark:text-lime-burst hover:bg-steel-blue/10 dark:hover:bg-lime-burst/10"
                  }`}
                >
                  <PawPrint
                    className={`size-2.5 transition-transform ${
                      showReplies ? "rotate-12" : "-rotate-12"
                    } group-hover:scale-110`}
                    strokeWidth={2.5}
                  />
                  <span>
                    {replyTotal} {replyTotal === 1 ? "reply" : "replies"}
                  </span>
                  <ChevronDown
                    className={`size-2.5 transition-transform ${
                      showReplies ? "rotate-180" : "rotate-0"
                    }`}
                  />
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
                onSuccess={handleNewReply}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}

          {/* Reply thread */}
          {showReplies && (
            <div className="mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
              {isFetchingReplies && replies.length === 0 ? (
                <div className="flex items-center gap-2 pl-9 py-2 text-[10px] text-zinc-400">
                  <div className="size-3 animate-spin rounded-full border-2 border-steel-blue border-t-transparent dark:border-lime-burst" />
                  Fetching the pack...
                </div>
              ) : (
                <>
                  {replies.map((reply) => (
                    <CommentCard
                      key={reply._id}
                      comment={reply}
                      targetId={targetId}
                      targetType={targetType}
                      isPostOwner={isPostOwner}
                      depth={depth + 1}
                      onCommentUpdated={handleNestedUpdated}
                      onCommentDeleted={handleNestedDeleted}
                    />
                  ))}
                  {hasMoreReplies && (
                    <button
                      onClick={() => setReplyPage((p) => p + 1)}
                      disabled={isFetchingReplies}
                      className="ml-9 mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-steel-blue dark:text-lime-burst border border-dashed border-steel-blue/40 dark:border-lime-burst/40 hover:bg-steel-blue/5 dark:hover:bg-lime-burst/5"
                    >
                      <PawPrint className="size-2.5" strokeWidth={2.5} />
                      {isFetchingReplies ? "Loading..." : "More replies"}
                    </button>
                  )}
                </>
              )}
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
