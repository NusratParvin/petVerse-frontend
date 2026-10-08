// "use client";

// import {
//   Avatar,
//   Button,
//   Card,
//   CardBody,
//   CardFooter,
//   CardHeader,
//   Chip,
// } from "@heroui/react";
// import {
//   ArrowDown,
//   ArrowUp,
//   Clock,
//   Eye,
//   Lock,
//   MessagesSquare,
//   Share2,
//   Star,
//   UserCheck,
//   UserPlus,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// import fallbackImage from "@/src/assets/images/fallback.jpg";
// import {
//   useReactToArticleMutation,
//   useShareArticleMutation,
//   useVoteArticleMutation,
// } from "@/src/redux/features/articles/articlesApi";
// import { REACTION_TYPE, TArticle } from "@/src/types";
// import {
//   useFollowUserMutation,
//   useGetUserInfoQuery,
// } from "@/src/redux/features/user/userApi";
// import EmojiReactionDock from "@/src/components/shared/reactionPicker";
// import {
//   useGetFriendsListQuery,
//   useSendFriendRequestMutation,
// } from "@/src/redux/features/friends/friendsApi";
// import { CATEGORY_OPTIONS, PET_OPTIONS } from "./articleFilterConstants";

// // "5m ago", "3h ago", "2d ago", then a normal date
// const timeAgo = (date: string) => {
//   const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);

//   if (minutes < 1) return "just now";
//   if (minutes < 60) return `${minutes}m ago`;
//   const hours = Math.floor(minutes / 60);

//   if (hours < 24) return `${hours}h ago`;
//   const days = Math.floor(hours / 24);

//   if (days < 30) return `${days}d ago`;

//   return new Date(date).toLocaleDateString();
// };

// const actionBtn =
//   "h-7 min-w-0 px-2 text-xs text-gray-600 dark:text-white/50 hover:text-steel-blue dark:hover:text-white/80";

// const ArticleCard = ({ article }: { article: TArticle }) => {
//   const { authorId } = article;
//   const router = useRouter();

//   // Local copy, so votes and reactions update without reloading the list
//   const [item, setItem] = useState<TArticle>(article);

//   useEffect(() => {
//     setItem(article);
//   }, [article]);

//   const [isFollowing, setIsFollowing] = useState(false);
//   const [voteArticle, { isLoading: isVoting }] = useVoteArticleMutation();
//   const [shareArticle, { isLoading: isSharing }] = useShareArticleMutation();
//   const [reactToArticle] = useReactToArticleMutation();
//   const [sendFriendRequest] = useSendFriendRequestMutation();
//   const [followUser] = useFollowUserMutation();

//   const { data: userInfo } = useGetUserInfoQuery(undefined);
//   const user = userInfo?.data;

//   const { data: friendsResponse } = useGetFriendsListQuery(undefined);
//   const friendsData = friendsResponse?.data;
//   const pendingRequests = friendsData?.pendingRequestsSent || [];
//   const friends = friendsData?.friends || [];

//   const isPending = pendingRequests.some(
//     (req: any) => req.friend._id === authorId?._id && req.isSentRequest,
//   );
//   const isFriend = friends.some(
//     (friend: any) => friend.friend._id === authorId?._id,
//   );

//   const isOwn = user?._id === authorId?._id;
//   const hasPurchased = user?.purchasedArticles?.some(
//     (id: string) => id === item._id,
//   );
//   // Premium and not bought (the author can always open their own article)
//   const isLocked = item.isPremium && !hasPurchased && !isOwn;

//   // Which arrow is lit for the current user
//   const myVote = item.voteInfo?.find((v) => v.userId === user?._id)?.voteType;

//   const categoryLabel =
//     CATEGORY_OPTIONS.find((o) => o.value === item.category)?.label ??
//     item.category;
//   const pet = PET_OPTIONS.find((o) => o.value === item.petType);
//   const showPet = pet && item.petType !== "other";
//   const commentCount = item.commentCount ?? item.comments?.length ?? 0;

//   useEffect(() => {
//     setIsFollowing(
//       article?.authorId?.followers?.includes(user?._id as string) || false,
//     );
//   }, [article, user]);

