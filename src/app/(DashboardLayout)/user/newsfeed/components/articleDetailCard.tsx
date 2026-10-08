"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@heroui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Lightbulb,
  MessagesSquare,
  PawPrint,
  Sparkles,
} from "lucide-react";

import fallbackImage from "@/src/assets/images/fallback.jpg";
import { useVoteArticleMutation } from "@/src/redux/features/articles/articlesApi";
import { useFollowUserMutation } from "@/src/redux/features/user/userApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { TArticle } from "@/src/types";

export default function ArticleDetailCard({
  articleInfo,
}: {
  articleInfo: TArticle;
}) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [voteArticle] = useVoteArticleMutation();
  const [followUser] = useFollowUserMutation();
  const user = useAppSelector(useCurrentUser);
  const [article, setArticle] = useState(articleInfo);

  const isTip = article?.category === "Tip";
  const isOwnPost = user?._id === article?.authorId?._id;

  const plainText =
    typeof article?.content === "string"
      ? article.content.replace(/<[^>]+>/g, "").trim()
      : "";
  const readMins = Math.max(2, Math.ceil((plainText.length || 200) / 900));

  useEffect(() => {
    if (article?.authorId) {
      const alreadyFollowing = article.authorId.followers?.includes(
        user?._id as string,
      );
      setIsFollowing(alreadyFollowing || false);
    }
  }, [article, user]);

  const handleUpvote = async () => {
    try {
      const res = await voteArticle({
        articleId: article._id,
        voteType: "upvote",
      }).unwrap();
      setArticle(res.data);
    } catch {
      toast.error("Failed to upvote.");
    }
  };

  const handleDownvote = async () => {
    try {
      const res = await voteArticle({
        articleId: article._id,
        voteType: "downvote",
      }).unwrap();
      setArticle(res.data);
    } catch {
      toast.error("Failed to downvote.");
    }
  };

  const handleFollow = async () => {
    const toastId = toast.loading("Processing...");
    try {
      const result = await followUser({
        followUserId: article.authorId._id,
      }).unwrap();
      if (result.success) {
        setIsFollowing((prev) => !prev);
        toast.success(
          isFollowing ? "Unfollowed this user." : "Following this user!",
          { id: toastId },
        );
      }
    } catch {
      toast.error("Failed to follow/unfollow.", { id: toastId });
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl px-3 py-4 sm:px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-customOrange/10 via-transparent to-customBlue/10 blur-2xl"
      />

      <Card
        className="relative overflow-hidden bg-white ring-1 ring-zinc-200/70 dark:bg-zinc-900 dark:ring-white/10"
        radius="lg"
        shadow="md"
      >
        <PawPrint
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rotate-12 text-zinc-100 dark:text-white/5"
        />

        {/* -------- HEADER -------- */}
        <CardHeader className="flex flex-col items-start gap-4 p-5 sm:p-6">
          <div className="flex w-full flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                <Avatar
                  className="h-12 w-12 ring-2 ring-customOrange/40"
                  src={article?.authorId?.profilePhoto}
                />
                <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-customOrange text-white ring-2 ring-white dark:ring-zinc-900">
                  <PawPrint className="h-3 w-3" />
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold">
                    {article?.authorId?.name || "Anonymous"}
                  </h3>
                  {!isOwnPost && (
                    <Button
                      className={
                        isFollowing
                          ? "h-6 min-w-0 border-zinc-300 px-3 text-xs font-medium"
                          : "h-6 min-w-0 bg-customOrange px-3 text-xs font-medium text-white"
                      }
                      radius="full"
                      size="sm"
                      variant={isFollowing ? "bordered" : "solid"}
                      onPress={handleFollow}
                    >
                      {isFollowing ? "Following" : "+ Follow"}
                    </Button>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(article?.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  <span className="mx-1.5">·</span>
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {readMins} min read
                  </span>
                </p>
              </div>
            </div>

            {article?.isPremium ? (
              <Chip
                className="shrink-0 border border-amber-300/60 bg-gradient-to-r from-amber-100 to-amber-200 font-bold text-amber-800 dark:border-amber-400/30 dark:from-amber-500/20 dark:to-amber-400/10 dark:text-amber-300"
                size="sm"
                startContent={<Sparkles className="h-3 w-3" />}
              >
                Premium
              </Chip>
            ) : (
              <Chip
                className="shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                size="sm"
                variant="flat"
              >
                Free
              </Chip>
            )}
          </div>

          <Chip
            className="bg-customBlue/10 text-customBlue dark:bg-customBlue/20"
            size="sm"
            startContent={
              isTip ? (
                <Lightbulb className="h-3.5 w-3.5" />
              ) : (
                <BookOpen className="h-3.5 w-3.5" />
              )
            }
            variant="flat"
          >
            {article?.category || "Story"}
          </Chip>

          <h1 className="w-full break-words text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
            {article.title}
          </h1>
        </CardHeader>

        {/* -------- IMAGE -------- */}
        <CardBody className="px-5 pb-0 pt-0 sm:px-6">
          {article?.images && (
            <div className="relative w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  fill
                  priority
                  alt={article.title}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  src={article.images || fallbackImage}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <Chip
                    className="bg-white/90 font-medium text-zinc-800 backdrop-blur dark:bg-zinc-900/80 dark:text-zinc-100"
                    size="sm"
                    startContent={
                      isTip ? (
                        <Lightbulb className="h-3 w-3" />
                      ) : (
                        <BookOpen className="h-3 w-3" />
                      )
                    }
                  >
                    {article?.category}
                  </Chip>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <article
            className="prose prose-zinc dark:prose-invert mt-6 max-w-none break-words
              prose-headings:font-bold prose-headings:tracking-tight
              prose-a:text-customBlue prose-a:no-underline hover:prose-a:underline
              prose-img:my-4 prose-img:rounded-xl
              prose-pre:overflow-x-auto prose-pre:rounded-lg
              prose-code:break-words
              [&_*]:max-w-full [&_img]:h-auto [&_iframe]:max-w-full
              [&_table]:block [&_table]:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: article?.content || "" }}
          />
        </CardBody>

        {/* -------- FOOTER -------- */}
        <CardFooter className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-5 py-4 sm:px-6 dark:border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300"
              radius="full"
              size="sm"
              startContent={<ArrowUp className="h-4 w-4" />}
              variant="flat"
              onPress={handleUpvote}
            >
              {article.upvotes}
            </Button>
            <Button
              className="bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300"
              radius="full"
              size="sm"
              startContent={<ArrowDown className="h-4 w-4" />}
              variant="flat"
              onPress={handleDownvote}
            >
              {article.downvotes}
            </Button>
            <Button
              className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300"
              radius="full"
              size="sm"
              startContent={<MessagesSquare className="h-4 w-4" />}
              variant="flat"
            >
              {article?.comments?.length ?? 0}
            </Button>
          </div>

          {article.isPremium && (
            <Button
              className="bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-white shadow-md"
              radius="full"
              size="sm"
              startContent={<Sparkles className="h-4 w-4" />}
            >
              Buy Now ${article.price?.toFixed(2)}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
