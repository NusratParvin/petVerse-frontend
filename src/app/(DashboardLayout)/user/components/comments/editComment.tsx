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
      className="space-y-1.5 rounded-md p-[1.5px] bg-gradient-to-br from-steel-blue/50 via-lime-burst/30 to-steel-blue/50 dark:from-lime-burst/50 dark:via-steel-blue/30 dark:to-lime-burst/50"
    >
      <div className="bg-white dark:bg-zinc-900 rounded-[10px] p-1.5 space-y-1.5">
        <Textarea
          {...register("content", { required: true })}
          minRows={2}
          autoFocus
          classNames={{
            input: "text-[11px] text-zinc-800 dark:text-zinc-200",
            inputWrapper:
              "bg-zinc-50 dark:bg-zinc-800/60 focus:!outline-none focus:!ring-0 focus:!ring-transparent !rounded-md border border-zinc-200 dark:border-zinc-700",
            innerWrapper: "focus:outline-none",
          }}
        />
        <div className="flex gap-1.5 justify-end">
          <Button
            size="sm"
            variant="light"
            onPress={onCancel}
            className="text-zinc-500 text-[10px] h-7 min-w-0 px-2 rounded-md"
            startContent={<X className="size-3" />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="bg-gradient-to-r from-steel-blue to-steel-blue/90 dark:from-lime-burst dark:to-lime-burst/90 text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-wide h-7 min-w-0 px-3 rounded-md shadow-sm"
            startContent={<Check className="size-3" />}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditComment;