//   const handleVote = async (voteType: "upvote" | "downvote") => {
//     if (isVoting) return;
//     try {
//       const res = await voteArticle({
//         articleId: item._id,
//         voteType,
//       }).unwrap();
//       const updated = res?.data;

//       // The response has no populated author, so only take the vote fields
//       if (updated) {
//         setItem((prev) => ({
//           ...prev,
//           upvotes: updated.upvotes,
//           downvotes: updated.downvotes,
//           voteInfo: updated.voteInfo,
//         }));
//       }
//     } catch (error) {
//       toast.error("Could not update your vote. Please try again.");
//     }
//   };

//   const handleReaction = async (reaction: REACTION_TYPE) => {
//     try {
//       const res = await reactToArticle({
//         articleId: item._id,
//         reaction,
//       }).unwrap();
//       const summary = res?.data?.reactionSummary;

//       if (summary) {
//         setItem((prev) => ({ ...prev, reactionSummary: summary }));
//       }
//       toast.success("Reacted", { className: "text-green-600" });
//     } catch (error) {
//       toast.error("Failed to submit your reaction. Please try again.");
//     }
//   };

//   const handleShare = async () => {
//     try {
//       await shareArticle({ articleId: item._id }).unwrap();
//       setItem((prev) => ({ ...prev, shareCount: prev.shareCount + 1 }));
//       toast.success("Article shared");
//     } catch (error) {
//       toast.error("Failed to share the article.");
//     }
//   };

//   const handleFollow = async () => {
//     try {
//       setIsFollowing((prev) => !prev);
//       const result = await followUser({
//         followUserId: authorId._id,
//       }).unwrap();

//       setIsFollowing(result?.isFollowing || false);
//     } catch (error) {
//       setIsFollowing((prev) => !prev);
//     }
//   };

//   const handleAddFriend = async () => {
//     try {
//       await sendFriendRequest(authorId?._id).unwrap();
//       toast.success("Friend request sent!", { className: "text-yellow-600" });
//     } catch (error) {
//       toast.error("Failed to send friend request. Please try again.", {
//         className: "text-red-600",
//       });
//     }
//   };

//   const handleBuyNow = () => {
//     const paymentData = {
//       articleId: item._id,
//       authorId: authorId._id,
//       amount: item.price,
//     };

//     router.push(
//       `/user/article/payment?data=${encodeURIComponent(JSON.stringify(paymentData))}`,
//     );
//   };

//   const articleLink = `/user/article/${item._id}`;

//   return (
//     <Card
//       className="w-full mx-auto rounded-lg overflow-hidden bg-white/90 dark:bg-white/5 dark:backdrop-blur-2xl border-none shadow-sm"
//       radius="none"
//     >
//       {/* ── Header ── */}
//       <CardHeader className="flex flex-col items-start px-4 pt-4 pb-2">
//         {/* Author row */}
//         <div className="flex items-start justify-between w-full mb-3 gap-2">
//           <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
//             <Avatar
//               className="w-9 h-9 shrink-0 ring-2 ring-steel-blue/30 dark:ring-steel-blue/20"
//               src={authorId?.profilePhoto}
//             />
//             <div className="min-w-0">
//               <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
//                 <h3 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white/90 truncate">
//                   {authorId?.name || "Anonymous"}
//                 </h3>

//                 {!isOwn && (
//                   <Button
//                     className="h-5 min-w-0 px-2 text-[10px] font-semibold rounded-full border border-steel-blue/40 text-steel-blue dark:text-white/90 bg-steel-blue/10 dark:bg-steel-blue/90 hover:bg-steel-blue/50"
//                     size="sm"
//                     variant="flat"
//                     onPress={handleFollow}
//                   >
//                     {isFollowing ? "Unfollow" : "Follow"}
//                   </Button>
//                 )}
//                 {!isOwn && (
//                   <span>
//                     {isFriend ? (
//                       <UserCheck className="text-green-600" size={13} />
//                     ) : isPending ? (
//                       <Clock className="text-yellow-500" size={13} />
//                     ) : (
//                       <UserPlus
//                         className="text-gray-400 dark:text-white/30 hover:text-steel-blue cursor-pointer transition-colors"
//                         size={13}
//                         onClick={handleAddFriend}
//                       />
//                     )}
//                   </span>
//                 )}
//               </div>

