"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Chip,
} from "@heroui/react";
import { ArrowUp, ArrowDown, MessagesSquare } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import fallbackImage from "@/src/assets/images/fallback.jpg";
import { useVoteArticleMutation } from "@/src/redux/features/articles/articlesApi";
import { useFollowUserMutation } from "@/src/redux/features/user/userApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { TArticle } from "@/src/types";

const ArticleDetailsCard = ({ articleInfo }: { articleInfo: TArticle }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [voteArticle] = useVoteArticleMutation();
  const [followUser] = useFollowUserMutation();
  const user = useAppSelector(useCurrentUser);
  const [article, setArticle] = useState(articleInfo);

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
    const toastId = toast("Processing...");

    try {
      const result = await followUser({
        followUserId: article.authorId._id,
      }).unwrap();

      if (result.success) {
        setIsFollowing((prev) => !prev);

        toast.success(
          isFollowing ? "Unfollowed this user." : "Following this user!",
          {
            id: toastId,
            className: "text-green-500",
          },
        );
      }
    } catch (error) {
      toast.error("Failed to process the follow/unfollow action.", {
        id: toastId,
        className: "text-red-500",
      });
      console.error("Failed to follow/unfollow:", error);
    }
  };
  // console.log(article);

  return (
    <div>
      <Card
        className="max-w-full mx-auto text-black/80 text-sm bg-white shadow-lg"
        radius="none"
      >
        {/* Card Header */}
        <CardHeader className="flex flex-col items-start p-5">
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center w-full mb-3">
              <Avatar
                className="w-12 h-12"
                src={article?.authorId?.profilePhoto}
              />
              <div className="ml-3 flex-grow">
                <div className="flex gap-6 items-end">
                  <h3 className="text-base font-bold">
                    {article?.authorId?.name || "Anonymous"}
                  </h3>
                  {user?._id !== article?.authorId?._id && (
                    <Button
                      className="mr-2 text-xs h-6 min-w-unit-16 bg-customBlue text-white"
                      color="primary"
                      size="sm"
                      onClick={handleFollow}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Chip
                    className="bg-customBlue/10 text-customBlue font-semibold"
                    size="sm"
                  >
                    {article?.category}
                  </Chip>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(article?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start mr-2">
              {article?.isPremium ? (
                <Chip color="warning" variant="flat">
                  <strong>Premium</strong>
                </Chip>
              ) : (
                <Chip color="success" variant="flat">
                  <strong>Free</strong>
                </Chip>
              )}
            </div>
          </div>

          <h2 className="text-base text-customOrange/80 font-semibold mb-2">
            {article.title}
          </h2>

          {/* Show full article content */}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </CardHeader>

        {/* Card Body (Image) */}
        <CardBody className="p-0">
          <div className="relative h-72 w-full">
            <Image
              alt="Article Image"
              layout="fill"
              objectFit="cover"
              src={article.images || fallbackImage}
            />
          </div>
        </CardBody>

        {/* Card Footer */}
        <CardFooter className="flex justify-between items-center p-5 text-gray-700">
          <div className="flex space-x-3">
            <Button
              size="sm"
              startContent={<ArrowUp className="text-green-500" size={16} />}
              variant="light"
              onClick={handleUpvote}
            >
              {article.upvotes}
            </Button>
            <Button
              size="sm"
              startContent={<ArrowDown className="text-red-500" size={16} />}
              variant="light"
              onClick={handleDownvote}
            >
              {article.downvotes}
            </Button>
            <Button
              as={Link}
              href={`/user/article/${article._id}`}
              size="sm"
              startContent={
                <MessagesSquare className="text-customBlue" size={16} />
              }
              variant="light"
            >
              {article?.comments.length}
            </Button>
          </div>

          <div className="flex items-center">
            {article.isPremium && (
              <Button
                className="bg-customBlue text-white"
                size="sm"
                variant="flat"
              >
                Buy Now ${article.price.toFixed(2)}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ArticleDetailsCard;
