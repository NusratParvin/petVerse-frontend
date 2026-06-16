// "use client";
// import { useEffect, useState } from "react";
// import { MessageCircle, CornerDownRight } from "lucide-react";
// import { TComment } from "@/src/types";
// import {
//   TTargetType,
//   useGetRepliesByParentIdQuery,
// } from "@/src/redux/features/comments/commentsApi";
// import AddCommentCard from "./addCommentCard";
// import CommentCard from "./commentCard";

// interface ReplyThreadProps {
//   replyCount: number;
//   targetId: string;
//   targetType: TTargetType;
//   parentCommentId: string;
//   isPostOwner: boolean;
//   depth: number;
//   onCommentUpdated: (updated: TComment) => void;
//   onCommentDeleted: (id: string) => void;
// }

// const ReplyThread = ({
//   replyCount,
//   targetId,
//   targetType,
//   parentCommentId,
//   isPostOwner,
//   depth,
//   onCommentUpdated,
//   onCommentDeleted,
// }: ReplyThreadProps) => {
//   const [showReplies, setShowReplies] = useState(false);
//   const [isReplying, setIsReplying] = useState(false);
//   const [page, setPage] = useState(1);
//   const [allReplies, setAllReplies] = useState<TComment[]>([]);
//   const [totalCount, setTotalCount] = useState(replyCount);
//   const [hasFetched, setHasFetched] = useState(false);

//   const { data, isFetching } = useGetRepliesByParentIdQuery(
//     { parentId: parentCommentId, page },
//     { skip: !hasFetched },
//   );

//   console.log(parentCommentId);
//   console.log(data);

//   useEffect(() => {
//     if (!data?.data?.replies) return;
//     if (page === 1) {
//       setAllReplies(data.data.replies);
//     } else {
//       setAllReplies((prev) => {
//         const existingIds = new Set(prev.map((r) => r._id));
//         const newOnes = data.data.replies.filter(
//           (r: TComment) => !existingIds.has(r._id),
//         );

//         return [...prev, ...newOnes];
//       });
//     }
//     setTotalCount(data.data.total);
//   }, [data]);

//   const handleToggle = () => {
//     if (!hasFetched) setHasFetched(true);
//     setShowReplies((v) => !v);
//   };

//   const handleNewReply = (newReply: TComment) => {
//     setAllReplies((prev) => [...prev, newReply]);
//     setTotalCount((prev) => prev + 1);
//     setShowReplies(true);
//     setIsReplying(false);
//   };

//   const handleReplyDeleted = (id: string) => {
//     setAllReplies((prev) => prev.filter((r) => r._id !== id));
//     setTotalCount((prev) => prev - 1);
//   };

//   const handleReplyUpdated = (updated: TComment) => {
//     setAllReplies((prev) =>
//       prev.map((r) => (r._id === updated._id ? updated : r)),
//     );
//     onCommentUpdated(updated);
//   };

//   return (
//     <div className="mt-1.5">
//       <div className="flex items-center gap-2">
//         {/* Reply button */}
//         <button
//           onClick={() => setIsReplying((v) => !v)}
//           className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-colors ${
//             isReplying
//               ? "text-steel-blue dark:text-lime-burst bg-steel-blue/10 dark:bg-lime-burst/10"
//               : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
//           }`}
//         >
//           <MessageCircle className="size-3" />
//           <span>{isReplying ? "Cancel" : "Reply"}</span>
//         </button>

//         {/* Show/hide toggle — only if there are replies */}
//         {totalCount > 0 && (
//           <button
//             onClick={handleToggle}
//             className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
//           >
//             <CornerDownRight className="size-3" />
//             <span>
//               {isFetching
//                 ? "Loading..."
//                 : showReplies
//                   ? "Hide"
//                   : `${totalCount} ${totalCount === 1 ? "reply" : "replies"}`}
//             </span>
//           </button>
//         )}
//       </div>

//       {/* Composer */}
//       {isReplying && (
//         <div className="mt-2">
//           <AddCommentCard
//             targetType={targetType}
//             targetId={targetId}
//             parentCommentId={parentCommentId}
//             autoExpand
//             onSuccess={handleNewReply}
//             onCancel={() => setIsReplying(false)}
//           />
//         </div>
//       )}

//       {/* Replies */}
//       {showReplies && allReplies.length > 0 && (
//         <div className="mt-1 space-y-1">
//           {allReplies.map((reply) => (
//             <div key={reply._id} className="relative">
//               <CornerDownRight className="absolute -left-0.5 top-3 size-3 text-zinc-300 dark:text-zinc-700 pointer-events-none" />
//               <CommentCard
//                 comment={reply as any}
//                 targetId={targetId}
//                 targetType={targetType}
//                 isPostOwner={isPostOwner}
//                 depth={depth + 1}
//                 onCommentUpdated={handleReplyUpdated}
//                 onCommentDeleted={handleReplyDeleted}
//               />
//             </div>
//           ))}

