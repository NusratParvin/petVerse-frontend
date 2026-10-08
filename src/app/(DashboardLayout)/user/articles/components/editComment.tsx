"use client";
import { useForm } from "react-hook-form";
import { Input, Button } from "@heroui/react";

const EditComment = ({
  comment,
  onCancel,
  onSubmit,
}: {
  comment: string;
  onCancel: () => void;
  onSubmit: (content: string) => void;
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: { content: comment },
  });

  const handleFormSubmit = (data: { content: string }) => {
    onSubmit(data.content);
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        {...register("content", { required: "Comment is required" })}
        fullWidth
        isClearable
        placeholder="Edit your comment..."
        variant="flat"
      />
      <div className="flex space-x-2">
        <Button
          className="bg-customBlue text-white"
          size="sm"
          type="submit"
          variant="shadow"
        >
          Post
        </Button>
        <Button color="danger" size="sm" variant="shadow" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditComment;