//               {/* Category · pet · time · read time */}
//               <div className="flex items-center gap-1.5 mt-0.5 flex-wrap text-[10px] text-gray-500 dark:text-white/70">
//                 <span className="font-medium px-1.5 py-0.5 rounded-md bg-steel-blue/15 dark:bg-steel-blue/70 text-steel-blue dark:text-white/80">
//                   {categoryLabel}
//                 </span>
//                 {showPet && (
//                   <span className="px-1.5 py-0.5 rounded-md bg-default-100 dark:bg-white/10">
//                     {pet.emoji} {pet.label}
//                   </span>
//                 )}
//                 <span>·</span>
//                 <span>{timeAgo(item.createdAt)}</span>
//                 {item.readTime > 0 && (
//                   <>
//                     <span>·</span>
//                     <span>{item.readTime} min read</span>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Badges */}
//           <div className="flex items-center gap-1.5 shrink-0">
//             {item.isFeatured && (
//               <Chip
//                 className="text-[10px] font-bold bg-steel-blue/15 text-steel-blue dark:text-white/80"
//                 size="sm"
//                 startContent={<Star size={10} />}
//                 variant="flat"
//               >
//                 Featured
//               </Chip>
//             )}
//             {item.isPremium ? (
//               hasPurchased ? (
//                 <Chip
//                   className="text-[10px] font-bold bg-lime-burst/15 text-lime-burst border border-lime-burst/25"
//                   size="sm"
//                   variant="flat"
//                 >
//                   Purchased
//                 </Chip>
//               ) : (
//                 <Chip
//                   className="text-[10px] font-bold bg-yellow-500/15 text-yellow-500 border border-yellow-500/25"
//                   size="sm"
//                   variant="flat"
//                 >
//                   Premium
//                 </Chip>
//               )
//             ) : (
//               <Chip
//                 className="text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400"
//                 size="sm"
//                 variant="flat"
//               >
//                 Free
//               </Chip>
//             )}
//           </div>
//         </div>

//         {/* Title */}
//         <h2 className="text-base font-semibold mb-1 leading-snug text-steel-blue dark:text-lime-burst">
//           {isLocked ? (
//             <span className="inline-flex items-center gap-1.5">
//               <Lock size={14} />
//               {item.title}
//             </span>
//           ) : (
//             <Link
//               className="hover:opacity-80 transition-opacity hover:underline"
//               href={articleLink}
//             >
//               {item.title}
//             </Link>
//           )}
//         </h2>

//         {/* Excerpt (fades out when the article is locked) */}
//         <p
//           className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-3 break-words"
//           style={
//             isLocked
//               ? {
//                   WebkitMaskImage:
//                     "linear-gradient(to bottom, black 30%, transparent)",
//                   maskImage:
//                     "linear-gradient(to bottom, black 30%, transparent)",
//                 }
//               : undefined
//           }
//         >
//           {item.excerpt || "Open the article to read more."}
//         </p>

//         {/* Tags */}
//         {item.tags?.length > 0 && (
//           <div className="flex flex-wrap gap-1.5 mt-2">
//             {item.tags.slice(0, 3).map((tag) => (
//               <span
//                 key={tag}
//                 className="text-[10px] text-steel-blue dark:text-white/60"
//               >
//                 #{tag}
//               </span>
//             ))}
//           </div>
//         )}

//         {!isLocked && (
//           <Link
//             className="mt-2 text-[11px] font-semibold text-steel-blue dark:text-lime-burst hover:underline"
//             href={articleLink}
//           >
//             Read more →
//           </Link>
//         )}
//       </CardHeader>

//       {/* ── Image ── */}
//       <CardBody className="p-0">
//         <div className="relative h-48 sm:h-52 md:h-56 w-full overflow-hidden">
//           <Image
//             alt={item.title}
//             fill
//             className={`object-cover transition-transform duration-500 ${
//               isLocked ? "blur-md scale-110" : "opacity-90 hover:scale-105"
//             }`}
//             sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 70vw"
//             src={item.images || fallbackImage}
//           />

