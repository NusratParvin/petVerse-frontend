"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash,
  ArrowUp,
  ArrowDown,
  MessagesSquare,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import EditArticleForm from "./editArticle";

import fallbackImage from "@/src/assets/images/fallback.jpg";
import { TArticle } from "@/src/types";
import {
  useVoteArticleMutation,
  useGetMyArticlesQuery,
  useDeleteArticleMutation,
} from "@/src/redux/features/articles/articlesApi";

const ArticleCardManage = ({ article }: { article: TArticle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Using useDisclosure to manage modal state
  const contentRef = useRef<HTMLDivElement>(null);
  const [voteArticle] = useVoteArticleMutation();
  const [deleteArticle] = useDeleteArticleMutation();

  const { refetch } = useGetMyArticlesQuery(undefined);
  const router = useRouter();

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteArticle(article._id).unwrap();
      toast.success("Article deleted successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to delete article. Please try again.");
      console.error("Failed to delete article:", error);
    }
  };

  const handleUpvote = async () => {
    try {
      await voteArticle({
        articleId: article._id,
        voteType: "upvote",
      }).unwrap();
      refetch();
      toast.success("Article upvoted!");
    } catch (error) {
      toast.error("Failed to upvote article.");
      console.error("Failed to upvote:", error);
    }
  };

  const handleDownvote = async () => {
    try {
      await voteArticle({
        articleId: article._id,
        voteType: "downvote",
      }).unwrap();
      refetch();
      toast.success("Article downvoted!");
    } catch (error) {
      toast.error("Failed to downvote article.");
      console.error("Failed to downvote:", error);
    }
  };

  if (isEditing) {
    return <EditArticleForm article={article} onCancel={handleCancelEdit} />;
  }

  return (
    <>
      <Card
        className="w-full mx-auto text-black/80 text-sm bg-white shadow-lg "
        radius="none"
      >
        {/* Card Header */}
        <CardHeader className="flex flex-col items-start p-5">
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center w-full mb-3">
              <Avatar
                className="w-12 h-12"
                src={article.authorId?.profilePhoto}
              />
              <div className="ml-3 flex-grow">
                <h3 className="text-base font-bold">
                  {article.authorId?.name || "Anonymous"}
                </h3>
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

            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                className="text-gray-500"
                variant="light"
                onClick={handleEdit}
              >
                <Edit size={14} />
              </Button>
              <Button
                isIconOnly
                className="text-red-500"
                variant="light"
                onClick={onOpen}
              >
                <Trash size={14} />
              </Button>
              <Button
                isIconOnly
                className={`text-gray-500 h-8 min-w-unit-6 transform transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                variant="light"
                onClick={toggleContent}
              >
                {isExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </Button>
            </div>
          </div>

          <h2 className="text-base text-customOrange/80 font-semibold mb-2 underline">
            <Link href={`/user/article/${article._id}`}>{article.title}</Link>
          </h2>

          <div
            ref={contentRef}
            className={`transition-all duration-700 ease-in-out overflow-hidden ${
              isExpanded ? "max-h-[1500px]" : "max-h-[80px]"
            }`}
          >
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </CardHeader>

        {/* Card Body (Image) */}
        <CardBody className="p-0">
          <div className="relative h-64 w-full">
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
              {article?.comments?.length}
            </Button>
          </div>

          <div className="flex items-center">
            {article.isPremium ? (
              <Chip color="warning" variant="flat">
                Premium - ${article.price?.toFixed(2)}
              </Chip>
            ) : (
              <Chip color="success" variant="flat">
                Free
              </Chip>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Article
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this article?</p>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-blue-300" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onClick={() => {
                    handleDelete();
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ArticleCardManage;