//           {/* Load more replies */}
//           {data?.data?.hasMore && (
//             <button
//               onClick={() => setPage((p) => p + 1)}
//               disabled={isFetching}
//               className="ml-6 text-[10px] text-steel-blue dark:text-lime-burst font-medium hover:underline disabled:opacity-50"
//             >
//               {isFetching ? "Loading..." : "Load more replies"}
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReplyThread;

"use client";
import { useState } from "react";
import { MessageCircle, CornerDownRight } from "lucide-react";
import { TComment } from "@/src/types";
import {
  TTargetType,
  useGetRepliesByParentIdQuery,
} from "@/src/redux/features/comments/commentsApi";
import AddCommentCard from "./addCommentCard";
import CommentCard from "./commentCard";

interface ReplyThreadProps {
  replyCount: number;
  targetId: string;
  targetType: TTargetType;
  parentCommentId: string;
  isPostOwner: boolean;
  depth: number;
  onCommentUpdated: (updated: TComment) => void;
  onCommentDeleted: (id: string) => void;
}

const ReplyThread = ({
  replyCount,
  targetId,
  targetType,
  parentCommentId,
  isPostOwner,
  depth,
  onCommentUpdated,
  onCommentDeleted,
}: ReplyThreadProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [page, setPage] = useState(1);
  const [allReplies, setAllReplies] = useState<TComment[]>([]);

  // Fetch replies when showReplies is true
  const { data, isFetching } = useGetRepliesByParentIdQuery(
    { parentId: parentCommentId, page },
    { skip: !showReplies },
  );

  // Update replies when data arrives
  const replies = data?.data?.replies || [];
  const hasMore = data?.data?.hasMore || false;
  const total = data?.data?.total || 0;
  console.log(data);

  // Append new replies to existing ones
  useState(() => {
    if (!data?.data?.replies) return;

    if (page === 1) {
      setAllReplies(data.data.replies);
    } else {
      setAllReplies((prev) => {
        const existingIds = new Set(prev.map((r) => r._id));
        const newReplies = data.data.replies.filter(
          (r: TComment) => !existingIds.has(r._id),
        );
        return [...prev, ...newReplies];
      });
    }
  });

  // Handle toggle - just show/hide, no extra state
  const handleToggle = () => {
    setShowReplies(!showReplies);
  };

  // Load more replies
  const handleLoadMore = () => {
    setPage(page + 1);
  };

  // Handle new reply
  const handleNewReply = (newReply: TComment) => {
    setAllReplies((prev) => [newReply, ...prev]);
    setShowReplies(true);
    setIsReplying(false);
  };

  // Handle reply deleted
  const handleReplyDeleted = (id: string) => {
    setAllReplies((prev) => prev.filter((r) => r._id !== id));
  };

  // Handle reply updated
  const handleReplyUpdated = (updated: TComment) => {
    setAllReplies((prev) =>
      prev.map((r) => (r._id === updated._id ? updated : r)),
    );
    onCommentUpdated(updated);
  };

  return (
    <div className="mt-1.5">
      <div className="flex items-center gap-2">
        {/* Reply button */}
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <MessageCircle className="size-3" />
          <span>{isReplying ? "Cancel" : "Reply"}</span>
        </button>

        {/* Show/hide toggle */}
        {replyCount > 0 && (
          <button
            onClick={handleToggle}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <CornerDownRight className="size-3" />
            <span>
              {showReplies
                ? "Hide"
                : `${replyCount} ${replyCount === 1 ? "reply" : "replies"}`}
            </span>
          </button>
        )}
      </div>

      {/* Reply composer */}
      {isReplying && (
        <div className="mt-2">
          <AddCommentCard
            targetType={targetType}
            targetId={targetId}
            parentCommentId={parentCommentId}
            autoExpand
            onSuccess={handleNewReply}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {/* Replies list */}
      {showReplies && (
        <div className="mt-1 space-y-1">
          {isFetching && page === 1 ? (
            <div className="text-xs text-zinc-400 ml-6">Loading replies...</div>
          ) : allReplies.length === 0 ? (
            <div className="text-xs text-zinc-400 ml-6">No replies yet</div>
          ) : (
            <>
              {allReplies.map((reply) => (
                <div key={reply._id} className="relative">
                  <CornerDownRight className="absolute -left-0.5 top-3 size-3 text-zinc-300 dark:text-zinc-700 pointer-events-none" />
                  <CommentCard
                    comment={reply}
                    targetId={targetId}
                    targetType={targetType}
                    isPostOwner={isPostOwner}
                    depth={depth + 1}
                    onCommentUpdated={handleReplyUpdated}
                    onCommentDeleted={handleReplyDeleted}
                  />
                </div>
              ))}

              {/* Load more button */}
              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={isFetching}
                  className="ml-6 text-[10px] text-steel-blue dark:text-lime-burst font-medium hover:underline disabled:opacity-50"
                >
                  {isFetching ? "Loading..." : "Load more replies"}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReplyThread;
