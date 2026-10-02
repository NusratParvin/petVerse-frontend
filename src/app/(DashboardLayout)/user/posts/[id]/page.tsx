// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   ExternalLink,
//   Heart,
//   MessageCircle,
//   PawPrint,
//   Play,
//   Repeat2,
//   Share2,
//   Trophy,
// } from "lucide-react";
// import { Avatar, Button, Chip, Skeleton } from "@heroui/react";
// import CommentSection from "../../components/comments/commentSection";
// import { useGetPostByIdQuery } from "@/src/redux/features/posts/postsApi";

// type TMediaItem = { url: string; type: "image" | "video" };

// const timeAgo = (date: string) => {
//   const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
//   if (s < 60) return "just now";
//   if (s < 3600) return `${Math.floor(s / 60)}m ago`;
//   if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
//   if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
//   return new Date(date).toLocaleDateString("en-AE", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// };

// const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "");

// const PostDetailPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const { data, isLoading, isError } = useGetPostByIdQuery(id);
//   const [lightbox, setLightbox] = useState<TMediaItem | null>(null);

//   const post = data?.data;
//   console.log(post, "---post");
//   /* media grid, used for the post's own media and for a shared post's original */
//   const renderMedia = (media: TMediaItem[] = []) => {
//     if (!media.length) return null;
//     const shown = media.slice(0, 4);
//     return (
//       <div
//         className={`grid gap-1 overflow-hidden rounded-md ${
//           media.length === 1 ? "grid-cols-1" : "grid-cols-2"
//         }`}
//       >
//         {shown.map((m, i) => (
//           <button
//             key={i}
//             type="button"
//             onClick={(e) => {
//               e.preventDefault();
//               setLightbox(m);
//             }}
//             className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 ${
//               media.length === 1
//                 ? "aspect-[4/3] sm:aspect-[16/10]"
//                 : "aspect-square"
//             }`}
//           >
//             {m.type === "video" ? (
//               <>
//                 <video src={m.url} className="size-full object-cover" muted />
//                 <span className="absolute inset-0 grid place-items-center bg-black/30">
//                   <Play className="size-10 fill-white text-white" />
//                 </span>
//               </>
//             ) : (
//               <img
//                 src={m.url}
//                 alt=""
//                 className="size-full object-cover transition-transform duration-300 hover:scale-[1.03]"
//               />
//             )}
//             {i === 3 && media.length > 4 && (
//               <span className="absolute inset-0 grid place-items-center bg-black/55 text-2xl font-extrabold text-white">
//                 +{media.length - 4}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>
//     );
//   };

//   /* loading */
//   if (isLoading) {
//     return (
//       <main className="mx-auto w-full max-w-full px-3 py-4 sm:px-4 sm:py-6">
//         <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/[0.08] dark:bg-zinc-900">
//           <div className="flex items-center gap-3">
//             <Skeleton className="size-11 rounded-full" />
//             <div className="space-y-2">
//               <Skeleton className="h-3 w-32 rounded" />
//               <Skeleton className="h-3 w-20 rounded" />
//             </div>
//           </div>
//           <Skeleton className="h-4 w-full rounded" />
//           <Skeleton className="h-64 w-full rounded-md" />
//         </div>
//       </main>
//     );
//   }

//   /* not found / deleted */
//   if (isError || !post || post.isDeleted) {
//     return (
//       <main className="mx-auto w-full max-w-full px-3 py-6">
//         <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
//           This post is no longer available.
//         </div>
//       </main>
//     );
//   }

//   const isShare = post.type === "shared_post" || post.type === "shared_article";
//   const original = post.refId; // null if the original was deleted
//   const isArticle = post.refType === "Article";
//   const totalReactions = Object.values(post.reactionSummary ?? {}).reduce(
//     (a: number, b: any) => a + (Number(b) || 0),
//     0,
//   );
//   const originalHref = original
//     ? isArticle
//       ? `/user/articles/${original._id}`
//       : `/user/posts/${original._id}`
//     : "#";

