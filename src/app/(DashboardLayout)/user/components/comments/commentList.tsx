// "use client";
// import { Button, Chip, Skeleton } from "@heroui/react";
// import { MessageCircle, Eye, PawPrint, Sparkles } from "lucide-react";
// import { TComment } from "@/src/types";
// import { TTargetType } from "@/src/redux/features/comments/commentsApi";
// import CommentCard from "./commentCard";

// interface CommentListProps {
//   comments: TComment[];
//   targetId: string;
//   targetType: TTargetType;
//   isPostOwner: boolean;
//   isLoading: boolean;
//   hasMore?: boolean;
//   onLoadMore: () => void;
//   onCommentUpdated: (updated: TComment) => void;
//   onCommentDeleted: (id: string) => void;
// }

// const CommentList = ({
//   comments,
//   targetId,
//   targetType,
//   isPostOwner,
//   isLoading,
//   hasMore,
//   onLoadMore,
//   onCommentUpdated,
//   onCommentDeleted,
// }: CommentListProps) => {
//   const isLostFound = targetType === "LostFound";
//   const sightings = comments.filter((c: any) => c.isSighting);
//   const regularComments = comments.filter((c: any) => !c.isSighting);

//   const sharedProps = {
//     targetId,
//     targetType,
//     isPostOwner,
//     onCommentUpdated,
//     onCommentDeleted,
//   };

//   if (isLoading)
//     return (
//       <div className="space-y-2">
//         {[1, 2, 3].map((i) => (
//           <Skeleton key={i} className="h-20 w-full rounded-xl" />
//         ))}
//       </div>
//     );

//   if (comments.length === 0)
//     return (
//       <div className="text-center py-10 rounded-md border border-dashed border-zinc-300 dark:border-zinc-700">
//         <MessageCircle className="size-5 mx-auto text-steel-blue dark:text-lime-burst mb-2" />
//         <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
//           {isLostFound ? "No sightings or comments yet" : "No comments yet"}
//         </p>
//       </div>
//     );

//   return (
//     <div className="space-y-3">
//       {/* Header */}
//       <div className="flex items-center gap-2 px-1">
//         <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-steel-blue/10 dark:bg-lime-burst/10 border border-steel-blue/20 dark:border-lime-burst/20">
//           <PawPrint
//             className="size-3 text-steel-blue dark:text-lime-burst"
//             strokeWidth={2.5}
//           />
//           <h2 className="font-bold text-[11px] text-steel-blue dark:text-lime-burst uppercase tracking-wider">
//             {isLostFound ? "Sightings & Comments" : "Comments"}
//           </h2>
//           <span className="text-[10px] font-bold text-steel-blue/70 dark:text-lime-burst/70 ml-0.5">
//             {comments.length}
//           </span>
//         </div>
//         {isLostFound && sightings.length > 0 && (
//           <Chip
//             size="sm"
//             startContent={<Eye className="size-2.5" />}
//             classNames={{
//               base: "bg-amber-500/10 h-5 border border-amber-400/30",
//               content:
//                 "text-amber-700 dark:text-amber-400 font-bold text-[10px] px-1",
//             }}
//           >
//             {sightings.length} spotted
//           </Chip>
//         )}
//       </div>

//       {/* Sightings */}
//       {isLostFound && sightings.length > 0 && (
//         <div className="space-y-2">
//           <div className="flex items-center gap-1.5 px-1">
//             <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30">
//               <Sparkles className="size-2.5 text-amber-600" />
//               <p className="text-[9px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
//                 Sightings ({sightings.length})
//               </p>
//             </div>
//           </div>
//           {sightings.map((comment: any) => (
//             <CommentCard key={comment._id} comment={comment} {...sharedProps} />
//           ))}
//         </div>
//       )}

//       {/* Regular comments */}
//       {regularComments.length > 0 && (
//         <div className="space-y-2">
//           {isLostFound && sightings.length > 0 && (
//             <div className="flex items-center gap-1.5 px-1 pt-1">
//               <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-steel-blue/10 dark:bg-lime-burst/10 border border-steel-blue/20 dark:border-lime-burst/20">
//                 <MessageCircle className="size-2.5 text-steel-blue dark:text-lime-burst" />
//                 <p className="text-[9px] uppercase tracking-wider text-steel-blue dark:text-lime-burst font-bold">
//                   Comments ({regularComments.length})
//                 </p>
//               </div>
//             </div>
//           )}
//           {regularComments.map((comment: any) => (
//             <CommentCard key={comment._id} comment={comment} {...sharedProps} />
//           ))}
//         </div>
//       )}

//       {hasMore && (
//         <Button
//           size="sm"
//           variant="bordered"
//           onPress={onLoadMore}
//           isLoading={isLoading}
//           className="w-full text-[11px] h-8 font-bold uppercase tracking-wider text-steel-blue dark:text-lime-burst border border-dashed border-steel-blue/40 dark:border-lime-burst/40 rounded-xl"
//         >
//           Load more
//         </Button>
//       )}
//     </div>
//   );
// };