//           {isLocked ? (
//             <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/35 text-white">
//               <Lock size={22} />
//               <span className="text-xs font-semibold">
//                 Premium article · buy to unlock
//               </span>
//             </div>
//           ) : (
//             <>
//               <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
//               <Link
//                 aria-label={`Open ${item.title}`}
//                 className="absolute inset-0"
//                 href={articleLink}
//               />
//             </>
//           )}
//         </div>
//       </CardBody>

//       {/* ── Footer ── */}
//       <CardFooter className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 gap-2">
//         <div className="flex items-center gap-1 flex-wrap">
//           {/* Vote pill: ▲ score ▼ */}
//           <div
//             className="flex items-center rounded-full bg-default-100 dark:bg-white/10"
//             title={`${item.upvotes} up · ${item.downvotes} down`}
//           >
//             <Button
//               isIconOnly
//               aria-label="Upvote"
//               className="h-7 w-7 min-w-0 rounded-full"
//               isDisabled={isVoting}
//               size="sm"
//               variant="light"
//               onPress={() => handleVote("upvote")}
//             >
//               <ArrowUp
//                 className={
//                   myVote === "upvote" ? "text-lime-burst" : "text-gray-500"
//                 }
//                 size={15}
//               />
//             </Button>
//             <span className="min-w-5 text-center text-xs font-semibold text-gray-700 dark:text-white/80">
//               {item.upvotes - item.downvotes}
//             </span>
//             <Button
//               isIconOnly
//               aria-label="Downvote"
//               className="h-7 w-7 min-w-0 rounded-full"
//               isDisabled={isVoting}
//               size="sm"
//               variant="light"
//               onPress={() => handleVote("downvote")}
//             >
//               <ArrowDown
//                 className={
//                   myVote === "downvote" ? "text-red-500" : "text-gray-500"
//                 }
//                 size={15}
//               />
//             </Button>
//           </div>

//           <Button
//             as={Link}
//             className={actionBtn}
//             href={articleLink}
//             isDisabled={isLocked}
//             size="sm"
//             startContent={
//               <MessagesSquare className="text-steel-blue" size={14} />
//             }
//             variant="light"
//           >
//             {commentCount}
//           </Button>

//           <Button
//             className={actionBtn}
//             isDisabled={isSharing}
//             size="sm"
//             startContent={<Share2 className="text-steel-blue" size={14} />}
//             variant="light"
//             onPress={handleShare}
//           >
//             {item.shareCount}
//           </Button>

