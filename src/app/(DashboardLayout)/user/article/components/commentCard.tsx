"use client";
import { useState } from "react";
import { Card, CardBody, Avatar, Button } from "@heroui/react";
import { ArrowUp, ArrowDown, Pen, X } from "lucide-react";
import { toast } from "sonner";

import EditComment from "./editComment";

import {
  useVoteCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "@/src/redux/features/comments/commentsApi";
import { TComment } from "@/src/types";

const CommentCard = ({
  comment,
  articleId,
}: {
  comment: TComment;
  articleId: string;
}) => {
  const [voteComment] = useVoteCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();

  const [commentData, setCommentData] = useState<TComment | null>(comment);
  const [isEditing, setIsEditing] = useState(false);

  if (!commentData) return null;

  const handleUpvote = async () => {
    const toastId = toast("Upvoting comment...");

    try {
      const res = await voteComment({
        commentId: commentData._id,
        voteType: "upvote",
      }).unwrap();

      setCommentData(res.data);
      toast.success("Upvoted successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to upvote comment.", { id: toastId });
      console.error("Failed to upvote comment:", error);
    }
  };

  const handleDownvote = async () => {
    const toastId = toast("Downvoting comment...");

    try {
      const res = await voteComment({
        commentId: commentData._id,
        voteType: "downvote",
      }).unwrap();

      setCommentData(res.data);
      toast.success("Downvoted successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to downvote comment.", { id: toastId });
      console.error("Failed to downvote comment:", error);
    }
  };

  const handleDeleteComment = async () => {
    const toastId = toast("Deleting comment...");

    // console.log(articleId);
    try {
      await deleteComment({
        commentId: commentData._id,
        articleId,
      }).unwrap();
      setCommentData(null);
      toast.success("Comment deleted successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to delete comment.", { id: toastId });
      console.error("Failed to delete comment:", error);
    }
  };

  const handleUpdateComment = async (newContent: string) => {
    const toastId = toast("Updating...");

    try {
      const res = await updateComment({
        commentId: commentData._id,
        content: newContent,
      }).unwrap();

      setCommentData(res.data);
      setIsEditing(false);
      toast.success("Comment updated successfully!", {
        id: toastId,
        className: "text-green-500",
      });
    } catch (error) {
      toast.error("Failed to update comment.", {
        id: toastId,
        className: "text-red-500",
      });
      console.error("Failed to update comment:", error);
    }
  };

  if (!commentData) return null;

  return (
    <Card className="max-w-full shadow-sm mx-auto bg-white text-gray-700 my-4">
      <CardBody className="p-2">
        <div className="flex items-start space-x-2 relative">
          <div className="flex flex-col items-center">
            <Avatar
              className="bg-orange-500 text-white w-7 h-7 z-10"
              fallback={commentData?.commenter?.name?.charAt(0) || "U"}
              size="sm"
              src={commentData?.commenter?.profilePhoto || "/fallback.svg"}
            />
          </div>
          <div className="flex-grow pt-1">
            <div className="flex items-center justify-between space-x-2 mb-1">
              <div>
                <span className="font-medium text-sm">
                  {commentData?.commenter?.name || "Anonymous"}
                </span>
                <span className="text-xs text-gray-500">
                  • {new Date(commentData?.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex gap-4">
                {!isEditing && (
                  <>
                    <Pen
                      className="text-blue-500 cursor-pointer"
                      size={12}
                      onClick={() => setIsEditing(true)}
                    />
                    <X
                      className="text-red-500 cursor-pointer"
                      size={12}
                      onClick={handleDeleteComment}
                    />
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <EditComment
                comment={commentData.content}
                onCancel={() => setIsEditing(false)}
                onSubmit={handleUpdateComment}
              />
            ) : (
              <p className="text-sm mb-2">{commentData?.content}</p>
            )}

            <div className="flex items-center space-x-1 text-gray-500 text-xs">
              <Button
                isIconOnly
                className="min-w-unit-6 h-unit-6"
                size="sm"
                variant="light"
                onClick={handleUpvote}
              >
                <ArrowUp size={16} />
              </Button>
              <span className="font-medium">{commentData?.upvotes}</span>
              <Button
                isIconOnly
                className="min-w-unit-6 h-unit-6"
                size="sm"
                variant="light"
                onClick={handleDownvote}
              >
                <ArrowDown size={16} />
              </Button>
              <span className="font-medium">{commentData?.downvotes}</span>
              <Button
                className="text-xs min-w-unit-6 h-unit-6"
                size="sm"
                variant="light"
              >
                Reply
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CommentCard;
