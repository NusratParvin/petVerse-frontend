"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { MessageCircle } from "lucide-react";
import { useGetAllCommentsForAdminQuery } from "@/src/redux/features/comments/commentsApi";
import CommentsTable from "./components/commentsTable";
import CommentsFilters, { CommentFilters } from "./components/commentsFilters";
import CommentsStats from "./components/commentStats";

const DEFAULT_FILTERS: CommentFilters = {
  search: "",
  targetType: "",
  isSighting: "",
  isHelpfulLead: "",
  isDeleted: "",
};

export default function CommentsPage() {
  const [filters, setFilters] = useState<CommentFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const hasFilters = Object.values(filters).some((v) => v !== "");

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const updateFilters = useCallback(
    (key: keyof CommentFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const queryParams = useMemo(() => {
    const p: Record<string, any> = { page, limit: 10 };
    if (filters.targetType) p.targetType = filters.targetType;
    if (filters.isSighting !== "") p.isSighting = filters.isSighting === "true";
    if (filters.isHelpfulLead !== "")
      p.isHelpfulLead = filters.isHelpfulLead === "true";
    if (filters.isDeleted !== "") p.isDeleted = filters.isDeleted === "true";
    return p;
  }, [filters, page]);

  const { data, isLoading, isFetching } =
    useGetAllCommentsForAdminQuery(queryParams);

  const comments = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const pages = data?.meta?.pages ?? 1;

  return (
    <div className="px-4 pb-36 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pt-4">
        <div className="p-1.5 bg-steel-blue/10 dark:bg-lime-burst/10 rounded-lg">
          <MessageCircle className="size-4 text-steel-blue dark:text-lime-burst/70" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            Comments Management
          </h1>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            Moderate and manage all comments and sightings
          </p>
        </div>
      </div>

      <CommentsStats />

      <CommentsFilters
        filters={filters}
        hasFilters={hasFilters}
        updateFilters={updateFilters}
        clearFilters={clearFilters}
      />

      <CommentsTable
        comments={comments}
        total={total}
        page={page}
        pages={pages}
        isLoading={isLoading}
        isFetching={isFetching}
        onPageChange={setPage}
      />
    </div>
  );
}