//           <div className="ml-1">
//             <EmojiReactionDock
//               reactionSummary={
//                 item.reactionSummary || {
//                   like: 0,
//                   love: 0,
//                   haha: 0,
//                   wow: 0,
//                   sad: 0,
//                   angry: 0,
//                 }
//               }
//               onReact={handleReaction}
//             />
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           {item.viewCount > 0 && (
//             <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-white/40">
//               <Eye size={13} />
//               {item.viewCount}
//             </span>
//           )}
//           {isLocked && (
//             <Button
//               className="h-7 text-[11px] font-bold px-3 rounded-full bg-lime-burst text-gray-900 hover:bg-lime-burst/80 transition-all"
//               size="sm"
//               variant="flat"
//               onPress={handleBuyNow}
//             >
//               Buy ${(item.price ?? 0).toFixed(2)}
//             </Button>
//           )}
//         </div>
//       </CardFooter>
//     </Card>
//   );
// };

// export default ArticleCard;

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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Clock,
  Eye,
  Lightbulb,
  Lock,
  MessagesSquare,
  PawPrint,
  Share2,
  Sparkles,
  Star,
  UserCheck,
  UserPlus,
} from "lucide-react";

import fallbackImage from "@/src/assets/images/fallback.jpg";
import {
  useReactToArticleMutation,
  useShareArticleMutation,
  useVoteArticleMutation,
} from "@/src/redux/features/articles/articlesApi";
import {
  useFollowUserMutation,
  useGetUserInfoQuery,
} from "@/src/redux/features/user/userApi";
import {
  useGetFriendsListQuery,
  useSendFriendRequestMutation,
} from "@/src/redux/features/friends/friendsApi";
import { REACTION_TYPE, TArticle } from "@/src/types";
import { CATEGORY_OPTIONS, PET_OPTIONS } from "./articleFilterConstants";
import EmojiReactionDock from "@/src/components/shared/reactionPicker";

/* -------- helpers -------- */
const timeAgo = (date: string) => {
  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

export default function ArticleCard({ article }: { article: TArticle }) {
  const router = useRouter();
  const { authorId } = article;

  const [item, setItem] = useState<TArticle>(article);
  useEffect(() => setItem(article), [article]);

  const [voteArticle, { isLoading: isVoting }] = useVoteArticleMutation();
  const [shareArticle, { isLoading: isSharing }] = useShareArticleMutation();
  const [reactToArticle] = useReactToArticleMutation();
  const [sendFriendRequest] = useSendFriendRequestMutation();
  const [followUser] = useFollowUserMutation();

  const { data: userInfo } = useGetUserInfoQuery(undefined);
  const user = userInfo?.data;

  const { data: friendsResponse } = useGetFriendsListQuery(undefined);
  const friendsData = friendsResponse?.data;
  const pendingRequests = friendsData?.pendingRequestsSent || [];
  const friends = friendsData?.friends || [];

  const isPending = pendingRequests.some(
    (req: any) => req.friend._id === authorId?._id && req.isSentRequest,
  );
  const isFriend = friends.some((f: any) => f.friend._id === authorId?._id);

  const isOwn = user?._id === authorId?._id;
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    setIsFollowing(authorId?.followers?.includes(user?._id as string) || false);
  }, [authorId, user]);

  const hasPurchased = user?.purchasedArticles?.some(
    (id: string) => id === item._id,
  );
  const isLocked = item.isPremium && !hasPurchased && !isOwn;

  const myVote = item.voteInfo?.find((v) => v.userId === user?._id)?.voteType;

  const categoryLabel =
    CATEGORY_OPTIONS.find((o) => o.value === item.category)?.label ??
    item.category;
  const pet = PET_OPTIONS.find((o) => o.value === item.petType);
  const showPet = pet && item.petType !== "other";
  const commentCount = item.commentCount ?? item.comments?.length ?? 0;
  const isTip = item.category === "Tip";

  /* -------- handlers -------- */
  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (isVoting) return;
    try {
      const res = await voteArticle({ articleId: item._id, voteType }).unwrap();
      const updated = res?.data;
      if (updated) {
        setItem((prev) => ({
          ...prev,
          upvotes: updated.upvotes,
          downvotes: updated.downvotes,
          voteInfo: updated.voteInfo,
        }));
      }
    } catch {
      toast.error("Could not update your vote.");
    }
  };

  const handleReaction = async (reaction: REACTION_TYPE) => {
    try {
      const res = await reactToArticle({
        articleId: item._id,
        reaction,
      }).unwrap();
      const summary = res?.data?.reactionSummary;
      if (summary) setItem((prev) => ({ ...prev, reactionSummary: summary }));
    } catch {
      toast.error("Failed to submit reaction.");
    }
  };

  const handleShare = async () => {
    try {
      await shareArticle({ articleId: item._id }).unwrap();
      setItem((prev) => ({ ...prev, shareCount: prev.shareCount + 1 }));
      toast.success("Article shared");
    } catch {
      toast.error("Failed to share.");
    }
  };

  const handleFollow = async () => {
    try {
      setIsFollowing((v) => !v);
      const result = await followUser({ followUserId: authorId._id }).unwrap();
      setIsFollowing(result?.isFollowing || false);
    } catch {
      setIsFollowing((v) => !v);
    }
  };

  const handleAddFriend = async () => {
    try {
      await sendFriendRequest(authorId?._id).unwrap();
      toast.success("Friend request sent!");
    } catch {
      toast.error("Failed to send friend request.");
    }
  };

  const handleBuyNow = () => {
    const paymentData = {
      articleId: item._id,
      authorId: authorId._id,
      amount: item.price,
    };
    router.push(
      `/user/article/payment?data=${encodeURIComponent(
        JSON.stringify(paymentData),
      )}`,
    );
  };

  const articleLink = `/user/article/${item._id}`;

  return (
    <article className="group relative mx-auto w-full max-w-2xl">
      {/* Soft halo glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[28px] bg-gradient-to-br from-customBlue/15 via-fuchsia-300/10 to-customOrange/15 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100 dark:from-customBlue/25 dark:to-customOrange/25"
      />

      <Card
        className="relative overflow-hidden border border-zinc-200/80 bg-white text-zinc-800 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
        radius="lg"
        shadow="sm"
      >
        {/* Paw watermark */}
        <PawPrint
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 size-40 rotate-12 text-zinc-100 dark:text-white/5"
          strokeWidth={1}
        />

        {/* ------- HEADER ------- */}
        <CardHeader className="relative z-10 flex flex-col items-start gap-4 p-5 sm:p-6">
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                <Avatar
                  className="size-11 ring-2 ring-white shadow-md dark:ring-zinc-800"
                  src={authorId?.profilePhoto}
                />
                <span className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-customBlue text-white shadow ring-2 ring-white dark:ring-zinc-900">
                  <PawPrint className="size-3" />
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    {authorId?.name || "Anonymous"}
                  </h3>

                  {!isOwn && (
                    <Button
                      className={`h-6 min-w-0 px-3 text-[11px] font-semibold ${
                        isFollowing
                          ? "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-200"
                          : "bg-customBlue text-white"
                      }`}
                      radius="full"
                      size="sm"
                      onPress={handleFollow}
                    >
                      {isFollowing ? "Following" : "+ Follow"}
                    </Button>
                  )}

                  {!isOwn && (
                    <span className="flex items-center">
                      {isFriend ? (
                        <UserCheck className="text-green-600" size={13} />
                      ) : isPending ? (
                        <Clock className="text-yellow-500" size={13} />
                      ) : (
                        <UserPlus
                          className="cursor-pointer text-zinc-400 transition-colors hover:text-customBlue dark:text-white/40"
                          size={13}
                          onClick={handleAddFriend}
                        />
                      )}
                    </span>
                  )}
                </div>

                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  {timeAgo(item.createdAt)}
                  {item.readTime > 0 && (
                    <>
                      <span>·</span>
                      <span>{item.readTime} min read</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              {item.isPremium ? (
                <Chip
                  className="border border-amber-300/60 bg-gradient-to-r from-amber-100 to-amber-200 text-[10px] font-bold text-amber-800 dark:border-amber-400/30 dark:from-amber-500/20 dark:to-amber-400/10 dark:text-amber-300"
                  size="sm"
                  startContent={<Sparkles size={10} />}
                >
                  Premium
                </Chip>
              ) : (
                <Chip
                  className="border border-emerald-300/60 bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300"
                  size="sm"
                >
                  Free
                </Chip>
              )}
              {item.isFeatured && (
                <Chip
                  className="border border-customBlue/30 bg-customBlue/10 text-[10px] font-bold text-customBlue"
                  size="sm"
                  startContent={<Star size={10} />}
                >
                  Featured
                </Chip>
              )}
            </div>
          </div>

          {/* Category line */}
          <div className="flex w-full items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                isTip
                  ? "bg-customBlue/10 text-customBlue dark:bg-customBlue/20"
                  : "bg-customOrange/10 text-customOrange dark:bg-customOrange/20"
              }`}
            >
              {isTip ? <Lightbulb size={12} /> : <BookOpen size={12} />}
              {categoryLabel || "Story"}
            </span>
            {showPet && (
              <span className="rounded-full bg-default-100 px-2 py-1 text-[10px] font-medium dark:bg-white/10">
                {pet?.emoji} {pet?.label}
              </span>
            )}
            <span className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent dark:from-white/10" />
          </div>

          {/* Title */}
          <h2 className="font-serif text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
            {isLocked ? (
              <span className="inline-flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                <Lock size={18} />
                {item.title}
              </span>
            ) : (
              <Link
                className="bg-gradient-to-r from-customOrange to-customBlue bg-clip-text text-transparent transition-opacity hover:opacity-80"
                href={articleLink}
              >
                {item.title}
              </Link>
            )}
          </h2>
        </CardHeader>

        {/* ------- IMAGE ------- */}
        <CardBody className="relative z-10 p-0">
          <div className="relative mx-5 mb-1 h-56 overflow-hidden rounded-2xl sm:mx-6 sm:h-72">
            <Image
              fill
              alt={item.title}
              className={`object-cover transition-transform duration-700 ${
                isLocked ? "blur-md scale-110" : "group-hover:scale-[1.04]"
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={item.images || fallbackImage}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />

            {isLocked ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/35 text-white">
                <Lock size={22} />
                <span className="text-xs font-semibold">
                  Premium · buy to unlock
                </span>
              </div>
            ) : (
              <div className="absolute left-3 top-3">
                <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-800 shadow-md backdrop-blur-md dark:bg-zinc-900/80 dark:text-zinc-100">
                  {isTip ? (
                    <Lightbulb className="size-3 text-customBlue" />
                  ) : (
                    <BookOpen className="size-3 text-customOrange" />
                  )}
                  {categoryLabel}
                </div>
              </div>
            )}
          </div>

          {/* Excerpt */}
          {item.excerpt && (
            <div className="px-5 pb-1 pt-4 sm:px-6">
              <p
                className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300"
                style={
                  isLocked
                    ? {
                        WebkitMaskImage:
                          "linear-gradient(to bottom, black 30%, transparent)",
                        maskImage:
                          "linear-gradient(to bottom, black 30%, transparent)",
                      }
                    : undefined
                }
              >
                {item.excerpt}
              </p>
              {!isLocked && (
                <Link
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-customBlue transition hover:gap-2"
                  href={articleLink}
                >
                  Read full {isTip ? "tip" : "story"} →
                </Link>
              )}
            </div>
          )}

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-5 pb-3 pt-1 sm:px-6">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-customBlue dark:text-white/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardBody>

        {/* ------- FOOTER ------- */}
        <CardFooter className="relative z-10 mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-zinc-200 bg-zinc-50/60 p-4 sm:px-6 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="flex items-center gap-1.5">
            {/* Vote pill */}
            <div className="flex items-center rounded-full bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-white/5 dark:ring-white/10">
              <Button
                isIconOnly
                aria-label="Upvote"
                className="size-7 min-w-0"
                isDisabled={isVoting}
                radius="full"
                size="sm"
                variant="light"
                onPress={() => handleVote("upvote")}
              >
                <ArrowUp
                  className={
                    myVote === "upvote" ? "text-emerald-600" : "text-zinc-500"
                  }
                  size={15}
                />
              </Button>
              <span className="min-w-5 text-center text-xs font-semibold">
                {item.upvotes - item.downvotes}
              </span>
              <Button
                isIconOnly
                aria-label="Downvote"
                className="size-7 min-w-0"
                isDisabled={isVoting}
                radius="full"
                size="sm"
                variant="light"
                onPress={() => handleVote("downvote")}
              >
                <ArrowDown
                  className={
                    myVote === "downvote" ? "text-rose-500" : "text-zinc-500"
                  }
                  size={15}
                />
              </Button>
            </div>

            <Button
              as={Link}
              className="h-7 min-w-0 px-2 text-xs text-zinc-600 dark:text-zinc-300"
              href={articleLink}
              isDisabled={isLocked}
              size="sm"
              startContent={<MessagesSquare size={14} />}
              variant="light"
            >
              {commentCount}
            </Button>

            <Button
              className="h-7 min-w-0 px-2 text-xs text-zinc-600 dark:text-zinc-300"
              isDisabled={isSharing}
              size="sm"
              startContent={<Share2 size={14} />}
              variant="light"
              onPress={handleShare}
            >
              {item.shareCount}
            </Button>

            <EmojiReactionDock
              reactionSummary={
                item.reactionSummary || {
                  like: 0,
                  love: 0,
                  haha: 0,
                  wow: 0,
                  sad: 0,
                  angry: 0,
                }
              }
              onReact={handleReaction}
            />
          </div>

          <div className="flex items-center gap-3">
            {item.viewCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-white/40">
                <Eye size={13} />
                {item.viewCount}
              </span>
            )}
            {isLocked && (
              <Button
                className="h-7 rounded-full bg-customOrange px-3 text-[11px] font-bold text-white transition hover:brightness-110"
                size="sm"
                onPress={handleBuyNow}
              >
                Buy ${(item.price ?? 0).toFixed(2)}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </article>
  );
}
