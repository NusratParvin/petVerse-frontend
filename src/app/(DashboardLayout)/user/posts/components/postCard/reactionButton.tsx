"use client";

import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { REACTIONS } from "./constants";

export function ReactionButton({
  post,
  onReact,
}: {
  post: any;
  onReact: (postId: string, key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const mine = REACTIONS.find((r) => r.key === post.myReaction);

  const pick = (key: string) => {
    onReact(post._id, key);
    setOpen(false);
  };

  return (
    <Popover
      placement="left"
      showArrow={false}
      offset={10}
      isOpen={open}
      onOpenChange={setOpen}
      classNames={{
        base: "rounded-full border border-zinc-200 bg-white p-0 shadow-lg dark:border-white/10 dark:bg-zinc-900",
        content: "p-1",
      }}
    >
      <PopoverTrigger>
        <button
          type="button"
          aria-expanded={open}
          className={`relative z-10 flex h-7 min-w-[5.25rem] items-center justify-center gap-1 rounded-md px-2.5 text-[10.5px] font-extrabold uppercase tracking-wide shadow-sm transition-all active:scale-95 ${
            mine
              ? "bg-steel-blue text-white dark:bg-lime-burst dark:text-zinc-900"
              : "border border-steel-blue/25 bg-steel-blue/10 text-steel-blue dark:border-lime-burst/25 dark:bg-lime-burst/10 dark:text-lime-burst"
          }`}
        >
          <span className="text-sm leading-none">{mine?.emoji ?? "🐾"}</span>
          <span>{mine ? `${mine.label}!` : "React"}</span>
          <ChevronDown
            size={11}
            className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent>
        <div
          role="group"
          aria-label="Reactions"
          className="flex items-center gap-0.5"
        >
          {REACTIONS.map((reaction) => (
            <button
              key={reaction.key}
              type="button"
              title={reaction.label}
              aria-label={`React with ${reaction.label}`}
              onClick={() => pick(reaction.key)}
              className={`grid size-8 place-items-center rounded-full text-lg leading-none transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-steel-blue dark:focus:ring-lime-burst ${
                post.myReaction === reaction.key
                  ? "bg-steel-blue/15 dark:bg-lime-burst/15"
                  : "hover:bg-zinc-100 dark:hover:bg-white/[0.06]"
              }`}
            >
              {reaction.emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
