"use client";

import { useState } from "react";
import {
  Avatar,
  Card,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import {
  ChevronDown,
  MessageCircle,
  MoreHorizontal,
  PawPrint,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import SharePopover from "./SharePopover";

const REACTIONS = [
  { key: "like", emoji: "🐾", label: "Paw" },
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "haha", emoji: "😂", label: "Zoomies" },
  { key: "wow", emoji: "😮", label: "Woow" },
  { key: "sad", emoji: "😢", label: "Aww" },
  { key: "angry", emoji: "😠", label: "Grr" },
] as const;

const MILESTONE_LABELS = {
  adoption: "🏠 Adoption",
  birthday: "🎂 Birthday",
  "vet-visit": "🩺 Vet visit",
  health: "💊 Health",
  other: "✨ Milestone",
};

const MILESTONE_EMOJI = {
  adoption: "🏠",
  birthday: "🎂",
  "vet-visit": "🩺",
  health: "💊",
  other: "✨",
};

const timeAgo = (date: string) =>
  `${formatDistanceToNow(new Date(date), { includeSeconds: true })} ago`;

const PostHeader = ({ post }: { post: any }) => {
  const pet = post.petId;
  const owner = post.authorId;
  const petPhoto =
    pet?.profilePhoto ||
    post.media?.find((item: any) => item.type === "image")?.url;

  return (
    <header className="flex items-start gap-2.5 px-2.5 pt-3">
      <div className="group/avatar relative shrink-0 pb-0.5 pr-1">
        <Avatar
          src={owner?.profilePhoto}
          name={owner?.name?.charAt(0)?.toUpperCase() ?? "U"}
          className="size-8 rotate-2 rounded-md ring-1 ring-zinc-200/70 shadow-sm transition-transform duration-300 group-hover/avatar:rotate-0 dark:ring-white/10"
        />
        {pet && (
          <span className="absolute -bottom-2.5 -right-1.5 grid size-[28px] -rotate-6 place-items-center overflow-hidden rounded-md border-2 border-white bg-lime-burst/70 text-steel-blue shadow-sm transition-transform duration-300 group-hover/avatar:rotate-0 dark:border-zinc-900 dark:bg-lime-burst/70 dark:text-black/80">
            {petPhoto ? (
              <img
                src={petPhoto}
                alt={pet.name ?? "Pet"}
                className="size-full object-cover"
              />
            ) : (
              <PawPrint size={13} strokeWidth={2.5} />
            )}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 ">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="  text-[13px] font-bold leading-tight tracking-normal text-zinc-700 dark:text-zinc-100/80">
            {owner?.name ?? "Pet lover"}
          </span>
          {pet && (
            <>
              <span
                aria-hidden
                className="shrink-0 text-zinc-400/60 dark:text-zinc-500/60"
              >
                ·
              </span>
              <span className="truncate text-[11px] font-bold text-steel-blue dark:text-lime-burst">
                {pet.name ?? "pet"}
              </span>
            </>
          )}
        </div>
        <div className=" flex min-w-0 items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-wider text-zinc-400/80 dark:text-zinc-500/80">
          <span>{pet ? "Pet moment" : "Community"}</span>
          <span aria-hidden className="opacity-50">
            ·
          </span>
          <time className="shrink-0" dateTime={post.createdAt}>
            {timeAgo(post.createdAt)}
          </time>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 pt-0.5">
        {post.isMilestone && (
          <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-[3px] text-[9px] font-extrabold uppercase tracking-wide text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300 sm:px-2">
            <span className="sm:hidden">
              {MILESTONE_EMOJI[post.milestoneCategory] ?? "✨"}
            </span>
            <span className="hidden sm:inline">
              {MILESTONE_LABELS[post.milestoneCategory] ?? "✨ Milestone"}
            </span>
          </span>
        )}

        {/* <button
          type="button"
          aria-label="Post options"
          className="grid size-7 shrink-0 place-items-center rounded-full text-zinc-400/80 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500/80 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200"
        >
          <MoreHorizontal size={15} />
          xdx
        </button> */}
      </div>
    </header>
  );
};

const MediaGrid = ({
  media,
  petName,
}: {
  media: { url: string; type: string }[];
  petName?: string;
}) => {
  if (!media?.length) return null;

  const count = Math.min(media.length, 4);
  const itemClass = (index: number) => {
    if (count === 1) return "max-h-[300px] aspect-[16/10] sm:aspect-[16/5]";
    if (count === 2) return "max-h-[320px] aspect-[4/2]";
    if (count === 3 && index === 0) return "col-span-2 aspect-[2/1]";
    return "aspect-square";
  };

  return (
    <div
      className={`grid overflow-hidden rounded-md border-none bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] ${
        count === 1 ? "grid-cols-1" : "grid-cols-2"
      }`}
    >
      {media.slice(0, 4).map((item, index) => {
        const classes = `h-full w-full object-cover ${itemClass(index)}`;
        return (
          <div
            key={`${item.url}-${index}`}
            className="relative overflow-hidden border border-white/70 dark:border-zinc-900/70"
          >
            {item.type === "video" ? (
              <video
                src={item.url}
                controls
                playsInline
                preload="metadata"
                className={classes}
              />
            ) : (
              <img
                src={item.url}
                alt={`${petName ?? "Pet"} post ${index + 1}`}
                loading="lazy"
                className={classes}
              />
            )}
            {index === 3 && media.length > 4 && (
              <span className="absolute inset-0 grid place-items-center bg-zinc-900/55 text-lg font-extrabold text-white">
                +{media.length - 4}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

const SharedContentPreview = ({ post }: { post: any }) => {
  const original = post.refId;

  if (!original) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 p-3 text-center text-[11px] text-zinc-400 dark:border-white/10 dark:text-zinc-500">
        This content is no longer available.
      </div>
    );
  }

  if (post.refType === "Article") {
    return (
      <Link
        href={`/articles/${original._id}`}
        className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-steel-blue dark:focus:ring-lime-burst"
      >
        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2.5 rounded-lg border border-zinc-200/70 bg-zinc-50/60 p-2 transition-colors hover:border-steel-blue/45 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-lime-burst/40">
          {original.images && (
            <img
              src={original.images}
              alt=""
              className="size-[4.5rem] rounded-md object-cover"
            />
          )}
          <div className="min-w-0 self-center">
            <span className="text-[9px] font-extrabold uppercase tracking-wide text-steel-blue dark:text-lime-burst">
              {original.category}
            </span>
            <p className="truncate text-[12px] font-bold text-zinc-900 dark:text-zinc-100">
              {original.title}
            </p>
            <p className="line-clamp-2 text-[10.5px] text-zinc-500 dark:text-zinc-400">
              {original.content}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="space-y-2 rounded-md border-none shadow-sm bg-zinc-50/60 p-2.5 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex min-w-0 items-center gap-1.5">
        <Avatar
          src={original.authorId?.profilePhoto}
          name={original.authorId?.name?.charAt(0) ?? "U"}
          className="size-5 shrink-0"
        />
        <span className="truncate text-[11px] font-bold text-zinc-900 dark:text-zinc-100">
          {original.authorId?.name}
        </span>
      </div>
      {original.caption && (
        <p className="line-clamp-3 text-[11px] text-zinc-500 dark:text-zinc-400">
          {original.caption}
        </p>
      )}
      <MediaGrid media={original.media} petName={original.petId?.name} />
    </div>
  );
};

export default function PostCard({
  post,
  onReact,
  onComment,
}: {
  post: any;
  onReact: (postId: string, reaction: string) => void;
  onComment: (postId: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const totalReactions = REACTIONS.reduce(
    (sum, reaction) => sum + (post.reactionSummary?.[reaction.key] ?? 0),
    0,
  );
  const topReactions = REACTIONS.filter(
    (reaction) => (post.reactionSummary?.[reaction.key] ?? 0) > 0,
  ).slice(0, 3);
  const isShare = post.type === "shared_article" || post.type === "shared_post";
  const mine = REACTIONS.find((reaction) => reaction.key === post.myReaction);

  const pick = (key: string) => {
    onReact(post._id, key);
    setPickerOpen(false);
  };

  return (
    <Card
      radius="none"
      shadow="none"
      className="relative w-full max-w-[760px] overflow-visible rounded-md border-none shadow-md bg-white p-0 text-zinc-900   dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-100"
    >
      <PostHeader post={post} />

      <div className="space-y-0   pb-1.5 px-2.5 pt-3">
        {post.caption && (
          <p className="whitespace-pre-wrap break-words text-[11px] leading-[1.55] text-zinc-800 dark:text-zinc-100 sm:text-[11.5px] pb-1">
            {post.caption}
          </p>
        )}

        {isShare ? (
          <SharedContentPreview post={post} />
        ) : (
          <MediaGrid media={post.media} petName={post.petId?.name} />
        )}
      </div>

      <footer className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-zinc-100 bg-zinc-50/60 px-2.5 py-1.5 dark:border-white/[0.06] dark:bg-white/[0.02] sm:px-4">
        <div className="flex min-w-0 items-center gap-0.5 sm:gap-1">
          {/* reaction stack */}
          {totalReactions > 0 && (
            <div className="flex min-w-0 items-center pl-0.5">
              <div className="flex shrink-0 -space-x-2">
                {topReactions.map((reaction) => (
                  <span
                    key={reaction.key}
                    title={reaction.label}
                    className="grid size-[22px] place-items-center rounded-full bg-white text-[11px] leading-none shadow-sm ring-1 ring-zinc-200/70 dark:bg-zinc-900 dark:ring-white/10"
                  >
                    {reaction.emoji}
                  </span>
                ))}
              </div>
              <span className="ml-1.5 truncate text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                {totalReactions}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => onComment(post._id)}
            aria-label={`Open ${post.commentCount ?? 0} comments`}
            className="flex h-7 shrink-0 items-center gap-1 rounded-lg px-1.5 text-[11px] font-bold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-steel-blue dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-lime-burst"
          >
            <MessageCircle size={14} />
            <span>{post.commentCount ?? 0}</span>
          </button>

          <div
            className="grid size-7 shrink-0 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200"
            title="Share post"
          >
            <span className="sr-only">Share post</span>
            <SharePopover post={post} />
          </div>
        </div>

        {/* ---------- HeroUI Popover, placed to the LEFT ---------- */}
        <Popover
          placement="left"
          showArrow={false}
          offset={10}
          isOpen={pickerOpen}
          onOpenChange={setPickerOpen}
          classNames={{
            base: "rounded-full border border-zinc-200 bg-white p-0 shadow-lg dark:border-white/10 dark:bg-zinc-900",
            content: "p-1",
          }}
        >
          <PopoverTrigger>
            <button
              type="button"
              aria-expanded={pickerOpen}
              className={`relative z-10 flex h-7 min-w-[5.25rem] items-center justify-center gap-1 rounded-lg px-2.5 text-[10.5px] font-extrabold uppercase tracking-wide shadow-sm transition-all active:scale-95 ${
                mine
                  ? "bg-steel-blue text-white dark:bg-lime-burst dark:text-zinc-900"
                  : "border border-steel-blue/25 bg-steel-blue/10 text-steel-blue dark:border-lime-burst/25 dark:bg-lime-burst/10 dark:text-lime-burst"
              }`}
            >
              <span className="text-sm leading-none">
                {mine?.emoji ?? "🐾"}
              </span>
              <span>{mine ? `${mine.label}!` : "React"}</span>
              <ChevronDown
                size={11}
                className={`transition-transform duration-200 ${
                  pickerOpen ? "rotate-90" : ""
                }`}
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
      </footer>
    </Card>
  );
}
