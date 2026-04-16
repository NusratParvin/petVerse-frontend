"use client";
import { useState, useEffect } from "react";
import { Card, CardBody, Button, Avatar, Chip } from "@heroui/react";
import {
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  MessageSquareText,
  MessagesSquare,
} from "lucide-react";
import Image from "next/image";

import fallbackImage from "@/src/assets/images/fish-2333.gif";
import { useVoteArticleMutation } from "@/src/redux/features/articles/articlesApi";
import { TArticle } from "@/src/types";
import { useFollowUserMutation } from "@/src/redux/features/user/userApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";

export default function SingleArticleCard({ article }: { article: TArticle }) {
  const { authorId } = article;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [voteArticle] = useVoteArticleMutation();
  const [followUser] = useFollowUserMutation();

  const user = useAppSelector(useCurrentUser);

  // const fallbackImage = "/src/assets/images/fish-2333.gif";
  useEffect(() => {
    const alreadyFollowing = article?.authorId?.followers?.includes(
      user?._id as string,
    );

    setIsFollowing(alreadyFollowing || false);
  }, [article, user]);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

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

  return (
    <Card className="max-w-full bg-secondary/30 text-black/70 rounded-sm">
      <CardBody className="py-2">
        <div className="flex items-start ">
          {/* Thumbnail */}
          {/* <div className="w-36 h-32 relative  flex items-center justify-center mr-3">
            <Image
              alt="Thumbnail"
              className="rounded-md "
              layout="fill"
              objectFit="cover"
              src={article.images || fallbackImage}
            />
          </div> */}

          <div className="w-28 h-32 relative flex items-center justify-center mr-3">
            <Image
              alt="Thumbnail"
              className="rounded-md "
              layout="fill" // Ensures the image fills the parent container
              objectFit="cover" // Ensures the image covers the div without distortion
              src={article.images || fallbackImage}
              // width={100} // Set a consistent width
              // height={128} // Set a consistent height
              style={{ minWidth: "100px", minHeight: "128px" }} // Ensures the image div has a consistent size
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="flex justify-between ">
              <div className="flex items-center justify-end mb-1">
                <Avatar
                  className="mr-1 bg-primary/30 w-6 h-6"
                  src={authorId?.profilePhoto || "/placeholder.svg"}
                />
                <span className="text-xs font-semibold mr-2">
                  {authorId?.name || "Anonymous"}
                </span>

                {/* Follow/Unfollow Button */}
                <Button
                  className="mr-2 text-xs h-5 min-w-unit-16 bg-customBlue text-white"
                  color="primary"
                  size="sm"
                  onClick={handleFollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
                <span className="text-xs text-gray-500">
                  • {new Date(article?.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-xs text-gray-500">
                  <Chip
                    className="mr-2 text-xs h-5 min-w-unit-16 bg-customOrange text-white"
                    variant="shadow"
                  >
                    • {article?.category}
                  </Chip>
                </span>
                {/* Toggle button for expanding/collapsing content */}
                <Button
                  isIconOnly
                  className={`text-gray-500 mt-0  h-5 min-w-unit-6 transform transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  variant="light"
                  onPress={toggleContent}
                >
                  {isExpanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </Button>
              </div>
            </div>

            <h2 className="text-base text-cyan-800 font-medium mb-1">
              {article.title}
            </h2>

            {/* Conditionally render the content */}
            <div
              className={`text-xs text-gray-500 ${
                isExpanded ? "whitespace-normal" : "line-clamp-1"
              }`}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: isExpanded
                    ? article.content
                    : `<div>${article.content.slice(0, 150)}...</div>`,
                }}
              />
            </div>

            <div className="flex items-center text-xs text-gray-400 mt-2">
              <Button
                isIconOnly
                className="text-green-500 mr-1"
                size="sm"
                variant="light"
                onPress={handleUpvote}
              >
                <ArrowUp size={16} />
                <span className="mr-1 font-bold text-black/70">
                  {article.upvotes}
                </span>
              </Button>
              <Button
                isIconOnly
                className="text-red-500 mr-4"
                size="sm"
                variant="light"
                onPress={handleDownvote}
              >
                <ArrowDown size={16} />{" "}
                <span className="mr-1 font-bold text-black/70">
                  {article.downvotes}
                </span>
              </Button>
              <Button
                className="mr-4 text-customBlue"
                size="sm"
                startContent={<MessagesSquare size={14} />}
                variant="light"
              >
                <span className="text-black/80">
                  {article.comments.length} comments
                </span>
              </Button>
              <Button
                className="mr-4 text-gray-700"
                size="sm"
                startContent={<MessageSquareText size={14} />}
                variant="light"
              >
                Add Comment
              </Button>
              {article?.isPremium ? (
                <>
                  <Button
                    className="mr-4 text-gray-700  font-bold"
                    size="sm"
                    variant="light"
                  >
                    7 USD
                  </Button>

                  <Button
                    className="mr-4 text-gray-700 bg-customBlue"
                    size="sm"
                    variant="light"
                  >
                    Buy Now{" "}
                  </Button>
                </>
              ) : (
                <Button
                  disableAnimation
                  disabled
                  className="mr-4 text-customOrange  font-semibold"
                  size="sm"
                  variant="light"
                >
                  Free
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
