"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@heroui/react";
import { toast } from "sonner";

import {
  postsApi,
  useGetFeedInfiniteQuery,
  useReactToPostMutation,
} from "@/src/redux/features/posts/postsApi";

import { useGetMyPetsQuery } from "@/src/redux/features/pets/petsApi";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import PostComposer from "./components/PostComposer";
import PostCard from "./components/PostCard";

const FEED_LIMIT = 2;

export default function HomeFeed() {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(useCurrentUser);

  const { data: myPets } = useGetMyPetsQuery(undefined);

  const pets = myPets?.data ?? myPets ?? [];

  const { ref: sentinelRef, inView } = useInView();

  // ==========================================
  // RTK INFINITE QUERY
  // ==========================================

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetFeedInfiniteQuery({
      limit: FEED_LIMIT,
    });

  const [reactToPost] = useReactToPostMutation();

  // ==========================================
  // FLATTEN RTK PAGES INTO POSTS
  // ==========================================

  const allPosts =
    data?.pages.flatMap((page) => {
      if (Array.isArray(page)) {
        return page;
      }

      return page?.data ?? [];
    }) ?? [];

  // ==========================================
  // INFINITE SCROLL TRIGGER
  // ==========================================

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // REACTION

  const handleReact = async (postId: string, reactionType: string) => {
    try {
      const res = await reactToPost({
        postId,
        reactionType,
      }).unwrap();

      const { action, reactionType: newReaction } = res.data ?? res;

      // Patch the infinite-query cache instead of
      // keeping separate allPosts React state.

      dispatch(
        postsApi.util.updateQueryData(
          "getFeed",
          {
            limit: FEED_LIMIT,
          },
          (draft: any) => {
            for (const page of draft.pages) {
              const posts = Array.isArray(page) ? page : (page?.data ?? []);

              const post = posts.find((p: any) => p._id === postId);

              if (!post) {
                continue;
              }

              if (!post.reactionSummary) {
                post.reactionSummary = {};
              }

              const summary = post.reactionSummary;

              const oldReaction = post.myReaction;

              // ADDED

              if (action === "added") {
                summary[newReaction] = (summary[newReaction] ?? 0) + 1;

                post.myReaction = newReaction;
              }

              // --------------------------
              // REMOVED
              // --------------------------
              else if (action === "removed") {
                if (oldReaction) {
                  summary[oldReaction] = Math.max(
                    (summary[oldReaction] ?? 1) - 1,
                    0,
                  );
                }

                post.myReaction = null;
              }

              // CHANGED
              else if (action === "changed") {
                if (oldReaction) {
                  summary[oldReaction] = Math.max(
                    (summary[oldReaction] ?? 1) - 1,
                    0,
                  );
                }

                summary[newReaction] = (summary[newReaction] ?? 0) + 1;

                post.myReaction = newReaction;
              }

              break;
            }
          },
        ),
      );
    } catch {
      toast.error("Couldn't react — try again.");
    }
  };

  // All hooks above
  if (!currentUser) {
    return null;
  }

  return (
    <div className="w-full space-y-2 pb-8 px-2">
      <PostComposer currentUser={currentUser} pets={pets} />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner color="primary" />
        </div>
      ) : allPosts.length === 0 ? (
        <div className="text-center text-default-400 py-12 text-sm">
          No posts yet — be the first to share something.
        </div>
      ) : (
        allPosts.map((post) => (
          <PostCard key={post._id} post={post} onReact={handleReact} />
        ))
      )}

      {/* Infinite-scroll sentinel */}

      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {isFetchingNextPage && <Spinner size="sm" color="primary" />}
        </div>
      )}
    </div>
  );
}
