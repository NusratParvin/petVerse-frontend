// "use client";
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Avatar,
//   Button,
//   Chip,
// } from "@heroui/react";
// import { ArrowUp, ArrowDown, MessagesSquare } from "lucide-react";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { toast } from "sonner";

// import fallbackImage from "@/src/assets/images/fallback.jpg";
// import { useVoteArticleMutation } from "@/src/redux/features/articles/articlesApi";
// import { useFollowUserMutation } from "@/src/redux/features/user/userApi";
// import { useAppSelector } from "@/src/redux/hooks";
// import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
// import { TArticle } from "@/src/types";

// const ArticleDetailsCard = ({ articleInfo }: { articleInfo: TArticle }) => {
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [voteArticle] = useVoteArticleMutation();
//   const [followUser] = useFollowUserMutation();
//   const user = useAppSelector(useCurrentUser);
//   const [article, setArticle] = useState(articleInfo);

//   useEffect(() => {
//     if (article && article.authorId) {
//       const alreadyFollowing = article?.authorId?.followers?.includes(
//         user?._id as string,
//       );

//       setIsFollowing(alreadyFollowing || false);
//     }
//   }, [article, user]);

//   const handleUpvote = async () => {
//     try {
//       const res = await voteArticle({
//         articleId: article._id,
//         voteType: "upvote",
//       }).unwrap();

//       setArticle(res.data);
//     } catch (error) {
//       console.error("Failed to upvote:", error);
//     }
//   };

//   const handleDownvote = async () => {
//     try {
//       const res = await voteArticle({
//         articleId: article._id,
//         voteType: "downvote",
//       }).unwrap();

//       setArticle(res.data);
//     } catch (error) {
//       console.error("Failed to downvote:", error);
//     }
//   };

//   const handleFollow = async () => {
//     const toastId = toast("Processing...");

//     try {
//       const result = await followUser({
//         followUserId: article.authorId._id,
//       }).unwrap();

//       if (result.success) {
//         setIsFollowing((prev) => !prev);

//         toast.success(
//           isFollowing ? "Unfollowed this user." : "Following this user!",
//           {
//             id: toastId,
//             className: "text-green-500",
//           },
//         );
//       }
//     } catch (error) {
//       toast.error("Failed to process the follow/unfollow action.", {
//         id: toastId,
//         className: "text-red-500",
//       });
//       console.error("Failed to follow/unfollow:", error);
//     }
//   };
//   // console.log(article);

//   return (
//     <div>
//       <Card
//         className="w-full mx-auto text-black/80 text-sm bg-white shadow-lg"
//         radius="none"
//       >
//         {/* Card Header */}
//         <CardHeader className="flex flex-col items-start p-5">
//           <div className="flex justify-between items-start w-full">
//             <div className="flex items-center w-full mb-3">
//               <Avatar
//                 className="w-12 h-12"
//                 src={article?.authorId?.profilePhoto}
//               />
//               <div className="ml-3 flex-grow">
//                 <div className="flex gap-6 items-end">
//                   <h3 className="text-base font-bold">
//                     {article?.authorId?.name || "Anonymous"}
//                   </h3>
//                   {user?._id !== article?.authorId?._id && (
//                     <Button
//                       className="mr-2 text-xs h-6 min-w-unit-16 bg-customBlue text-white"
//                       color="primary"
//                       size="sm"
//                       onClick={handleFollow}
//                     >
//                       {isFollowing ? "Unfollow" : "Follow"}
//                     </Button>
//                   )}
//                 </div>
//                 <div className="flex items-center text-xs text-gray-500 mt-1">
//                   <Chip
//                     className="bg-customBlue/10 text-customBlue font-semibold"
//                     size="sm"
//                   >
//                     {article?.category}
//                   </Chip>
//                   <span className="mx-2">•</span>
//                   <span>
//                     {new Date(article?.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-start mr-2">
//               {article?.isPremium ? (
//                 <Chip color="warning" variant="flat">
//                   <strong>Premium</strong>
//                 </Chip>
//               ) : (
//                 <Chip color="success" variant="flat">
//                   <strong>Free</strong>
//                 </Chip>
//               )}
//             </div>
//           </div>

//           <h2 className="text-base text-customOrange/80 font-semibold mb-2">
//             {article.title}
//           </h2>

