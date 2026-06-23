import { Chip } from "@heroui/react";

export const StatusChip = ({
  status,
  type,
}: {
  status: string;
  type: string;
}) => {
  if (status === "resolved") {
    return (
      <Chip
        size="sm"
        classNames={{
          base: "bg-emerald-500/10",
          content:
            "text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]",
        }}
      >
        Resolved
      </Chip>
    );
  }
  return type === "lost" ? (
    <Chip
      size="sm"
      classNames={{
        base: "bg-red-500/10",
        content: "text-red-500 font-semibold text-[11px]",
      }}
    >
      Missing
    </Chip>
  ) : (
    <Chip
      size="sm"
      classNames={{
        base: "bg-amber-500/10",
        content: "text-amber-600 font-semibold text-[11px]",
      }}
    >
      Found
    </Chip>
  );
};
