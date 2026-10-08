"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowBigLeft, ArrowLeft, MessageCircle } from "lucide-react";
import { Button, Card, Skeleton } from "@heroui/react";
import CommentSection from "../../components/comments/commentSection";
import { useGetPostByIdQuery } from "@/src/redux/features/posts/postsApi";
import { usePostReactions } from "../../hooks/usePostReactions";
import SharePopover from "../components/SharePopover";
import { REACTIONS } from "../components/postCard/constants";
import { PostHeader } from "../components/postCard/postHeader";
import { SharedContentPreview } from "../components/postCard/sharedContentPreview";
import { ReactionButton } from "../components/postCard/reactionButton";
import { MediaGrid } from "../components/postCard/mediaGridFiles";
import Link from "next/link";

type TMediaItem = { url: string; type: "image" | "video" };

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetPostByIdQuery(id);
  const [lightbox, setLightbox] = useState<TMediaItem | null>(null);
  const { handleReact } = usePostReactions();

  const post = data?.data;

  /* loading */
  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-full px-2 py-3 sm:px-3 sm:py-4">
        <div className="space-y-3 rounded-md bg-white p-3 shadow-md dark:bg-zinc-900/70">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-32 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      </main>
    );
  }

  /* not found / deleted */
  if (isError || !post || post.isDeleted) {
    return (
      <main className="mx-auto w-full max-w-full px-3 py-6">
        <div className="rounded-md border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
          This post is no longer available.
        </div>
      </main>
    );
  }

  const isShare = post.type === "shared_post" || post.type === "shared_article";
  const totalReactions = REACTIONS.reduce(
    (sum, r) => sum + (post.reactionSummary?.[r.key] ?? 0),
    0,
  );
  const topReactions = REACTIONS.filter(
    (r) => (post.reactionSummary?.[r.key] ?? 0) > 0,
  ).slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-full p-0 px-2">
      <div className="space-y-3">
        {/* POST CARD */}
        <Card
          radius="none"
          shadow="none"
          className="relative w-full max-w-full overflow-visible rounded-md border-none bg-white p-0 text-zinc-900 shadow-md dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-100"
        >
          <PostHeader post={post} />

          <Link
            href={`/user/posts`}
            className="absolute right-3 flex justify-end top-3   w-full  "
          >
            <ArrowLeft size={14} strokeWidth={1} />
          </Link>

          <div className="space-y-0 px-2.5 pb-1.5 pt-3">
            {post.caption && (
              <p className="whitespace-pre-wrap break-words pb-1 text-[11.5px] leading-[1.55] text-zinc-800 dark:text-zinc-100 sm:text-[12px]">
                {post.caption}
              </p>
            )}

            {isShare ? (
              <SharedContentPreview
                post={post}
                onMediaOpen={setLightbox}
                linkToOriginal
              />
            ) : (
              <MediaGrid
                media={post.media}
                petName={post.petId?.name}
                onOpen={setLightbox}
              />
            )}
          </div>

          <footer className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-zinc-100 bg-zinc-50/60 px-2.5 py-1.5 dark:border-white/[0.06] dark:bg-white/[0.02] sm:px-4">
            <div className="flex min-w-0 items-center gap-0.5 sm:gap-1">
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

              <Button
                as="a"
                href="#comments"
                variant="light"
                size="sm"
                aria-label={`Open ${post.commentCount ?? 0} comments`}
                className="h-7 min-w-0 shrink-0 gap-1 rounded-md px-1.5 text-[11px] font-bold text-zinc-500 hover:bg-zinc-100 hover:text-steel-blue dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-lime-burst"
              >
                <MessageCircle size={14} />
                <span>{post.commentCount ?? 0}</span>
              </Button>

              <div className="grid size-7 shrink-0 place-items-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200">
                <span className="sr-only">Share post</span>
                <SharePopover
                  refId={post._id}
                  refType="Post"
                  shareCount={post.shareCount}
                />
              </div>
            </div>

            <ReactionButton post={post} onReact={handleReact} />
          </footer>
        </Card>

        {/* COMMENTS */}
        <section
          id="comments"
          className="rounded-md bg-white p-3 shadow-md dark:border-white/10 dark:bg-zinc-900/70 sm:p-4"
        >
          <h2 className="mb-3 flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-100">
            Comments
            <span className="rounded-full bg-steel-blue/10 px-2 py-0.5 text-[10px] font-bold normal-case text-steel-blue dark:bg-lime-burst/10 dark:text-lime-burst">
              {post.commentCount ?? 0}
            </span>
          </h2>

          <CommentSection
            targetType="Post"
            targetId={post._id}
            postOwnerId={post.authorId?._id}
          />
        </section>
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4"
        >
          {lightbox.type === "video" ? (
            <video
              src={lightbox.url}
              controls
              autoPlay
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-full rounded-md"
            />
          ) : (
            <img
              src={lightbox.url}
              alt=""
              className="max-h-[90vh] max-w-full rounded-md object-contain"
            />
          )}
        </div>
      )}
    </main>
  );
};

export default PostDetailPage;
