"use client";
import { useState } from "react";
import {
  useGetAllArticlesQuery,
  useDeleteArticleMutation,
  usePublishArticleMutation,
} from "@/src/redux/features/articles/articlesApi";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
} from "@heroui/react";
import { Check, Eye, Trash, UserCheck, UserX, X } from "lucide-react";
import { toast } from "sonner"; // Import Sonner toast
import { TArticle } from "@/src/types";
import AdminArticleView from "./components/viewArticle";

const ArticleManagement = () => {
  const {
    data: allArticles,
    isLoading,
    error,
    refetch,
  } = useGetAllArticlesQuery(undefined);
  const [deleteArticle] = useDeleteArticleMutation();
  const [publishArticle] = usePublishArticleMutation();
  const [selectedArticle, setSelectedArticle] = useState<TArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle View
  const handleView = (articleId: string) => {
    const article = allArticles?.data?.find(
      (art: TArticle) => art._id === articleId,
    );
    if (article) {
      setSelectedArticle(article);
      setIsModalOpen(true);
    } else {
      console.error("Article not found");
    }
  };

  // Handle Delete
  const handleDelete = async (articleId: string) => {
    const toastId = toast("Processing...");
    try {
      await deleteArticle(articleId).unwrap();
      refetch();
      setIsModalOpen(false);
      toast.success("Article deleted successfully", {
        id: toastId,
        className: "text-green-500",
      });
    } catch (error) {
      toast.error("Failed to delete article", {
        id: toastId,
        className: "text-red-500", // Error text color
      });
      console.error("Failed to delete article:", error);
    }
  };

  // Handle Publish/Unpublish
  const handleUpdatePublish = async (
    articleId: string,
    isPublished: boolean,
  ) => {
    const toastId = toast("Processing...");
    try {
      console.log(isPublished, "check");

      await publishArticle({
        articleId,
        publishData: { isPublish: isPublished },
      }).unwrap();
      refetch();
      toast.success(
        `Article ${isPublished ? "published" : "unpublished"} successfully`,
        {
          id: toastId,
          className: "text-green-500", // Success text color
        },
      );
    } catch (error) {
      toast.error(
        `Failed to ${isPublished ? "publish" : "unpublish"} article`,
        {
          id: toastId,
          className: "text-red-500", // Error text color
        },
      );
      console.error(
        `Failed to ${isPublished ? "publish" : "unpublish"} article:`,
        error,
      );
    }
  };

  const handleEdit = (articleId: string) => {
    console.log(`Editing article with ID: ${articleId}`);
  };

  return (
    <div>
      <Card className="mb-8 min-h-[80vh] " radius="none">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black/80">
            Article Management
          </h2>
          <p className="text-gray-500">
            Total Articles: {allArticles?.data?.length || 0}
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          <Table
            aria-label="Article management table"
            className="text-black/80"
          >
            <TableHeader>
              <TableColumn>#</TableColumn>
              <TableColumn>TITLE</TableColumn>
              <TableColumn>AUTHOR</TableColumn>
              <TableColumn>CATEGORY</TableColumn>
              <TableColumn>PREMIUM</TableColumn>
              <TableColumn>PUBLISHED</TableColumn>
              <TableColumn>UPVOTES</TableColumn>
              <TableColumn>DOWNVOTES</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {allArticles?.data?.map((article: TArticle, index: number) => (
                <TableRow key={article._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="text-semibold">
                    {article.title}
                  </TableCell>
                  <TableCell>{article.authorId?.name || "Unknown"}</TableCell>
                  <TableCell>
                    <Chip
                      color={article.category === "Tip" ? "primary" : "warning"}
                      variant="flat"
                    >
                      {article.category}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={article.isPremium ? "success" : "danger"}
                      variant="flat"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {article.isPremium ? (
                        <Check size={16} />
                      ) : (
                        <X size={16} />
                      )}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={article?.isPublish ? "success" : "danger"}
                      variant="flat"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {article?.isPublish ? (
                        <>
                          <Check size={16} />
                        </>
                      ) : (
                        <>
                          <X size={16} />
                        </>
                      )}
                    </Chip>
                  </TableCell>
                  <TableCell>{article.upvotes}</TableCell>
                  <TableCell>{article.downvotes}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tooltip content="View">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleView(article._id)}
                        >
                          <Eye size={14} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => handleDelete(article._id)}
                        >
                          <Trash size={14} />
                        </Button>
                      </Tooltip>
                      {article?.isPublish ? (
                        <Tooltip content="Unpublish">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="warning"
                            onPress={() =>
                              handleUpdatePublish(article._id, false)
                            }
                          >
                            <UserX size={14} />
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Publish">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="success"
                            onPress={() =>
                              handleUpdatePublish(article._id, true)
                            }
                          >
                            <UserCheck size={14} />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal for viewing article details */}
      {selectedArticle && (
        <AdminArticleView
          article={selectedArticle}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ArticleManagement;
