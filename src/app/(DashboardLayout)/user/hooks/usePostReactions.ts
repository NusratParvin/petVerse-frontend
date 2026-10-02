"use client";

import { toast } from "sonner";
import {
  postsApi,
  useReactToPostMutation,
} from "@/src/redux/features/posts/postsApi";
import { useAppDispatch } from "@/src/redux/hooks";

type ReactionAction = "added" | "removed" | "changed";

const applyReaction = (
  post: any,
  action: ReactionAction,
  newReaction: string,
) => {
  if (!post) return;

  if (!post.reactionSummary) post.reactionSummary = {};

  const summary = post.reactionSummary;
  const oldReaction = post.myReaction;

  if (action === "added") {
    summary[newReaction] = (summary[newReaction] ?? 0) + 1;
    post.myReaction = newReaction;
  } else if (action === "removed") {
    if (oldReaction) {
      summary[oldReaction] = Math.max((summary[oldReaction] ?? 1) - 1, 0);
    }
    post.myReaction = null;
  } else if (action === "changed") {
    if (oldReaction) {
      summary[oldReaction] = Math.max((summary[oldReaction] ?? 1) - 1, 0);
    }
    summary[newReaction] = (summary[newReaction] ?? 0) + 1;
    post.myReaction = newReaction;
  }
};

export function usePostReactions(feedLimit = 5) {
  const dispatch = useAppDispatch();
  const [reactToPost] = useReactToPostMutation();

  const handleReact = async (postId: string, reactionType: string) => {
    try {
      const res = await reactToPost({ postId, reactionType }).unwrap();
      const { action, reactionType: newReaction } = res.data ?? res;

      /*   patch the FEED cache (list view)   */
      dispatch(
        postsApi.util.updateQueryData(
          "getFeed",
          { limit: feedLimit },
          (draft: any) => {
            for (const page of draft.pages) {
              const posts = Array.isArray(page) ? page : (page?.data ?? []);
              const post = posts.find((p: any) => p._id === postId);
              if (!post) continue;
              applyReaction(post, action, newReaction);
              break;
            }
          },
        ),
      );

      /*   patch the SINGLE-POST cache (detail view)   */
      dispatch(
        postsApi.util.updateQueryData("getPostById", postId, (draft: any) => {
          const post = draft?.data ?? draft;
          if (!post) return;
          applyReaction(post, action, newReaction);
        }),
      );
    } catch {
      toast.error("Couldn't react — try again.");
    }
  };

  return { handleReact };
}
