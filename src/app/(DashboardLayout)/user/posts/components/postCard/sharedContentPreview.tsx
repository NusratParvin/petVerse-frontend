"use client";
import Link from "next/link";
import { Avatar } from "@heroui/react";
import { ExternalLink } from "lucide-react";
import { stripHtml, timeAgo } from "./utils";
import { MediaGrid } from "./MediaGrid";

type TMediaItem = { url: string; type: "image" | "video" };

export function SharedContentPreview({
  post,
  onMediaOpen,
  linkToOriginal = false,
}: {
  post: any;
  onMediaOpen?: (m: TMediaItem) => void;
  linkToOriginal?: boolean;
}) {
  const original = post.refId;

  if (!original || typeof original === "string") {
    return (
      <div className="rounded-md border border-dashed border-zinc-200 p-3 text-center text-[11px] text-zinc-400 dark:border-white/10 dark:text-zinc-500">
        This content is no longer available.
      </div>
    );
  }

  const originalAuthor =
    original.authorId && typeof original.authorId === "object"
      ? original.authorId
      : null;
  const originalPet =
    original.petId && typeof original.petId === "object"
      ? original.petId
      : null;

  /* ---------- article ---------- */
  if (post.refType === "Article") {
    const body = (
      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2.5 rounded-md border border-zinc-200/70 bg-zinc-50/60 p-2 transition-colors hover:border-steel-blue/45 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-lime-burst/40">
        {original.images && (
          <img
            src={original.images}
            alt=""
            className="size-[4.5rem] rounded-md object-cover"
          />
        )}
        <div className="min-w-0 self-center">
          <span className="text-[9px] font-extrabold uppercase tracking-wide text-steel-blue dark:text-lime-burst">
            {original.category ?? "Article"}
          </span>
          <p className="truncate text-[12px] font-bold text-zinc-900 dark:text-zinc-100">
            {original.title}
          </p>
          <p className="line-clamp-2 text-[10.5px] text-zinc-500 dark:text-zinc-400">
            {stripHtml(original.content)}
          </p>
        </div>
      </div>
    );

    return linkToOriginal ? (
      <Link href={`/articles/${original._id}`} className="block rounded-md">
        {body}
      </Link>
    ) : (
      body
    );
  }

  /* ---------- post ---------- */
  const body = (
    <div className="overflow-hidden rounded-md border border-zinc-200/70 bg-zinc-50/60 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center gap-1.5 px-2.5 pt-2.5 text-[11px]">
        <Avatar
          src={originalAuthor?.profilePhoto}
          name={originalAuthor?.name?.charAt(0)?.toUpperCase() ?? "?"}
          className="size-5 shrink-0"
        />
        <span className="truncate font-bold text-zinc-800 dark:text-zinc-100">
          {originalAuthor?.name ?? "Original poster"}
        </span>
        {originalPet && (
          <>
            <span className="text-zinc-400/60">·</span>
            <span className="truncate font-bold text-steel-blue dark:text-lime-burst">
              {originalPet.name}
            </span>
          </>
        )}
        <span className="ml-auto text-[10px] text-zinc-400">
          {timeAgo(original.createdAt)}
        </span>
        {linkToOriginal && (
          <ExternalLink
            size={12}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          />
        )}
      </div>

      {original.caption && (
        <p className="line-clamp-3 px-2.5 pt-1.5 text-[11.5px] leading-[1.55] text-zinc-700 dark:text-zinc-200">
          {original.caption}
        </p>
      )}

      {original.media?.length > 0 && (
        <div className="p-2.5 pt-2">
          <MediaGrid
            media={original.media}
            petName={originalPet?.name}
            onOpen={onMediaOpen}
          />
        </div>
      )}
    </div>
  );

  return linkToOriginal ? (
    <Link href={`/user/posts/${original._id}`} className="group block">
      {body}
    </Link>
  ) : (
    body
  );
}