//   return (
//     <main className="mx-auto w-full  p-0">
//       <div className="space-y-4">
//         {/*   POST  */}
//         <article className="overflow-hidden rounded-md   bg-white shadow-sm dark:border-white/[0.08] dark:bg-zinc-900">
//           <div className="space-y-1 p-4 sm:p-5">
//             {/* author */}
//             <header className="flex items-center gap-3 border">
//               {/* <Avatar
//                 src={post.authorId?.profilePhoto}
//                 name={post.authorId?.name}
//                 className="size-7 ring-2 ring-steel-blue/20 dark:ring-lime-burst/30"
//               /> */}
//               <div className="group/avatar relative shrink-0 pb-0.5 pr-1">
//                 <Avatar
//                   src={post.authorId?.profilePhoto}
//                   name={post.authorId?.name?.charAt(0)?.toUpperCase() ?? "U"}
//                   className="size-8 rotate-2 rounded-md ring-1 ring-zinc-200/70 shadow-sm transition-transform duration-300 group-hover/avatar:rotate-0 dark:ring-white/10"
//                 />
//                 <span className="absolute -bottom-2.5 -right-1.5 grid size-[28px] -rotate-6 place-items-center overflow-hidden rounded-md border-2 border-white bg-lime-burst/70 text-steel-blue shadow-sm transition-transform duration-300 group-hover/avatar:rotate-0 dark:border-zinc-900 dark:bg-lime-burst/70 dark:text-black/80">
//                   {post?.petId?.profilePhoto ? (
//                     <img
//                       src={post.petId.profilePhoto}
//                       alt={post.petId.name ?? "Pet"}
//                       className="size-full object-cover"
//                     />
//                   ) : (
//                     <PawPrint size={13} strokeWidth={2.5} />
//                   )}
//                 </span>
//               </div>

//               <div className="min-w-0 leading-tight">
//                 <p className="truncate text-sm font-extrabold text-zinc-900 dark:text-zinc-50">
//                   {post.authorId?.name}
//                   {isShare && (
//                     <span className="ml-1 inline-flex items-center gap-1 font-medium text-zinc-500 dark:text-zinc-400">
//                       shared {isArticle ? "an article" : "a post"}
//                     </span>
//                   )}
//                 </p>
//                 <p className="mt-0.5 text-[11px] text-zinc-400">
//                   {timeAgo(post.createdAt)}
//                 </p>
//               </div>
//             </header>

//             {/* badges */}
//             {(post.isMilestone || post.petId?.name) && (
//               <div className="flex flex-wrap gap-2">
//                 {post.isMilestone && (
//                   <Chip
//                     size="sm"
//                     variant="flat"
//                     startContent={<Trophy size={12} />}
//                     className="bg-amber-500/15 text-[11px] font-bold capitalize text-amber-600 dark:text-amber-400"
//                   >
//                     {post.milestoneCategory ?? "milestone"}
//                   </Chip>
//                 )}
//                 {post.petId?.name && (
//                   <Chip
//                     size="sm"
//                     variant="flat"
//                     startContent={<PawPrint size={12} />}
//                     className="bg-steel-blue/10 text-[11px] font-bold text-steel-blue dark:bg-lime-burst/10 dark:text-lime-burst"
//                   >
//                     {post.petId.name}
//                   </Chip>
//                 )}
//               </div>
//             )}

//             {/* caption */}
//             {post.caption && (
//               <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-100">
//                 {post.caption}
//               </p>
//             )}

//             {/* own media (normal posts) */}
//             {!isShare && renderMedia(post.media)}

//             {/* embedded original (shares) */}
//             {isShare &&
//               (!original ? (
//                 <div className="rounded-md border border-dashed border-zinc-300 p-4 text-center text-xs font-medium text-zinc-400 dark:border-white/10">
//                   The original {isArticle ? "article" : "post"} is no longer
//                   available.
//                 </div>
//               ) : (
//                 <Link
//                   href={originalHref}
//                   className="group block overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 transition-colors hover:border-steel-blue/50 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-lime-burst/40"
//                 >
//                   {isArticle && original.images && (
//                     <img
//                       src={original.images}
//                       alt=""
//                       className="aspect-[16/7] w-full object-cover"
//                     />
//                   )}
//                   <div className="space-y-2 p-3">
//                     <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
//                       <div className="group/avatar relative shrink-0 pb-0.5 pr-1">
//                         <Avatar
//                           src={original.authorId?.profilePhoto}
//                           name={
//                             original.authorId?.name?.charAt(0)?.toUpperCase() ??
//                             "U"
//                           }
//                           className="size-8 rotate-2 rounded-md ring-1 ring-zinc-200/70 shadow-sm transition-transform duration-300 group-hover/avatar:rotate-0 dark:ring-white/10"
//                         />
//                         <span className="absolute -bottom-2.5 -right-1.5 grid size-[28px] -rotate-6 place-items-center overflow-hidden rounded-md border-2 border-white bg-lime-burst/70 text-steel-blue shadow-sm transition-transform duration-300 group-hover/avatar:rotate-0 dark:border-zinc-900 dark:bg-lime-burst/70 dark:text-black/80">
//                           {post?.petId?.profilePhoto ? (
//                             <img
//                               src={original.petId.profilePhoto}
//                               alt={original.petId.name ?? "Pet"}
//                               className="size-full object-cover"
//                             />
//                           ) : (
//                             <PawPrint size={13} strokeWidth={2.5} />
//                           )}
//                         </span>
//                       </div>