//           {/* Show full article content */}
//           <div dangerouslySetInnerHTML={{ __html: article.content }} />
//         </CardHeader>

//         {/* Card Body (Image) */}

//         <CardBody className="p-0">
//           <div className="relative h-72 w-full">
//             <Image
//               alt="Article Image"
//               fill
//               className="object-cover"
//               src={article.images || fallbackImage}
//               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             />
//           </div>
//         </CardBody>

//         {/* Card Footer */}
//         <CardFooter className="flex justify-between items-center p-5 text-gray-700">
//           <div className="flex space-x-3">
//             <Button
//               size="sm"
//               startContent={<ArrowUp className="text-green-500" size={16} />}
//               variant="light"
//               onClick={handleUpvote}
//             >
//               {article.upvotes}
//             </Button>
//             <Button
//               size="sm"
//               startContent={<ArrowDown className="text-red-500" size={16} />}
//               variant="light"
//               onClick={handleDownvote}
//             >
//               {article.downvotes}
//             </Button>
//             <Button
//               as={Link}
//               href={`/user/article/${article._id}`}
//               size="sm"
//               startContent={
//                 <MessagesSquare className="text-customBlue" size={16} />
//               }
//               variant="light"
//             >
//               {article?.comments.length}
//             </Button>
//           </div>

//           <div className="flex items-center">
//             {article.isPremium && (
//               <Button
//                 className="bg-customBlue text-white"
//                 size="sm"
//                 variant="flat"
//               >
//                 Buy Now ${article.price.toFixed(2)}
//               </Button>
//             )}
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// export default ArticleDetailsCard;

"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Avatar,
  Divider,
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowUp,
  ArrowDown,
  MessagesSquare,
  BookOpen,
  Lightbulb,
  Sparkles,
  PawPrint,
  Heart,
  Share2,
  BookmarkPlus,
  Clock,
  User,
} from "lucide-react";

import fallbackImage from "@/src/assets/images/fallback.jpg";
import { useVoteArticleMutation } from "@/src/redux/features/articles/articlesApi";
import { useFollowUserMutation } from "@/src/redux/features/user/userApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { TArticle } from "@/src/types";

interface ArticleDetailsCardProps {
  articleInfo: TArticle;
}

