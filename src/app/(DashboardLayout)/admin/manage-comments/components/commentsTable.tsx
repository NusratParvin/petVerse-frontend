"use client";

import { useCallback, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { EllipsisVertical } from "lucide-react";
import {
  useDeleteCommentMutation,
  useRestoreCommentMutation,
  useMarkHelpfulLeadMutation,
} from "@/src/redux/features/comments/commentsApi";
import { toast } from "sonner";

const columns = [
  { name: "#", uid: "index" },
  { name: "COMMENTER", uid: "commenter" },
  { name: "CONTENT", uid: "content" },
  { name: "TYPE", uid: "targetType" },
  { name: "BADGES", uid: "badges" },
  { name: "DATE", uid: "date" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

type CommentsTableProps = {
  comments: any[];
  total: number;
  page: number;
  pages: number;
  isLoading: boolean;
  isFetching: boolean;
  onPageChange: (p: number) => void;
  refetchComments: () => void;
};

export default function CommentsTable({
  comments,
  total,
  page,
  pages,
  isLoading,
  isFetching,
  onPageChange,
  refetchComments,
}: CommentsTableProps) {
  const [deleteComment] = useDeleteCommentMutation();
  const [restoreComment] = useRestoreCommentMutation();
  const [markHelpfulLead] = useMarkHelpfulLeadMutation();

  // ✅ Track loading state per comment
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleDelete = async (commentId: string) => {
    setActionLoading(commentId);
    const toastId = toast.loading("Deleting comment...");

    try {
      await deleteComment(commentId).unwrap();
      toast.success("Comment deleted!", { id: toastId });
      refetchComments();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async (commentId: string) => {
    setActionLoading(commentId);
    const toastId = toast.loading("Restoring comment...");

    try {
      await restoreComment(commentId).unwrap();
      toast.success("Comment restored!", { id: toastId });
      refetchComments();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to restore", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkHelpful = async (
    commentId: string,
    currentValue: boolean,
  ) => {
    setActionLoading(commentId);
    const newValue = !currentValue;
    const toastId = toast.loading(
      newValue ? "Marking as helpful..." : "Removing helpful mark....",
    );

    try {
      await markHelpfulLead({
        commentId,
        isHelpfulLead: newValue,
      }).unwrap();
      toast.success(
        newValue ? "Marked as helpful lead!" : "Removed helpful mark",
        { id: toastId },
      );
      refetchComments();
    } catch (error: any) {
      toast.error(error?.data?.message || "Action failed", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const renderCell = useCallback(
    (comment: any, columnKey: string | number) => {
      const isLoading = actionLoading === comment._id;

      switch (columnKey) {
        case "index":
          return (
            <span className="text-[11px] text-zinc-400">
              {comments.indexOf(comment) + 1 + (page - 1) * 10}
            </span>
          );

        case "commenter":
          return (
            <div className="flex items-center gap-2">
              <img
                src={
                  comment.commenter.profilePhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.commenter.name)}&size=28&background=0D8F81&color=fff`
                }
                className="size-6 rounded-full flex-shrink-0"
                alt={comment.commenter.name}
              />
              <span className="text-[11px] text-zinc-700 dark:text-zinc-200">
                {comment.commenter.name}
              </span>
            </div>
          );

        case "content":
          return (
            <p
              className={`text-[11px] max-w-[220px] truncate ${
                comment.isDeleted
                  ? "line-through text-zinc-400"
                  : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              {comment.content}
            </p>
          );

        case "targetType":
          return (
            <Chip
              size="sm"
              variant="flat"
              className="text-[10px]"
              color={comment.targetType === "Article" ? "primary" : "warning"}
            >
              {comment.targetType === "Article" ? "Article" : "Lost & Found"}
            </Chip>
          );

        case "badges":
          return (
            <div className="flex gap-1 flex-wrap">
              {comment.isSighting && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  sighting
                </span>
              )}
              {comment.isHelpfulLead && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                  helpful ✓
                </span>
              )}
              {comment.parentId && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                  reply
                </span>
              )}
            </div>
          );

        case "date":
          return (
            <span className="text-[10px] text-zinc-400">
              {new Date(comment.createdAt).toLocaleDateString("en-AE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          );

        case "status":
          return (
            <Chip
              size="sm"
              variant="flat"
              color={comment.isDeleted ? "danger" : "success"}
              className="text-[10px]"
            >
              {comment.isDeleted ? "Deleted" : "Active"}
            </Chip>
          );

        case "actions":
          return (
            <div className="flex justify-end">
              {isLoading ? (
                <Spinner size="sm" color="primary" />
              ) : (
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <EllipsisVertical className="size-4 text-zinc-400" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    {comment.isDeleted ? (
                      <DropdownItem
                        key="restore"
                        onPress={() => handleRestore(comment._id)}
                      >
                        Restore
                      </DropdownItem>
                    ) : (
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        onPress={() => handleDelete(comment._id)}
                      >
                        Delete
                      </DropdownItem>
                    )}
                    {comment.isSighting && !comment.isDeleted && (
                      <DropdownItem
                        key="helpful"
                        onPress={() =>
                          handleMarkHelpful(comment._id, comment.isHelpfulLead)
                        }
                      >
                        {comment.isHelpfulLead
                          ? "Unmark helpful lead"
                          : "Mark helpful lead"}
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          );

        default:
          return null;
      }
    },
    [
      comments,
      page,
      actionLoading,
      handleDelete,
      handleRestore,
      handleMarkHelpful,
    ],
  );

  return (
    <Table
      isHeaderSticky
      aria-label="Comments table"
      classNames={{
        wrapper:
          "h-[700px] bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/60 rounded-md shadow-sm dark:shadow-primary",
        th: "text-[10px] bg-zinc-50 dark:bg-zinc-800/60",
        td: "py-2",
      }}
      bottomContent={
        <div className="flex justify-between items-center px-2 py-2">
          <span className="text-[11px] text-zinc-400">{total} comments</span>
          <Pagination
            isCompact
            showControls
            color="primary"
            page={page}
            total={pages}
            onChange={onPageChange}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="flat"
              isDisabled={page <= 1}
              onPress={() => onPageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="flat"
              isDisabled={page >= pages}
              onPress={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      }
      bottomContentPlacement="outside"
    >
      <TableHeader columns={columns}>
        {(col) => (
          <TableColumn
            key={col.uid}
            align={col.uid === "actions" ? "end" : "start"}
          >
            {col.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={comments}
        loadingContent={<Spinner size="sm" />}
        loadingState={isLoading || isFetching ? "loading" : "idle"}
        emptyContent="No comments found"
      >
        {(item: any) => (
          <TableRow
            key={item._id}
            className={item.isDeleted ? "opacity-60" : ""}
          >
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