//                       <span className="font-bold text-zinc-800 dark:text-zinc-100">
//                         {original.authorId?.name}
//                       </span>
//                       <span>·</span>
//                       <span>{timeAgo(original.createdAt)}</span>
//                       <ExternalLink
//                         size={13}
//                         className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
//                       />
//                     </div>

//                     {isArticle && (
//                       <h3 className="line-clamp-2 text-[15px] font-extrabold leading-snug text-zinc-900 dark:text-zinc-50">
//                         {original.title}
//                       </h3>
//                     )}

//                     {(isArticle ? original.content : original.caption) && (
//                       <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">
//                         {isArticle
//                           ? stripHtml(original.content)
//                           : original.caption}
//                       </p>
//                     )}

//                     {!isArticle && renderMedia(original.media)}
//                   </div>
//                 </Link>
//               ))}
//           </div>

//           {/* stats */}
//           <footer className="flex items-center justify-between border-t border-zinc-100 px-4 py-2.5 dark:border-white/[0.06] sm:px-5">
//             <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 dark:text-zinc-400">
//               <span className="inline-flex items-center gap-1.5">
//                 <Heart size={15} /> {totalReactions}
//               </span>
//               <a
//                 href="#comments"
//                 className="inline-flex items-center gap-1.5 hover:text-steel-blue dark:hover:text-lime-burst"
//               >
//                 <MessageCircle size={15} /> {post.commentCount ?? 0}
//               </a>
//               <span className="inline-flex items-center gap-1.5">
//                 <Repeat2 size={15} /> {post.shareCount ?? 0}
//               </span>
//             </div>

//             {/* swap in your real ReactionButton / SharePopover here */}
//             <button
//               type="button"
//               className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-bold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-steel-blue dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-lime-burst"
//             >
//               <Share2 size={14} /> Share
//             </button>
//           </footer>
//         </article>

//         {/* ============ COMMENTS ============ */}
//         <section
//           id="comments"
//           className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-zinc-900 sm:p-5"
//         >
//           <h2 className="mb-3 text-sm font-extrabold tracking-wide text-zinc-800 dark:text-zinc-100">
//             Comments
//             <span className="ml-2 rounded-full bg-steel-blue/10 px-2 py-0.5 text-[11px] font-bold text-steel-blue dark:bg-lime-burst/10 dark:text-lime-burst">
//               {post.commentCount ?? 0}
//             </span>
//           </h2>

//           {/* always the post being viewed (the share itself), never post.refId */}
//           <CommentSection
//             targetType="Post"
//             targetId={post._id}
//             postOwnerId={post.authorId?._id}
//           />
//         </section>
//       </div>

//       {/* ============ LIGHTBOX ============ */}
//       {lightbox && (
//         <div
//           onClick={() => setLightbox(null)}
//           className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4"
//         >
//           {lightbox.type === "video" ? (
//             <video
//               src={lightbox.url}
//               controls
//               autoPlay
//               onClick={(e) => e.stopPropagation()}
//               className="max-h-[90vh] max-w-full rounded-md"
//             />
//           ) : (
//             <img
//               src={lightbox.url}
//               alt=""
//               className="max-h-[90vh] max-w-full rounded-md object-contain"
//             />
//           )}
//         </div>
//       )}
//     </main>
//   );
// };

// export default PostDetailPage;

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronDown,
  ExternalLink,
  MessageCircle,
  PawPrint,
  Play,
  Repeat2,
} from "lucide-react";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from "@heroui/react";
import { formatDistanceToNow } from "date-fns";
import CommentSection from "../../components/comments/commentSection";
import {
  useGetPostByIdQuery,
  useReactToPostMutation,
} from "@/src/redux/features/posts/postsApi";
import SharePopover from "../components/SharePopover";
import { usePostReactions } from "../../hooks/usePostReactions";