// export default CommentList;

"use client";
import { Button, Chip, Skeleton } from "@heroui/react";
import { MessageCircle, Eye, PawPrint, Sparkles } from "lucide-react";
import { TComment } from "@/src/types";
import { TTargetType } from "@/src/redux/features/comments/commentsApi";
import CommentCard from "./commentCard";

interface CommentListProps {
  comments: TComment[];
  targetId: string;
  targetType: TTargetType;
  isPostOwner: boolean;
  isLoading: boolean;
  hasMore?: boolean;
  onLoadMore: () => void;
  onCommentUpdated: (updated: TComment) => void;
  onCommentDeleted: (id: string) => void;
}

const CommentList = ({
  comments,
  targetId,
  targetType,
  isPostOwner,
  isLoading,
  hasMore,
  onLoadMore,
  onCommentUpdated,
  onCommentDeleted,
}: CommentListProps) => {
  const isLostFound = targetType === "LostFound";
  const sightings = comments.filter((c: any) => c.isSighting);
  const regularComments = comments.filter((c: any) => !c.isSighting);

  if (isLoading)
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );

  if (comments.length === 0)
    return (
      <div className="relative text-center py-10 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-hidden">
        <PawPrint
          className="absolute top-3 left-6 size-5 text-steel-blue/10 dark:text-lime-burst/10 -rotate-12"
          strokeWidth={2}
        />
        <PawPrint
          className="absolute bottom-3 right-8 size-4 text-steel-blue/10 dark:text-lime-burst/10 rotate-45"
          strokeWidth={2}
        />
        <div className="inline-flex size-10 rounded-full bg-steel-blue/10 dark:bg-lime-burst/10 items-center justify-center mb-2">
          <MessageCircle className="size-5 text-steel-blue dark:text-lime-burst" />
        </div>
        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          {isLostFound ? "No sightings or comments yet" : "No comments yet"}
        </p>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
          Be the first to start the conversation 🐾
        </p>
      </div>
    );

  const sharedProps = {
    targetId,
    targetType,
    isPostOwner,
    onCommentUpdated,
    onCommentDeleted,
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-steel-blue/10 dark:bg-lime-burst/10 border border-steel-blue/20 dark:border-lime-burst/20">
          <PawPrint
            className="size-3 text-steel-blue dark:text-lime-burst"
            strokeWidth={2.5}
          />
          <h2 className="font-bold text-[11px] text-steel-blue dark:text-lime-burst uppercase tracking-wider">
            {isLostFound ? "Sightings & Comments" : "Comments"}
          </h2>
          <span className="text-[10px] font-bold text-steel-blue/70 dark:text-lime-burst/70 ml-0.5">
            {comments.length}
          </span>
        </div>

        {isLostFound && sightings.length > 0 && (
          <Chip
            size="sm"
            startContent={<Eye className="size-2.5" />}
            classNames={{
              base: "bg-amber-500/10 h-5 border border-amber-400/30",
              content:
                "text-amber-700 dark:text-amber-400 font-bold text-[10px] px-1",
            }}
          >
            {sightings.length} spotted
          </Chip>
        )}
      </div>

      {/* Sightings first for L&F */}
      {isLostFound && sightings.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-1">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30">
              <Sparkles className="size-2.5 text-amber-600" />
              <p className="text-[9px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                Sightings ({sightings.length})
              </p>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-400/30 to-transparent" />
          </div>
          {sightings.map((c) => (
            <CommentCard key={c._id} comment={c} {...sharedProps} />
          ))}
        </div>
      )}

      {/* Regular comments */}
      {regularComments.length > 0 && (
        <div className="space-y-2">
          {isLostFound && sightings.length > 0 && (
            <div className="flex items-center gap-1.5 px-1 pt-1">
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-steel-blue/10 dark:bg-lime-burst/10 border border-steel-blue/20 dark:border-lime-burst/20">
                <MessageCircle className="size-2.5 text-steel-blue dark:text-lime-burst" />
                <p className="text-[9px] uppercase tracking-wider text-steel-blue dark:text-lime-burst font-bold">
                  Comments ({regularComments.length})
                </p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-steel-blue/30 dark:from-lime-burst/30 to-transparent" />
            </div>
          )}
          {regularComments.map((c) => (
            <CommentCard key={c._id} comment={c} {...sharedProps} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="pt-1">
          <Button
            size="sm"
            variant="bordered"
            onPress={onLoadMore}
            startContent={<PawPrint className="size-3" strokeWidth={2.5} />}
            className="w-full text-[11px] h-8 font-bold uppercase tracking-wider text-steel-blue dark:text-lime-burst border border-dashed border-steel-blue/40 dark:border-lime-burst/40 hover:bg-steel-blue/5 dark:hover:bg-lime-burst/5 rounded-md"
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentList;
