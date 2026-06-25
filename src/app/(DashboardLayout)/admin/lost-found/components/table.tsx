"use client";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Avatar,
  Tooltip,
  Skeleton,
  Pagination,
} from "@heroui/react";
import {
  Trash2,
  CheckCircle,
  Eye,
  MapPin,
  Calendar,
  PawPrint,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";

import { StatusChip } from "./statusChip";

import {
  useAdminDeleteLostFoundPostMutation,
  useAdminMarkLostFoundResolvedMutation,
} from "@/src/redux/features/lostFound/lostFoundApi";

import {
  DeleteConfirmModal,
  useDeleteModal,
} from "../../../components/modal/deleteConfirmModal.tsx";

interface LostFoundTableProps {
  posts: any[];
  isLoading: boolean;
  hasFilters: boolean;
  clearFilters: () => void;
  page: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  limit: number;
  onPageChange: (page: number) => void;
}

const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🦜",
  fish: "🐠",
  rabbit: "🐇",
  reptile: "🦎",
  other: "🐾",
};

const LostFoundTable = ({
  posts,
  isLoading,
  hasFilters,
  clearFilters,
  page,
  total,
  totalPages,
  hasMore,
  limit,
  onPageChange,
}: LostFoundTableProps) => {
  const { isOpen, itemToDelete, openDeleteModal, closeDeleteModal } =
    useDeleteModal();

  const [adminDelete, { isLoading: isDeleting }] =
    useAdminDeleteLostFoundPostMutation();
  const [adminResolve, { isLoading: isResolving }] =
    useAdminMarkLostFoundResolvedMutation();

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    await adminDelete(itemToDelete.id);
    closeDeleteModal();
  };

  const handleResolve = async (post: any) => {
    const toastId = toast.loading("Resolving...");
    try {
      await adminResolve(post._id);
      toast.success("Post marked as resolved", { id: toastId });
    } catch {
      toast.error("Failed to resolve", { id: toastId });
    }
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div>
      <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 rounded-md flex flex-col">
        <CardHeader className="px-5 pt-4 pb-0 flex items-center justify-between shrink-0">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            All Posts
            <span className="ml-2 text-xs font-normal text-zinc-400">
              {isLoading ? "loading..." : `${total} results`}
            </span>
          </p>
        </CardHeader>

        <CardBody className="p-0 overflow-hidden flex-1 flex flex-col min-h-[700px]">
          {isLoading ? (
            <div className="p-4 space-y-1 flex-1">
              {Array(limit)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-md" />
                ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-16">
              <div className="text-center">
                <PawPrint className="size-10 mx-auto text-zinc-200 dark:text-zinc-700 mb-3" />
                <p className="text-sm text-zinc-400">No posts found</p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-xs text-steel-blue dark:text-lime-burst"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/*  Table wrapper  */}
              <div className="flex-1 overflow-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="sticky top-0 bg-white dark:bg-zinc-900 z-10">
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      {[
                        "#",
                        "Pet",
                        "Posted By",
                        "Location",
                        "Date",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-semibold text-zinc-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post: any, index: number) => {
                      const serialNumber = (page - 1) * limit + index + 1;

                      return (
                        <tr
                          key={post._id}
                          className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                              {serialNumber}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="size-9 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 flex items-center justify-center">
                                {post.photos?.[0] ? (
                                  <img
                                    src={post.photos[0]}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-lg">
                                    {SPECIES_EMOJI[
                                      post.species?.toLowerCase()
                                    ] ?? "🐾"}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                  {post.petName || `${post.species} (unnamed)`}
                                </p>
                                <p className="text-[10px] text-zinc-400 capitalize">
                                  {post.species} ·{" "}
                                  {post.breed || "unknown breed"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar
                                size="sm"
                                name={post.postedBy?.name?.charAt(0) || "U"}
                                src={post.postedBy?.profilePhoto}
                                classNames={{
                                  base: "bg-steel-blue/20 size-7",
                                  name: "text-steel-blue text-xs font-bold",
                                }}
                              />
                              <div>
                                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                  {post.posterName || post.postedBy?.name}
                                </p>
                                <p className="text-[10px] text-zinc-400">
                                  {post.postedBy?.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                              <MapPin className="size-3 shrink-0" />
                              <span>
                                {post.area ? `${post.area}, ` : ""}
                                {post.emirate}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                              <Calendar className="size-3 shrink-0" />
                              <span>
                                {format(new Date(post.createdAt), "dd MMM yy")}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <StatusChip status={post.status} type={post.type} />
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Tooltip content="View post">
                                <Button
                                  as={Link}
                                  href={`/admin/lost-found/${post._id}`}
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  className="text-zinc-400 hover:text-steel-blue dark:hover:text-lime-burst"
                                >
                                  <Eye className="size-3.5" />
                                </Button>
                              </Tooltip>

                              {post.status !== "resolved" && (
                                <Tooltip content="Force resolve">
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onPress={() => handleResolve(post)}
                                    isLoading={isResolving}
                                    className="text-zinc-400 hover:text-emerald-500"
                                  >
                                    <CheckCircle className="size-3.5" />
                                  </Button>
                                </Tooltip>
                              )}

                              <Tooltip content="Delete post" color="danger">
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  onPress={() =>
                                    openDeleteModal(
                                      post._id,
                                      post.petName || "this post",
                                      "post",
                                    )
                                  }
                                  className="text-zinc-400 hover:text-red-500"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* pagination  */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 flex-wrap gap-2 shrink-0 bg-white dark:bg-zinc-900">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Showing {startItem} to {endItem} of {total} results
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    isDisabled={page <= 1}
                    onPress={() => onPageChange(page - 1)}
                    startContent={<ChevronLeft className="size-3.5" />}
                    className="text-xs min-w-0 px-2"
                  >
                    Previous
                  </Button>

                  <Pagination
                    size="sm"
                    page={page}
                    total={totalPages}
                    onChange={onPageChange}
                    showControls={false}
                    classNames={{
                      cursor:
                        "bg-steel-blue text-white dark:bg-lime-burst dark:text-zinc-900",
                    }}
                  />

                  <Button
                    size="sm"
                    variant="flat"
                    isDisabled={!hasMore}
                    onPress={() => onPageChange(page + 1)}
                    endContent={<ChevronRight className="size-3.5" />}
                    className="text-xs min-w-0 px-2"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        entityName={itemToDelete?.name}
        entityType={itemToDelete?.type || "post"}
        isLoading={isDeleting}
        deleteVariant="danger"
      />
    </div>
  );
};

export default LostFoundTable;