type TMediaItem = { url: string; type: "image" | "video" };

const REACTIONS = [
  { key: "like", emoji: "🐾", label: "Paw" },
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "haha", emoji: "😂", label: "Zoomies" },
  { key: "wow", emoji: "😮", label: "Woow" },
  { key: "sad", emoji: "😢", label: "Aww" },
  { key: "angry", emoji: "😠", label: "Grr" },
] as const;

const MILESTONE_LABELS: Record<string, string> = {
  adoption: "🏠 Adoption",
  birthday: "🎂 Birthday",
  "vet-visit": "🩺 Vet visit",
  health: "💊 Health",
  other: "✨ Milestone",
};

const MILESTONE_EMOJI: Record<string, string> = {
  adoption: "🏠",
  birthday: "🎂",
  "vet-visit": "🩺",
  health: "💊",
  other: "✨",
};

const timeAgo = (date: string) =>
  `${formatDistanceToNow(new Date(date), { includeSeconds: true })} ago`;

const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "");

/* ---------------- shared visual: duo avatar header ---------------- */
const PostHeader = ({ post }: { post: any }) => {
  const pet = post.petId;
  const owner = post.authorId;

  return (
    <header className="flex items-start gap-2.5 px-3 pt-3.5">
      <div className="group/avatar relative shrink-0 pb-0.5 pr-1">
        <Avatar
          src={owner?.profilePhoto}
          name={owner?.name?.charAt(0)?.toUpperCase() ?? "U"}
          className="size-9 rotate-2 rounded-md ring-1 ring-zinc-200/70 shadow-sm transition-transform duration-300 group-hover/avatar:rotate-0 dark:ring-white/10"
        />
        {pet && (
          <span className="absolute -bottom-2.5 -right-1.5 grid size-[26px] -rotate-6 place-items-center overflow-hidden rounded-md border-2 border-white bg-lime-burst/70 text-steel-blue shadow-sm transition-transform duration-300 group-hover/avatar:rotate-0 dark:border-zinc-900 dark:bg-lime-burst/70 dark:text-black/80">
            {pet.profilePhoto ? (
              <img
                src={pet.profilePhoto}
                alt={pet.name ?? "Pet"}
                className="size-full object-cover"
              />
            ) : (
              <PawPrint size={12} strokeWidth={2.5} />
            )}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-[13px] font-bold leading-tight text-zinc-700 dark:text-zinc-100/80">
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
        <div className="flex min-w-0 items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-wider text-zinc-400/80 dark:text-zinc-500/80">
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
      </div>
    </header>
  );
};

/* ---------------- shared visual: media grid ---------------- */
const MediaGrid = ({
  media,
  petName,
  onOpen,
}: {
  media: TMediaItem[];
  petName?: string;
  onOpen?: (m: TMediaItem) => void;
}) => {
  if (!media?.length) return null;

  const count = Math.min(media.length, 4);
  const itemClass = (index: number) => {
    if (count === 1) return "max-h-[420px] aspect-[16/10] sm:aspect-[16/7]";
    if (count === 2) return "max-h-[320px] aspect-[4/3]";
    if (count === 3 && index === 0) return "col-span-2 aspect-[2/1]";
    return "aspect-square";
  };

  return (
    <div
      className={`grid overflow-hidden rounded-md bg-zinc-100 dark:bg-white/[0.04] ${
        count === 1 ? "grid-cols-1" : "grid-cols-2"
      }`}
    >
      {media.slice(0, 4).map((item, index) => {
        const classes = `h-full w-full object-cover ${itemClass(index)}`;
        const inner =
          item.type === "video" ? (
            <>
              <video
                src={item.url}
                className={classes}
                muted
                preload="metadata"
              />
              <span className="absolute inset-0 grid place-items-center bg-black/30">
                <Play className="size-9 fill-white text-white" />
              </span>
            </>
          ) : (
            <img
              src={item.url}
              alt={`${petName ?? "Pet"} post ${index + 1}`}
              loading="lazy"
              className={classes}
            />
          );

        return onOpen ? (
          <button
            key={`${item.url}-${index}`}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onOpen(item);
            }}
            className="relative overflow-hidden border border-white/70 dark:border-zinc-900/70"
          >
            {inner}
            {index === 3 && media.length > 4 && (
              <span className="absolute inset-0 grid place-items-center bg-zinc-900/55 text-lg font-extrabold text-white">
                +{media.length - 4}
              </span>
            )}
          </button>
        ) : (
          <div
            key={`${item.url}-${index}`}
            className="relative overflow-hidden border border-white/70 dark:border-zinc-900/70"
          >
            {inner}
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

/* ---------------- embedded original (share preview) ---------------- */
const SharedContentPreview = ({
  post,
  onMediaOpen,
}: {
  post: any;
  onMediaOpen?: (m: TMediaItem) => void;
}) => {
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

  if (post.refType === "Article") {
    return (
      <Link
        href={`/articles/${original._id}`}
        className="block rounded-md focus:outline-none focus:ring-2 focus:ring-steel-blue dark:focus:ring-lime-burst"
      >
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
      </Link>
    );
  }

  return (
    <Link
      href={`/user/posts/${original._id}`}
      className="group block overflow-hidden rounded-md border border-zinc-200/70 bg-zinc-50/60 transition-colors hover:border-steel-blue/45 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-lime-burst/40"
    >
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
        <ExternalLink
          size={12}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        />
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
    </Link>
  );
};

/* ---------------- reaction button + picker ---------------- */
function ReactionButton({
  post,
  onReact,
}: {
  post: any;
  onReact: (postId: string, key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const mine = REACTIONS.find((r) => r.key === post.myReaction);

  const pick = (key: string) => {
    onReact(post._id, key);
    setOpen(false);
  };

  return (
    <Popover
      placement="left"
      showArrow={false}
      offset={10}
      isOpen={open}
      onOpenChange={setOpen}
      classNames={{
        base: "rounded-full border border-zinc-200 bg-white p-0 shadow-lg dark:border-white/10 dark:bg-zinc-900",
        content: "p-1",
      }}
    >
      <PopoverTrigger>
        <button
          type="button"
          aria-expanded={open}
          className={`relative z-10 flex h-7 min-w-[5.25rem] items-center justify-center gap-1 rounded-md px-2.5 text-[10.5px] font-extrabold uppercase tracking-wide shadow-sm transition-all active:scale-95 ${
            mine
              ? "bg-steel-blue text-white dark:bg-lime-burst dark:text-zinc-900"
              : "border border-steel-blue/25 bg-steel-blue/10 text-steel-blue dark:border-lime-burst/25 dark:bg-lime-burst/10 dark:text-lime-burst"
          }`}
        >
          <span className="text-sm leading-none">{mine?.emoji ?? "🐾"}</span>
          <span>{mine ? `${mine.label}!` : "React"}</span>
          <ChevronDown
            size={11}
            className={`transition-transform duration-200 ${
              open ? "rotate-90" : ""
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
  );
}

/* ---------------- page ---------------- */
const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetPostByIdQuery(id);
  const [lightbox, setLightbox] = useState<TMediaItem | null>(null);

  const post = data?.data;

  const { handleReact } = usePostReactions();

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
  const totalReactions = Object.values(post.reactionSummary ?? {}).reduce(
    (a: number, b: any) => a + (Number(b) || 0),
    0,
  );
  const topReactions = REACTIONS.filter(
    (r) => (post.reactionSummary?.[r.key] ?? 0) > 0,
  ).slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-full p-0">
      <div className="space-y-3">
        {/* ---------------- POST CARD ---------------- */}
        <Card
          radius="none"
          shadow="none"
          className="relative w-full max-w-full overflow-visible rounded-md border-none bg-white p-0 text-zinc-900 shadow-md dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-100"
        >
          <PostHeader post={post} />

          <div className="space-y-0 px-2.5 pb-1.5 pt-3">
            {post.caption && (
              <p className="whitespace-pre-wrap break-words pb-1 text-[11.5px] leading-[1.55] text-zinc-800 dark:text-zinc-100 sm:text-[12px]">
                {post.caption}
              </p>
            )}

            {isShare ? (
              <SharedContentPreview post={post} onMediaOpen={setLightbox} />
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

              {/* share count / icon (read only here — no re-share UI on detail) */}
              <div
                className="grid h-7 shrink-0 place-items-center rounded-md px-1.5 text-[11px] font-bold text-zinc-500 dark:text-zinc-400"
                title="Shares"
              >
                <span className="inline-flex items-center gap-1">
                  <Repeat2 size={14} />
                  <span>{post.shareCount ?? 0}</span>
                </span>
              </div>

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

        {/* ---------------- COMMENTS ---------------- */}
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

      {/* ---------------- LIGHTBOX ---------------- */}
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
