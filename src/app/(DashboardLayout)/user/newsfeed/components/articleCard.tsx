"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Chip,
  Tooltip,
} from "@heroui/react";
import {
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  MessagesSquare,
  Share2,
  UserCheck,
  UserPlus,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import fallbackImage from "@/src/assets/images/fallback.jpg";
import {
  useReactToArticleMutation,
  useShareArticleMutation,
  useVoteArticleMutation,
} from "@/src/redux/features/articles/articlesApi";
import { REACTION_TYPE, TArticle } from "@/src/types";
import {
  useFollowUserMutation,
  useGetUserInfoQuery,
} from "@/src/redux/features/user/userApi";
import EmojiReactionDock from "@/src/components/shared/reactionPicker";
import {
  useGetFriendsListQuery,
  useSendFriendRequestMutation,
} from "@/src/redux/features/friends/friendsApi";

const ArticleCard = ({ article }: { article: TArticle }) => {
  const { authorId } = article;
  const [isFollowing, setIsFollowing] = useState(false);
  const [voteArticle] = useVoteArticleMutation();
  const [shareArticle, { isLoading }] = useShareArticleMutation();
  // console.log(article);
  const [reactToArticle] = useReactToArticleMutation();
  const [sendFriendRequest] = useSendFriendRequestMutation();

  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const [followUser] = useFollowUserMutation();
  const router = useRouter();

  // Fetch user information
  const { data: userInfo } = useGetUserInfoQuery(undefined);
  const user = userInfo?.data;

  const { data } = useGetFriendsListQuery(undefined);
  const friendsData = data?.data;
  // console.log(friendsData);
  const pendingRequests = friendsData?.pendingRequestsSent || [];
  const friends = friendsData?.friends || [];

  const isPending = pendingRequests.some(
    (req: any) => req.friend._id === authorId?._id && req.isSentRequest,
  );
  const isFriend = friends.some(
    (friend: any) => friend.friend._id === authorId?._id,
  );
  // console.log(isPending, isFriend);

  // Check if the article is purchased by the user
  const hasPurchased = user?.purchasedArticles?.some(
    (purchasedArticle: string) => purchasedArticle === article._id,
  );

  useEffect(() => {
    const alreadyFollowing = article?.authorId?.followers?.includes(
      user?._id as string,
    );

    setIsFollowing(alreadyFollowing || false);
  }, [article, user]);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle article upvote
  const handleUpvote = async () => {
    try {
      await voteArticle({
        articleId: article._id,
        voteType: "upvote",
      }).unwrap();
    } catch (error) {
      console.error("Failed to upvote:", error);
    }
  };

  const handleDownvote = async () => {
    try {
      await voteArticle({
        articleId: article._id,
        voteType: "downvote",
      }).unwrap();
    } catch (error) {
      console.error("Failed to downvote:", error);
    }
  };

  const handleFollow = async () => {
    try {
      setIsFollowing((prev) => !prev);
      const result = await followUser({
        followUserId: authorId._id,
      }).unwrap();

      setIsFollowing(result?.isFollowing || false);
    } catch (error) {
      setIsFollowing((prev) => !prev);
      console.error("Failed to follow/unfollow:", error);
    }
  };

  const handleAddFriend = async () => {
    try {
      const response = await sendFriendRequest(authorId?._id).unwrap();

      // console.log("Friend request sent:", response);
      toast.success("Friend request sent!", { className: "text-yellow-600" });
    } catch (error) {
      // console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request. Please try again.", {
        className: "text-red-600",
      });
    }
  };

  const handleBuyNow = () => {
    const paymentData = {
      articleId: article._id,
      authorId: article.authorId._id,
      amount: article.price,
    };

    const encodedData = encodeURIComponent(JSON.stringify(paymentData));

    router.push(`/user/article/payment?data=${encodedData}`);
  };

  const handleShare = async () => {
    try {
      await shareArticle({
        articleId: article._id,
        // userId: user?._id,
      }).unwrap();
      console.log("Article shared successfully!");
    } catch (error) {
      console.error("Failed to share the article:", error);
    }
  };

  // Handle emoji reaction
  const handleReaction = async (reaction: REACTION_TYPE) => {
    try {
      await reactToArticle({
        articleId: article._id,
        reaction,
      }).unwrap();
      // console.log(res);
      // console.log(`Reacted with ${reaction}:`, res);

      toast.success("Reacted", {
        className: "text-green-600",
      });
    } catch (error) {
      toast.error("Failed to submit your reaction. Please try again.");
      // console.error("Failed to react:", error);
    }
  };

  return (
    // <Card
    //   className="w-full mx-auto bg-white dark:bg-gray-800/90 text-gray-900 dark:text-white shadow-lg rounded-3xl text-xs border border-steel-blue/10 dark:border-white/10 overflow-hidden"
    //   radius="none"
    // >
    //   {/* Card Header */}
    //   <CardHeader className="flex flex-col items-start p-5">
    //     <div className="flex justify-between items-start w-full">
    //       <div className="flex items-center   w-full mb-3">
    //         <Avatar className="w-12 h-12" src={authorId?.profilePhoto} />
    //         <div className="ml-3 flex-grow">
    //           <div className="flex gap-6 items-end">
    //             <h3 className="text-sm font-bold">
    //               {authorId?.name || "Anonymous"}
    //             </h3>
    //             {user?._id != authorId?._id && (
    //               <div className="flex items-center">
    //                 <Button
    //                   className="mr-2 text-xs h-6 min-w-unit-16 bg-customBlue text-white"
    //                   color="primary"
    //                   size="sm"
    //                   onClick={handleFollow}
    //                 >
    //                   {isFollowing ? "Unfollow" : "Follow"}
    //                 </Button>
    //                 <span className="ml-2">
    //                   {isFriend ? (
    //                     <UserCheck className="text-green-500" size={14} />
    //                   ) : isPending ? (
    //                     <Clock className="text-yellow-500" size={14} />
    //                   ) : (
    //                     <UserPlus
    //                       className="text-gray-500 hover:text-blue-500 cursor-pointer"
    //                       size={14}
    //                       onClick={() => handleAddFriend()}
    //                     />
    //                   )}
    //                 </span>
    //               </div>
    //             )}
    //           </div>
    //           <div className="flex items-center text-xs text-gray-500 mt-1">
    //             <Chip
    //               className="bg-customBlue/10 text-customBlue font-semibold"
    //               size="sm"
    //             >
    //               {article?.category}
    //             </Chip>
    //             <span className="mx-2">•</span>
    //             <span>{new Date(article?.createdAt).toLocaleDateString()}</span>
    //           </div>
    //         </div>
    //       </div>
    //       {/* Toggle content visibility */}
    //       <div className="flex items-center gap-1">
    //         {article?.isPremium && !hasPurchased ? (
    //           <Chip color="warning" variant="flat">
    //             <strong>Premium</strong>
    //           </Chip>
    //         ) : article?.isPremium && hasPurchased ? (
    //           <Chip color="success" variant="flat">
    //             <strong>Purchased</strong>
    //           </Chip>
    //         ) : (
    //           <Chip color="success" variant="flat">
    //             <strong>Free</strong>
    //           </Chip>
    //         )}
    //         {/* Lock icon with premium color */}
    //         {article?.isPremium && !hasPurchased ? (
    //           <Tooltip color="warning" content="You have to buy this article">
    //             <ChevronDown size={20} />
    //           </Tooltip>
    //         ) : (
    //           <Button
    //             isIconOnly
    //             className={`text-gray-500 mt-0 h-8 min-w-unit-6 transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
    //             variant="light"
    //             onPress={toggleContent}
    //           >
    //             {isExpanded ? (
    //               <ChevronUp size={20} />
    //             ) : (
    //               <ChevronDown size={20} />
    //             )}
    //           </Button>
    //         )}
    //       </div>
    //     </div>

    //     <h2 className="text-sm text-customOrange/80 font-semibold mb-2 underline">
    //       {article?.isPremium && !hasPurchased ? (
    //         <Tooltip color="warning" content="Buy to read more">
    //           {article.title}
    //         </Tooltip>
    //       ) : (
    //         <Link href={`/user/article/${article?._id}`}>{article.title}</Link>
    //       )}
    //     </h2>

    //     <div
    //       ref={contentRef}
    //       className={`transition-all duration-700 ease-in-out overflow-hidden ${
    //         isExpanded ? "max-h-[1500px]" : "max-h-[80px]"
    //       }`}
    //     >
    //       <div
    //         style={{
    //           width: "100%",
    //           maxWidth: "100%",
    //           overflowX: "hidden",
    //           wordBreak: "break-word",
    //           overflowWrap: "break-word",
    //         }}
    //         dangerouslySetInnerHTML={{
    //           __html: article.content,
    //         }}
    //       />
    //     </div>
    //   </CardHeader>

    //   {/* Card Body (Image) */}
    //   <CardBody className="p-0 ">
    //     <div className="relative h-64 w-full">
    //       <Image
    //         alt="Article Image"
    //         fill
    //         className="object-cover"
    //         src={article.images || fallbackImage}
    //       />
    //     </div>
    //   </CardBody>
    //   {/* Card Footer */}
    //   <CardFooter className="flex justify-between items-center py-5 text-gray-700">
    //     <div className="flex gap-1">
    //       <Button
    //         size="sm"
    //         startContent={<ArrowUp className="text-green-500" size={16} />}
    //         variant="light"
    //         onClick={handleUpvote}
    //       >
    //         {article.upvotes}
    //       </Button>
    //       <Button
    //         size="sm"
    //         startContent={<ArrowDown className="text-red-500" size={16} />}
    //         variant="light"
    //         onClick={handleDownvote}
    //       >
    //         {article.downvotes}
    //       </Button>
    //       <Button
    //         as={Link}
    //         href={`/user/article/${article._id}`}
    //         isDisabled={article?.isPremium && !hasPurchased}
    //         size="sm"
    //         startContent={
    //           <MessagesSquare className="text-customBlue" size={16} />
    //         }
    //         variant="light"
    //       >
    //         {article?.comments?.length}
    //       </Button>
    //       <Button
    //         disabled={isLoading}
    //         size="sm"
    //         startContent={<Share2 className="text-customBlue" size={16} />}
    //         variant="light"
    //         onClick={handleShare}
    //       >
    //         {isLoading ? "Sharing..." : "Share"} ({article?.shareCount})
    //       </Button>

    //       {/* Reaction Section */}
    //       <div className="">
    //         {/* <EmojiReactionDock onReact={handleReaction} /> */}
    //         <EmojiReactionDock
    //           onReact={handleReaction}
    //           reactionSummary={
    //             article?.reactionSummary || {
    //               like: 0,
    //               love: 0,
    //               haha: 0,
    //               wow: 0,
    //               sad: 0,
    //               angry: 0,
    //             }
    //           } // Default empty reactionSummary
    //         />
    //       </div>
    //     </div>
    //     <div className="flex items-center">
    //       {article.isPremium && !hasPurchased && (
    //         <Button
    //           className="bg-customBlue text-white"
    //           size="sm"
    //           variant="flat"
    //           onClick={() => handleBuyNow()}
    //         >
    //           Buy Now ${article.price.toFixed(2)}
    //         </Button>
    //       )}
    //     </div>
    //   </CardFooter>
    // </Card>

    <Card
      className="w-full mx-auto rounded-lg overflow-hidden bg-white/90 dark:bg-white/5   dark:backdrop-blur-2xl border-none border-steel-blue/10 dark:border-white/10"
      radius="none"
    >
      {/* ── Header ── */}
      <CardHeader className="flex flex-col items-start px-4 sm:px-3.5 pt-4 pb-2">
        {/* Author row */}
        <div className="flex items-center justify-between w-full mb-3 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Avatar
              className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 ring-2 ring-steel-blue/30 dark:ring-steel-blue/20"
              src={authorId?.profilePhoto}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white/90 truncate">
                  {authorId?.name || "Anonymous"}
                </h3>

                {user?._id !== authorId?._id && (
                  <Button
                    className="h-5 min-w-0 px-2 text-[9px] sm:text-[10px] font-semibold rounded-full border border-steel-blue/40 text-steel-blue dark:text-white/90 bg-steel-blue/10 dark:bg-steel-blue/90 hover:bg-steel-blue/50 "
                    size="sm"
                    variant="flat"
                    onClick={handleFollow}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
                {user?._id !== authorId?._id && (
                  <span>
                    {isFriend ? (
                      <UserCheck className="text-green-600" size={13} />
                    ) : isPending ? (
                      <Clock className="text-yellow-500" size={13} />
                    ) : (
                      <UserPlus
                        className="text-gray-400 dark:text-white/30 hover:text-steel-blue dark:hover:text-steel-blue cursor-pointer transition-colors"
                        size={13}
                        onClick={() => handleAddFriend()}
                      />
                    )}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-steel-blue/15 dark:bg-steel-blue/70 text-steel-blue dark:text-white/80">
                  {article?.category}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-white/70">
                  ·
                </span>
                <span className="text-[10px] text-gray-500 dark:text-white/70">
                  {new Date(article?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Premium badge + toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            {article?.isPremium &&
              (!hasPurchased ? (
                <Chip
                  className="text-[10px] font-bold bg-yellow-500/15 text-yellow-500 border border-yellow-500/25"
                  size="sm"
                  variant="flat"
                >
                  Premium
                </Chip>
              ) : (
                <Chip
                  className="text-[10px] font-bold bg-lime-burst/15 text-lime-burst border border-lime-burst/25"
                  size="sm"
                  variant="flat"
                >
                  Purchased
                </Chip>
              ))}

            {article?.isPremium && !hasPurchased ? (
              <Tooltip color="warning" content="You have to buy this article">
                <ChevronDown
                  className="text-gray-400 dark:text-white/30"
                  size={18}
                />
              </Tooltip>
            ) : (
              <Button
                isIconOnly
                className={`w-7 h-7 min-w-0 text-gray-500 dark:text-white/30 hover:text-steel-blue dark:hover:text-white/70 transition-all ${isExpanded ? "rotate-180" : ""}`}
                variant="light"
                onPress={toggleContent}
              >
                {isExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-sm  font-semibold mb-1 leading-snug text-steel-blue dark:text-lime-burst">
          {article?.isPremium && !hasPurchased ? (
            <Tooltip color="warning" content="Buy to read more">
              {article.title}
            </Tooltip>
          ) : (
            <Link
              href={`/user/article/${article?._id}`}
              className="hover:opacity-80 transition-opacity hover:underline"
            >
              {article.title}
            </Link>
          )}
        </h2>

        {/* Content */}
        <div
          ref={contentRef}
          className={`transition-all duration-700 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-[1500px]" : "max-h-[60px]"
          }`}
        >
          <div
            // className="text-xs  text-gray-800 dark:text-white/80 leading-relaxed
            // [&_p]:mb-2 [&_strong]:text-gray-800 [&_strong]:dark:text-white/80
            // [&_a]:text-steel-blue [&_a]:dark:text-lime-burst
            // [&_ul]:pl-4 [&_ol]:pl-4 [&_li]:mb-1"
            className="text-xs leading-relaxed text-gray-600 dark:text-gray-300"
            style={{
              width: "100%",
              maxWidth: "100%",
              overflowX: "hidden",
              wordBreak: "break-word",
              // wordBreak: "normal",
              overflowWrap: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </CardHeader>

      {/* ── Image ── */}
      <CardBody className="p-0">
        <div className="relative h-48 sm:h-52 md:h-56 w-full overflow-hidden">
          <Image
            alt="Article Image"
            fill
            className="object-cover opacity-90 hover:scale-105 transition-transform duration-500"
            src={article.images || fallbackImage}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 70vw"
          />
          {/* Subtle gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </CardBody>

      {/* ── Footer ── */}
      <CardFooter className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 gap-2">
        <div className="flex items-center gap-0.5 flex-wrap">
          <Button
            size="sm"
            className="h-7 min-w-0 px-2 text-gray-600 dark:text-white/50 hover:text-steel-blue dark:hover:text-white/80 text-xs"
            startContent={<ArrowUp className="text-lime-burst" size={14} />}
            variant="light"
            onPress={handleUpvote}
          >
            {article.upvotes}
          </Button>
          <Button
            size="sm"
            className="h-7 min-w-0 px-2 text-gray-600 dark:text-white/50 hover:text-steel-blue dark:hover:text-white/80 text-xs"
            startContent={<ArrowDown className="text-red-500/80" size={14} />}
            variant="light"
            onPress={handleDownvote}
          >
            {article.downvotes}
          </Button>
          <Button
            as={Link}
            href={`/user/article/${article._id}`}
            isDisabled={article?.isPremium && !hasPurchased}
            size="sm"
            className="h-7 min-w-0 px-2 text-gray-600 dark:text-white/50 hover:text-steel-blue dark:hover:text-white/80 text-xs"
            startContent={
              <MessagesSquare className="text-steel-blue" size={14} />
            }
            variant="light"
          >
            {article?.comments?.length}
          </Button>
          <Button
            disabled={isLoading}
            size="sm"
            className="h-7 min-w-0 px-2 text-gray-600 dark:text-white/50 hover:text-steel-blue dark:hover:text-white/80 text-xs"
            startContent={<Share2 className="text-steel-blue" size={14} />}
            variant="light"
            onPress={handleShare}
          >
            {isLoading ? "..." : article?.shareCount}
          </Button>
          <div className="ml-1">
            <EmojiReactionDock
              onReact={handleReaction}
              reactionSummary={
                article?.reactionSummary || {
                  like: 0,
                  love: 0,
                  haha: 0,
                  wow: 0,
                  sad: 0,
                  angry: 0,
                }
              }
            />
          </div>
        </div>

        {article.isPremium && !hasPurchased && (
          <Button
            className="h-7 text-[11px] font-bold px-3 rounded-full bg-lime-burst text-gray-900 hover:bg-lime-burst/80 transition-all"
            size="sm"
            variant="flat"
            onPress={() => handleBuyNow()}
          >
            Buy ${article.price.toFixed(2)}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