export default function ArticleDetailsCard({
  articleInfo,
}: ArticleDetailsCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [voteArticle] = useVoteArticleMutation();
  const [followUser] = useFollowUserMutation();
  const user = useAppSelector(useCurrentUser);
  const [article, setArticle] = useState(articleInfo);

  const isTip = article?.category === "Tip";
  const isOwnPost = user?._id === article?.authorId?._id;
  const readMins = Math.max(
    2,
    Math.ceil((article?.content?.length || 200) / 200),
  );

  useEffect(() => {
    if (article && article.authorId) {
      const alreadyFollowing = article?.authorId?.followers?.includes(
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
    } catch (error) {
      console.error("Failed to upvote:", error);
    }
  };

  const handleDownvote = async () => {
    try {
      const res = await voteArticle({
        articleId: article._id,
        voteType: "downvote",
      }).unwrap();
      setArticle(res.data);
    } catch (error) {
      console.error("Failed to downvote:", error);
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
        toast.success(isFollowing ? "Unfollowed" : "Following!", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Failed to follow/unfollow", { id: toastId });
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl px-4 py-8">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-steel-blue/5 blur-3xl" />
        <div className="absolute bottom-20 -right-20 h-72 w-72 rounded-full bg-lime-burst/5 blur-3xl" />
      </div>

      <Card className="relative w-full overflow-hidden border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-zinc-900/80">
        {/* Premium banner */}
        {article?.isPremium && (
          <div className="absolute top-0 right-0 z-20">
            <div className="flex items-center gap-1 rounded-bl-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
              <Sparkles className="h-3 w-3" />
              PREMIUM
            </div>
          </div>
        )}

        {/* Hero Image */}
        <div className="relative h-64 w-full overflow-hidden md:h-96">
          {article?.images ? (
            <>
              <Image
                src={article.images}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-steel-blue/20 to-lime-burst/20">
              <PawPrint className="h-20 w-20 text-steel-blue/40 dark:text-lime-burst/40" />
            </div>
          )}

          {/* Category badge on image */}
          <div className="absolute bottom-4 left-4 z-10">
            <Chip
              size="sm"
              className="bg-black/60 text-white backdrop-blur-sm"
              startContent={
                isTip ? (
                  <Lightbulb className="h-3 w-3" />
                ) : (
                  <BookOpen className="h-3 w-3" />
                )
              }
            >
              {article?.category || "Story"}
            </Chip>
          </div>
        </div>

        <CardHeader className="flex flex-col items-start gap-5 p-6 md:p-8">
          {/* Author section */}
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={article?.authorId?.profilePhoto}
                className="h-12 w-12 ring-2 ring-steel-blue/20 dark:ring-lime-burst/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {article?.authorId?.name || "Anonymous"}
                  </h3>
                  {!isOwnPost && (
                    <Button
                      size="sm"
                      variant="light"
                      onPress={handleFollow}
                      className={`h-7 px-3 text-xs font-medium ${
                        isFollowing
                          ? "text-steel-blue dark:text-lime-burst"
                          : "bg-steel-blue text-white dark:bg-lime-burst dark:text-black"
                      }`}
                    >
                      {isFollowing ? "Following" : "+ Follow"}
                    </Button>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {article?.authorId?.followers?.length || 0} followers
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(article?.createdAt).toLocaleDateString(
                      undefined,
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                  <span>{readMins} min read</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => setIsBookmarked(!isBookmarked)}
                className="text-zinc-500 hover:text-steel-blue dark:hover:text-lime-burst"
              >
                <BookmarkPlus
                  className={`h-4 w-4 ${isBookmarked ? "fill-steel-blue text-steel-blue dark:fill-lime-burst dark:text-lime-burst" : ""}`}
                />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-zinc-500 hover:text-steel-blue dark:hover:text-lime-burst"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 md:text-4xl lg:text-5xl dark:text-zinc-50">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            {article?.excerpt ||
              "A heartfelt story about our beloved pets and the joy they bring to our lives."}
          </p>
        </CardHeader>

        <Divider className="opacity-30" />

        {/* Content */}
        <CardBody className="p-6 md:p-8">
          <article
            className="prose prose-lg prose-zinc mx-auto dark:prose-invert
              prose-headings:font-bold prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-zinc-600 dark:prose-p:text-zinc-300
              prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-steel-blue prose-a:no-underline hover:prose-a:underline
              prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100
              prose-img:rounded-xl prose-img:shadow-md prose-img:my-6
              prose-blockquote:border-l-steel-blue prose-blockquote:pl-4 prose-blockquote:italic
              prose-code:bg-zinc-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded dark:prose-code:bg-zinc-800
              prose-pre:bg-zinc-900 prose-pre:text-zinc-100
              max-w-none
              [&_img]:w-full [&_img]:h-auto
              [&_iframe]:w-full [&_iframe]:aspect-video
              [&_table]:w-full [&_table]:overflow-x-auto [&_table]:block"
            dangerouslySetInnerHTML={{ __html: article?.content || "" }}
          />
        </CardBody>

        <Divider className="opacity-30" />

        {/* Footer Actions */}
        <CardFooter className="flex flex-wrap items-center justify-between gap-4 p-6 md:p-8">
          <div className="flex items-center gap-3">
            {/* Upvote */}
            <Button
              size="md"
              variant="flat"
              onPress={handleUpvote}
              startContent={<ArrowUp className="h-4 w-4" />}
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400"
            >
              {article.upvotes}
            </Button>

            {/* Downvote */}
            <Button
              size="md"
              variant="flat"
              onPress={handleDownvote}
              startContent={<ArrowDown className="h-4 w-4" />}
              className="bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400"
            >
              {article.downvotes}
            </Button>

            {/* Comments */}
            <Button
              size="md"
              variant="flat"
              as={Link}
              href={`/user/article/${article._id}#comments`}
              startContent={<MessagesSquare className="h-4 w-4" />}
              className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300"
            >
              {article?.comments?.length || 0} comments
            </Button>
          </div>

          {article.isPremium && (
            <Button
              size="md"
              className="bg-gradient-to-r from-steel-blue to-steel-blue/80 font-semibold text-white shadow-lg transition-all hover:shadow-xl dark:from-lime-burst dark:to-lime-burst/80 dark:text-black"
              startContent={<Heart className="h-4 w-4" />}
            >
              Support ${article.price?.toFixed(2)}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
