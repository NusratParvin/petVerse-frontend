"use client";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Avatar,
  Tooltip,
  Skeleton,
} from "@heroui/react";
import {
  Trash2,
  CheckCircle,
  Eye,
  MapPin,
  Calendar,
  PawPrint,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";

import { StatusChip } from "./statusChip";
import {
  DeleteConfirmModal,
  useDeleteModal,
} from "../../../components/modal/deleteConfirmModal.tsx";
import {
  useAdminDeleteLostFoundPostMutation,
  useAdminMarkLostFoundResolvedMutation,
} from "@/src/redux/features/lostFound/lostFoundApi";

interface LostFoundTableProps {
  posts: any[];
  isLoading: boolean;
  hasFilters: boolean;
  clearFilters: () => void;
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
      await adminDelete(post._id);
      toast.success("Post marked as resolved", { id: toastId });
    } catch {
      toast.error("Failed to resolve", { id: toastId });
    }
  };
  // console.log(posts);
  return (
    <div>
      <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 min-h-screen rounded-md">
        <CardHeader className="px-5 pt-4 pb-0 flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            All Posts
            <span className="ml-2 text-xs font-normal text-zinc-400">
              {isLoading ? "loading..." : `${posts.length} results`}
            </span>
          </p>
        </CardHeader>

        <CardBody className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-4 space-y-1">
              {Array(5).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-md" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="py-16 text-center">
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
          ) : (
            <table className="w-full min-w-[640px]  ">
              <thead>
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
                {posts.map((post: any, index: number) => (
                  <tr
                    key={post._id}
                    className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* serial */}
                    <td className="px-4 py-3">
                      <div className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {index + 1}
                      </div>
                    </td>
                    {/* pet */}
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
                              {SPECIES_EMOJI[post.species?.toLowerCase()] ??
                                "🐾"}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                            {post.petName || `${post.species} (unnamed)`}
                          </p>
                          <p className="text-[10px] text-zinc-400 capitalize">
                            {post.species} · {post.breed || "unknown breed"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* posted by */}
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

                    {/* location */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <MapPin className="size-3 shrink-0" />
                        <span>
                          {post.area ? `${post.area}, ` : ""}
                          {post.emirate}
                        </span>
                      </div>
                    </td>

                    {/* date */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <Calendar className="size-3 shrink-0" />
                        <span>
                          {format(new Date(post.createdAt), "dd MMM yy")}
                        </span>
                      </div>
                    </td>

                    {/* status */}
                    <td className="px-4 py-3">
                      <StatusChip status={post.status} type={post.type} />
                    </td>

                    {/* actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Tooltip content="View post">
                          <Button
                            as={Link}
                            href={`/user/quickAccess/lost-found/${post._id}`}
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
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/*   Delete Modal */}
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
