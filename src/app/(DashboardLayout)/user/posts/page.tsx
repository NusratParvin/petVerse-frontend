// "use client";

// import { useState, useEffect } from "react";
// import { useInView } from "react-intersection-observer";
// import { Spinner } from "@heroui/react";
// import { toast } from "sonner";
// import PostComposer from "./PostComposer";
// import PostCard from "./PostCard";
// import {
//   useGetFeedQuery,
//   useReactToPostMutation,
// } from "@/src/redux/features/posts/postsApi";
// import { useGetMyPetsQuery } from "@/src/redux/features/pets/petsApi";
// import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
// import { useAppSelector } from "@/src/redux/hooks";

// export default function HomeFeed() {
//   const currentUser = useAppSelector(useCurrentUser);
//   const { data: myPets } = useGetMyPetsQuery(undefined);
//   const pets = myPets?.data ?? myPets ?? [];

//   const [page, setPage] = useState(1);
//   const [allPosts, setAllPosts] = useState<any[]>([]);
//   const [hasMore, setHasMore] = useState(true);
//   const { ref: sentinelRef, inView } = useInView();

//   const { currentData, isFetching, isLoading } = useGetFeedQuery({
//     page,
//     limit: 2,
//   });
//   const [reactToPost] = useReactToPostMutation();

//   // Append each new page's results rather than replacing — same
//   // accumulation pattern as Vet Finder's infinite scroll.
//   useEffect(() => {
//     if (!currentData) return;
//     const incoming = currentData.data ?? currentData; // adjust to match your sendResponse envelope
//     setAllPosts((prev) => (page === 1 ? incoming : [...prev, ...incoming]));
//     if (incoming.length < 2) setHasMore(false);
//   }, [currentData, page]);

//   useEffect(() => {
//     if (inView && hasMore && !isFetching) {
//       setPage((p) => p + 1);
//     }
//   }, [inView, hasMore, isFetching]);

//   // All hooks are above this line — safe to conditionally return now.
//   if (!currentUser) return null;

//   const handleReact = async (postId: string, reactionType: string) => {
//     try {
//       const res = await reactToPost({ postId, reactionType }).unwrap();
//       const { action, reactionType: newReaction } = res.data ?? res;

//       // Patch just this one post locally instead of refetching the whole
//       // feed (which would duplicate posts due to the accumulation pattern above).
//       setAllPosts((prev) =>
//         prev.map((p) => {
//           if (p._id !== postId) return p;

//           const summary = { ...p.reactionSummary };
//           const oldReaction = p.myReaction;

//           if (action === "added") {
//             summary[newReaction] = (summary[newReaction] ?? 0) + 1;
//           } else if (action === "removed") {
//             summary[oldReaction] = Math.max((summary[oldReaction] ?? 1) - 1, 0);
//           } else if (action === "changed") {
//             summary[oldReaction] = Math.max((summary[oldReaction] ?? 1) - 1, 0);
//             summary[newReaction] = (summary[newReaction] ?? 0) + 1;
//           }

//           return { ...p, reactionSummary: summary, myReaction: newReaction };
//         }),
//       );
//     } catch {
//       toast.error("Couldn't react — try again.");
//     }
//   };

//   const handleComment = (postId: string) => {
//     // TODO: open comment drawer/modal — reuses your existing polymorphic
//     // Comment component with targetType: 'Post', targetId: postId
//   };

//   return (
//     <div className="w-full space-y-4 pb-8">
//       <PostComposer currentUser={currentUser} pets={pets} />

//       {isLoading ? (
//         <div className="flex justify-center py-8">
//           <Spinner color="primary" />
//         </div>
//       ) : allPosts.length === 0 ? (
//         <div className="text-center text-default-400 py-12 text-sm">
//           No posts yet — be the first to share something.
//         </div>
//       ) : (
//         allPosts.map((post) => (
//           <PostCard
//             key={post._id}
//             post={post}
//             onReact={handleReact}
//             onComment={handleComment}
//           />
//         ))
//       )}

//       {hasMore && (
//         <div ref={sentinelRef} className="flex justify-center py-4">
//           {isFetching && <Spinner size="sm" color="primary" />}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@heroui/react";
import { toast } from "sonner";

import PostComposer from "./PostComposer";
import PostCard from "./PostCard";

import {
  postsApi,
  useGetFeedInfiniteQuery,
  useReactToPostMutation,
} from "@/src/redux/features/posts/postsApi";

import { useGetMyPetsQuery } from "@/src/redux/features/pets/petsApi";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";

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

  // ==========================================
  // REACTION
  // ==========================================

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

              // --------------------------
              // ADDED
              // --------------------------

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

              // --------------------------
              // CHANGED
              // --------------------------
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

              // We found the post.
              // No need to search later pages.
              break;
            }
          },
        ),
      );
    } catch {
      toast.error("Couldn't react — try again.");
    }
  };

  // ==========================================
  // COMMENTS
  // ==========================================

  const handleComment = (postId: string) => {
    // TODO:
    // Open comment drawer/modal
    // targetType: "Post"
    // targetId: postId
  };

  // All hooks above
  if (!currentUser) {
    return null;
  }

  // ==========================================
  // UI
  // ==========================================

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
          <PostCard
            key={post._id}
            post={post}
            onReact={handleReact}
            onComment={handleComment}
          />
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
