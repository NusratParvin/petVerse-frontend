"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Textarea,
  Button,
} from "@heroui/react";
import { Share2, Send } from "lucide-react";
import { useSharePostMutation } from "@/src/redux/features/posts/postsApi";
import { toast } from "sonner";

const MAX_LEN = 280;

export default function SharePopover({
  refId,
  refType,
  shareCount = 0,
}: {
  refId: string;
  refType: "Post" | "Article";
  shareCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [sharePost, { isLoading }] = useSharePostMutation();

  const remaining = MAX_LEN - caption.length;
  const atLimit = caption.length >= MAX_LEN;

  const handleChange = (value: string) => {
    if (value.length > MAX_LEN) {
      setCaption(value.slice(0, MAX_LEN));
      return;
    }
    setCaption(value);
  };

  const handleShare = async () => {
    try {
      await sharePost({
        refId,
        refType,
        caption: caption.trim() || undefined,
      }).unwrap();
      toast.success("Shared! 🐾");
      setCaption("");
      setOpen(false);
    } catch (err) {
      toast.error("Couldn't share — try again.");
      console.log(err);
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setCaption("");
  };

  return (
    <Popover
      isOpen={open}
      onOpenChange={handleOpenChange}
      placement="right-end"
      offset={0}
      showArrow={false}
      backdrop="blur"
      classNames={{
        base: "w-[34rem] max-w-[92vw] rounded-md border-none bg-white/95 p-0 shadow-2xl backdrop-blur-xl   dark:bg-zinc-900/95",
        content: "p-0",
        backdrop: "bg-black/20 backdrop-blur-sm dark:bg-black/50",
      }}
    >
      <PopoverTrigger>
        <button
          type="button"
          aria-label="Share post"
          className="flex h-7 shrink-0 items-center gap-1 rounded-md px-1.5 text-[11px] font-bold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-steel-blue dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-lime-burst"
        >
          <Share2 size={14} />
          {shareCount > 0 && <span>{shareCount}</span>}
        </button>
      </PopoverTrigger>

      <PopoverContent>
        <div className="w-full p-3">
          {/* header */}
          <div className="mb-3 flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-full bg-steel-blue/12 text-steel-blue dark:bg-lime-burst/15 dark:text-lime-burst">
              <Share2 size={13} />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-bold tracking-normal text-zinc-900 dark:text-zinc-100/80">
                Share this {refType === "Article" ? "article" : "post"}
              </p>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                Add a thought — or just shoot it 🚀
              </p>
            </div>
          </div>

          {/* textarea  */}
          <Textarea
            value={caption}
            onValueChange={handleChange}
            placeholder="Say something nice…"
            minRows={4}
            maxRows={6}
            maxLength={MAX_LEN}
            variant="flat"
            classNames={{
              inputWrapper:
                "!min-h-0 !rounded-md !px-3 !py-2 !shadow-none !ring-0 !ring-offset-0 !outline-none border-0 " +
                "!bg-zinc-100/80 data-[hover=true]:!bg-zinc-100/80 group-data-[focus=true]:!bg-zinc-100/80 " +
                "group-data-[focus=true]:!ring-0 group-data-[focus=true]:!outline-none " +
                "dark:!bg-white/[0.05] dark:data-[hover=true]:!bg-white/[0.05] dark:group-data-[focus=true]:!bg-white/[0.05]",
              input:
                "!py-0 !outline-none !ring-0 focus:!outline-none focus:!ring-0 " +
                "text-[12px] leading-[1.55] text-zinc-800 dark:text-zinc-100 " +
                "placeholder:text-zinc-400 placeholder:italic dark:placeholder:text-zinc-500",
            }}
          />

          {/* actions */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                atLimit
                  ? "text-rose-500 dark:text-rose-400"
                  : remaining <= 40
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {caption.length}/{MAX_LEN}
            </span>
            <Button
              size="sm"
              isDisabled={isLoading}
              isLoading={isLoading}
              onPress={handleShare}
              startContent={
                !isLoading ? <Send size={12} className="shrink-0" /> : undefined
              }
              className="h-7 min-w-0 !rounded-md px-3.5 text-[10.5px] font-bold uppercase tracking-wide shadow-sm bg-steel-blue text-white dark:bg-lime-burst dark:text-zinc-900"
            >
              Share
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
