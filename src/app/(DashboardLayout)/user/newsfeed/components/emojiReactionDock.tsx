"use client";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { Smile } from "lucide-react";
import { REACTION_TYPE } from "@/src/types";

const REACTIONS: { key: REACTION_TYPE; emoji: string; label: string }[] = [
  { key: "like", emoji: "👍", label: "Like" },
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "haha", emoji: "😆", label: "Haha" },
  { key: "wow", emoji: "😮", label: "Wow" },
  { key: "sad", emoji: "😢", label: "Sad" },
  { key: "angry", emoji: "😡", label: "Angry" },
];

export default function EmojiReactionDock({
  reactionSummary,
  onReact,
}: {
  reactionSummary: Record<string, number>;
  onReact: (reaction: REACTION_TYPE) => void;
}) {
  return (
    <Popover placement="top">
      <PopoverTrigger>
        <Button
          isIconOnly
          aria-label="React"
          className="size-7 min-w-0"
          radius="full"
          size="sm"
          variant="light"
        >
          <Smile className="text-zinc-500" size={15} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-row gap-1 p-2">
        {REACTIONS.map((r) => (
          <Button
            key={r.key}
            isIconOnly
            aria-label={r.label}
            className="text-xl"
            radius="full"
            size="sm"
            title={`${r.label} · ${reactionSummary[r.key] ?? 0}`}
            variant="light"
            onPress={() => onReact(r.key)}
          >
            {r.emoji}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
