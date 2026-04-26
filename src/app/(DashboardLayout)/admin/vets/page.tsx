"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useGetVetsQuery,
  useDeleteVetMutation,
} from "@/src/redux/features/vets/vetsApi";
import { TVet } from "@/src/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Chip,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Pagination,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { toast } from "sonner";
import { SearchIcon, ChevronDownIcon, PlusIcon } from "lucide-react";

const statusOptions = [
  { name: "Claimed", uid: "claimed" },
  { name: "Unclaimed", uid: "unclaimed" },
];

const emirateOptions = [
  { name: "Dubai", uid: "dubai" },
  { name: "Abu Dhabi", uid: "abu-dhabi" },
  { name: "Sharjah", uid: "sharjah" },
  { name: "Ajman", uid: "ajman" },
  { name: "Ras Al Khaimah", uid: "ras-al-khaimah" },
  { name: "Fujairah", uid: "fujairah" },
  { name: "Umm Al Quwain", uid: "umm-al-quwain" },
];

export default function AdminVetsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set([]));
  const [emirateFilter, setEmirateFilter] = useState<Set<string>>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "clinicName",
    direction: "ascending" as "ascending" | "descending",
  });

  const [deleteVet] = useDeleteVetMutation();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Build query params for backend pagination
  const queryParams = useMemo(() => {
    const params: any = {
      page,
      limit: rowsPerPage,
      sortBy: sortDescriptor.column,
      sortOrder: sortDescriptor.direction,
    };

    if (filterValue) {
      params.search = filterValue;
    }

    if (statusFilter.size > 0) {
      params.status = Array.from(statusFilter).join(",");
    }

    if (emirateFilter.size > 0) {
      params.emirate = Array.from(emirateFilter).join(",");
    }

    return params;
  }, [
    page,
    rowsPerPage,
    filterValue,
    statusFilter,
    emirateFilter,
    sortDescriptor,
  ]);

  const { data: vetInfo, isLoading, isFetching } = useGetVetsQuery(queryParams);

  const vets = vetInfo || [];
  console.log(vetInfo);
  // const total = data?.total || 0;
  const total = 10;
  const pages = Math.ceil(total / rowsPerPage) || 1;

  const formatEmirate = (e: string) =>
    e
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteVet(deleteConfirm).unwrap();
      toast.success("Clinic deleted successfully");
      setDeleteConfirm(null);
      onClose();
      // Refresh current page
      setPage(1);
    } catch {
      toast.error("Failed to delete clinic");
    }
  };

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[280px]"
            placeholder="Search by clinic name..."
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3 flex-wrap">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  endContent={<ChevronDownIcon className="text-small" />}
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status filter"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setStatusFilter(keys as Set<string>)
                }
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  endContent={<ChevronDownIcon className="text-small" />}
                >
                  Emirate
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Emirate filter"
                closeOnSelect={false}
                selectedKeys={emirateFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setEmirateFilter(keys as Set<string>)
                }
              >
                {emirateOptions.map((emirate) => (
                  <DropdownItem key={emirate.uid} className="capitalize">
                    {emirate.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button
              as={Link}
              href="/admin/vets/new"
              color="primary"
              className="bg-lime-burst text-gray-900 font-bold"
              startContent={<PlusIcon />}
            >
              Add Clinic
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {total} clinic{total !== 1 ? "s" : ""}
          </span>
          <label className="flex items-center text-default-400 text-small gap-2">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    emirateFilter,
    rowsPerPage,
    total,
    onSearchChange,
    onClear,
    onRowsPerPageChange,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            cursor: "bg-lime-burst text-gray-900",
          }}
        />
      </div>
    );
  }, [page, pages]);

  // Loading State
  if (isLoading && page === 1) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-steel-blue/20 dark:bg-white/10 rounded mb-2" />
          <div className="h-4 w-32 bg-steel-blue/10 dark:bg-white/5 rounded mb-6" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 bg-steel-blue/5 dark:bg-white/5 rounded"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (
    !vets?.length &&
    !isLoading &&
    !filterValue &&
    statusFilter.size === 0 &&
    emirateFilter.size === 0
  ) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Vet Clinics
            </h1>
            <p className="text-xs sm:text-sm mt-1 text-gray-500 dark:text-white/40">
              0 clinics in database
            </p>
          </div>
          <Button
            as={Link}
            href="/admin/vets/new"
            color="primary"
            className="bg-lime-burst text-gray-900 font-bold"
            startContent={<PlusIcon />}
          >
            Add Clinic
          </Button>
        </div>
        <div className="rounded-2xl border border-steel-blue/20 dark:border-white/10 bg-white dark:bg-white/5 p-12 text-center">
          <div className="text-5xl mb-3">🏥</div>
          <p className="text-gray-600 dark:text-white/60 text-sm">
            No vet clinics yet
          </p>
          <p className="text-gray-400 dark:text-white/30 text-xs mt-1">
            Click "Add Clinic" to get started
          </p>
        </div>
      </div>
    );
  }

  // Success State - Show Table
  return (
    <div className="p-4 sm:p-6">
      <Table
        aria-label="Vet clinics table with pagination"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
        classNames={{
          base: "rounded-2xl border border-steel-blue/20 dark:border-white/10",
          table: "min-w-[800px]",
          th: "text-left text-gray-500 dark:text-white/40 text-xs font-medium px-5 py-3 bg-transparent border-b border-steel-blue/15 dark:border-white/10",
          td: "px-5 py-4 border-b border-steel-blue/10 dark:border-white/5",
          tr: "hover:bg-steel-blue/5 dark:hover:bg-white/5 transition-colors",
        }}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader>
          <TableColumn key="clinicName" allowsSorting>
            Clinic
          </TableColumn>
          <TableColumn key="emirate" allowsSorting>
            Emirate
          </TableColumn>
          <TableColumn key="specialities">Specialities</TableColumn>
          <TableColumn key="rating" allowsSorting>
            Rating
          </TableColumn>

          <TableColumn key="actions" align="end">
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody
          items={vets}
          loadingContent={<div className="text-center py-4">Loading...</div>}
          isLoading={isFetching}
        >
          {(vet: TVet) => (
            <TableRow key={vet._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={vet.coverPhoto}
                    name={vet.clinicName}
                    size="sm"
                    radius="lg"
                    className="w-9 h-9"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {vet.clinicName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white/40">
                      {vet.name}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-600 dark:text-white/60">
                {formatEmirate(vet.emirate)}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {vet.specialities?.slice(0, 2).map((s) => (
                    <Chip
                      key={s}
                      size="sm"
                      className="text-[10px] bg-steel-blue/15 border border-steel-blue/25 text-steel-blue px-1.5 py-0.5 rounded-full capitalize"
                    >
                      {s}
                    </Chip>
                  ))}
                  {vet.specialities?.length > 2 && (
                    <span className="text-[10px] text-gray-400 dark:text-white/30">
                      +{vet.specialities.length - 2}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-pv-yellow text-sm">
                  ★ {vet.rating?.toFixed(1) || "N/A"}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    as={Link}
                    href={`/admin/vets/${vet._id}`}
                    size="sm"
                    variant="light"
                    className="text-steel-blue min-w-0 px-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    className="text-pv-coral min-w-0 px-2"
                    onPress={() => {
                      setDeleteConfirm(vet._id);
                      onOpen();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* HeroUI Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-gray-900 dark:text-white font-bold text-lg">
                  Delete Clinic?
                </h3>
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-500 dark:text-white/50 text-sm">
                  This will permanently delete this clinic from the directory.
                  This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={handleDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
