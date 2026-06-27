"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@heroui/react";
import { Hospital, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useDeleteVetMutation,
  useGetVetsQuery,
} from "@/src/redux/features/vets/vetsApi";

import VetsTable from "./components/table";
import VetsFilters from "./components/filters";
import {
  useDeleteModal,
  DeleteConfirmModal,
} from "../../components/modal/deleteConfirmModal.tsx";
import VetsStats from "./components/charts";

const DEFAULT_FILTERS = {
  search: "",
  emirateFilter: "",
  specialityFilter: "",
  emergencyFilter: "",
  ratingFilter: "",
};

export default function VetsPage() {
  const router = useRouter();

  // Filter state
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const hasFilters = Object.values(filters).some((v) => v !== "");

  // Table state
  const [page, setPage] = useState(1);
  const limitPerPage = 10;
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "clinicName",
    direction: "ascending" as "ascending" | "descending",
  });

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const updateFilters = useCallback((key: any, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {
      page: page.toString(),
      limit: limitPerPage.toString(),
      sortBy: sortDescriptor.column,
      sortOrder: sortDescriptor.direction === "ascending" ? "asc" : "desc",
    };
    if (filters.search) params.search = filters.search;
    if (filters.emirateFilter) params.emirate = filters.emirateFilter;
    if (filters.specialityFilter) params.speciality = filters.specialityFilter;
    if (filters.emergencyFilter) params.emergency = filters.emergencyFilter;
    if (filters.ratingFilter) params.rating = filters.ratingFilter;
    return params;
  }, [page, limitPerPage, sortDescriptor, filters]);

  const {
    data: vetResponse,
    isLoading,
    isFetching,
  } = useGetVetsQuery(queryParams);
  const [deleteVet, { isLoading: isDeleting }] = useDeleteVetMutation();
  const { isOpen, itemToDelete, openDeleteModal, closeDeleteModal } =
    useDeleteModal();

  const vets = vetResponse?.data || [];
  const total = vetResponse?.meta?.total || 0;
  const pages = vetResponse?.meta?.pages || 1;
  // const hasMore = vetResponse?.meta?.hasMore || false;

  const handleDelete = async () => {
    if (itemToDelete?.id) {
      try {
        await deleteVet(itemToDelete.id).unwrap();
        closeDeleteModal();
      } catch (error) {
        console.error("Failed to delete vet:", error);
      }
    }
  };

  return (
    <>
      <div className="px-4 pt-2 pb-36 space-y-2">
        {/* Page header */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-steel-blue/10 dark:bg-lime-burst/10 rounded-lg">
              <Hospital className="size-4 text-steel-blue dark:text-lime-burst/70" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                Vet Clinics
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                {total} clinics registered across the UAE
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-steel-blue text-white dark:bg-lime-burst/70"
            endContent={<Plus size={14} />}
            onPress={() => router.push("vets/new")}
          >
            Add New Vet
          </Button>
        </div>
        <VetsStats />
        {/* Filters */}
        <VetsFilters
          filters={filters}
          hasFilters={hasFilters}
          updateFilters={updateFilters}
          clearFilters={clearFilters}
        />
        {/* Table */}
        <VetsTable
          vets={vets}
          total={total}
          page={page}
          pages={pages}
          limit={limitPerPage}
          isLoading={isLoading}
          isFetching={isFetching}
          sortDescriptor={sortDescriptor}
          onPageChange={setPage}
          onSortChange={setSortDescriptor}
          onDelete={(id, name) => openDeleteModal(id, name, "vet clinic")}
        />
      </div>

      <DeleteConfirmModal
        isOpen={isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        entityName={itemToDelete?.name}
        entityType={itemToDelete?.type || "vet clinic"}
        isLoading={isDeleting}
      />
    </>
  );
}
