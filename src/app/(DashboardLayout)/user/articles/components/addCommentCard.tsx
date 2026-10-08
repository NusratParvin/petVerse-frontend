"use client";
import { useForm } from "react-hook-form";
import { Button, Avatar, Card, CardBody, Input } from "@heroui/react";
import { toast } from "sonner";

import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAddCommentMutation } from "@/src/redux/features/comments/commentsApi";

type FormData = {
  content: string;
};

const AddCommentCard = ({ articleId }: { articleId: string }) => {
  const user = useAppSelector(useCurrentUser);
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [addComment] = useAddCommentMutation();

  const onSubmit = async (data: FormData) => {
    const commentData = {
      articleId,
      content: data.content,
      commenter: {
        commenterId: user?._id,
        name: user?.name,
        profilePhoto: user?.profilePhoto || "",
      },
    };

    const toastId = toast("Posting...", {
      duration: 4000,
    });

    try {
      const response = await addComment(commentData).unwrap();

      reset();

      toast.success("Comment added successfully!", {
        id: toastId,
        className: "text-green-500",
      });
    } catch (error) {
      toast.error("Failed to add comment. Please try again.", {
        id: toastId,
        className: "text-red-500",
      });
      console.error("Error adding comment:", error);
    }
  };

  const onCancel = () => {
    reset();
  };

  return (
    <Card
      className="max-w-full mx-auto bg-white shadow-sm text-gray-700 my-4"
      radius="none"
    >
      <CardBody className="p-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center space-x-2">
            <Avatar
              className="bg-orange-500 text-white w-7 h-7"
              fallback={user?.name?.charAt(0) || "U"}
              size="sm"
              src={user?.profilePhoto || "/fallback.svg"}
            />

            <div className="flex-grow">
              <Input
                {...register("content", { required: "Comment is required" })}
                fullWidth
                isClearable
                placeholder="Write your comment..."
                variant="flat"
              />
            </div>

            <div className="flex space-x-2 items-center">
              <Button
                className="bg-customBlue text-white"
                size="sm"
                type="submit"
                variant="shadow"
              >
                Post
              </Button>
              <Button
                color="danger"
                size="sm"
                variant="shadow"
                onPress={onCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default AddCommentCard;
