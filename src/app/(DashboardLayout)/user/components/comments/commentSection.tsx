"use client";
import { useEffect, useState } from "react";
import { useGetCommentsByTargetQuery } from "@/src/redux/features/comments/commentsApi";
import { TTargetType } from "@/src/redux/features/comments/commentsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { TComment } from "@/src/types";
import AddCommentCard from "./addCommentCard";
import CommentList from "./commentList";

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
  // console.log(comments);
  useEffect(() => {
    if (!data?.data?.comments) return;
    if (page === 1) {
      setAllComments(comments);
    } else {
      setAllComments((prev) => {
        const existingIds = new Set(prev.map((c) => c._id));
        const newOnes = comments.filter(
          (c: TComment) => !existingIds.has(c._id),
        );
        return [...prev, ...newOnes];
      });
    }
  }, [data]);

  // console.log(allComments);

  const handleNewComment = (newComment: TComment) => {
    setAllComments((prev) => [newComment, ...prev]);
  };

  const handleCommentUpdated = (updated: TComment) => {
    setAllComments((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c)),
    );
  };

  const handleCommentDeleted = (commentId: string) => {
    setAllComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  return (
    <section className="w-full mt-4 space-y-3">
      <AddCommentCard
        targetType={targetType}
        targetId={targetId}
        onSuccess={handleNewComment}
      />
      <CommentList
        comments={allComments}
        targetId={targetId}
        targetType={targetType}
        isPostOwner={isPostOwner}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={() => setPage((p) => p + 1)}
        onCommentUpdated={handleCommentUpdated}
        onCommentDeleted={handleCommentDeleted}
      />
    </section>
  );
};

export default CommentSection;
