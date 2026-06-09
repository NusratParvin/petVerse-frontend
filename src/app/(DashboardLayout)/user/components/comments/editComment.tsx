"use client";
import { useForm } from "react-hook-form";
import { Button, Textarea } from "@heroui/react";
import { Check, X } from "lucide-react";

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

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data.content))}
      className="space-y-2 pl-8"
    >
      <Textarea
        {...register("content", { required: true })}
        minRows={2}
        autoFocus
        classNames={{
          input: "text-sm text-zinc-800 dark:text-zinc-200",
          inputWrapper:
            "bg-white dark:bg-zinc-800 border border-steel-blue/50 dark:border-lime-burst/50",
        }}
      />
      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          className="bg-steel-blue dark:bg-lime-burst text-white dark:text-zinc-900 text-xs font-semibold"
          startContent={<Check className="size-3" />}
        >
          Save
        </Button>
        <Button
          size="sm"
          variant="light"
          onPress={onCancel}
          className="text-zinc-500 text-xs"
          startContent={<X className="size-3" />}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditComment;
