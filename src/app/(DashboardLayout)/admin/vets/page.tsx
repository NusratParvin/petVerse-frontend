"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Spinner,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import {
  useDeleteVetMutation,
  useGetVetsQuery,
} from "@/src/redux/features/vets/vetsApi";
import { TVet } from "@/src/types";
import { ChevronDown, EllipsisVertical, Plus, Search } from "lucide-react";

// API Response type
interface ApiResponse {
  data: TVet[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Column definitions for the table
const columns = [
  { name: "CLINIC", uid: "clinicName", sortable: true },
  { name: "CONTACT PERSON", uid: "name", sortable: true },
  { name: "LOCATION", uid: "location" },
  { name: "EMIRATE", uid: "emirate", sortable: true },
  { name: "SPECIALITIES", uid: "specialities" },
  { name: "PRICE RANGE", uid: "priceRange" },
  { name: "EMERGENCY", uid: "emergency", sortable: true },
  { name: "RATING", uid: "rating", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

// Emirate options for filtering
const emirateOptions = [
  { name: "Dubai", uid: "dubai" },
  { name: "Abu Dhabi", uid: "abu-dhabi" },
  { name: "Sharjah", uid: "sharjah" },
  { name: "Ajman", uid: "ajman" },
  { name: "Ras Al Khaimah", uid: "ras-al-khaimah" },
  { name: "Fujairah", uid: "fujairah" },
  { name: "Umm Al Quwain", uid: "umm-al-quwain" },
];

// Speciality options for filtering
const specialityOptions = [
  { name: "Dogs", uid: "dogs" },
  { name: "Cats", uid: "cats" },
  { name: "Birds", uid: "birds" },
  { name: "Fish", uid: "fish" },
  { name: "Rabbits", uid: "rabbits" },
  { name: "Reptiles", uid: "reptiles" },
  { name: "Exotic", uid: "exotic" },
  { name: "Small Animals", uid: "small-animals" },
  { name: "Emergency", uid: "emergency" },
  { name: "Surgery", uid: "surgery" },
  { name: "Dental", uid: "dental" },
  { name: "Dermatology", uid: "dermatology" },
  { name: "Ophthalmology", uid: "ophthalmology" },
  { name: "Nutrition", uid: "nutrition" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "clinicName",
  "location",
  "specialities",
  "emergency",
  "rating",
  "actions",
];

// Helper functions
function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

function formatEmirate(emirate: string) {
  const emirateMap: Record<string, string> = {
    dubai: "Dubai",
    "abu-dhabi": "Abu Dhabi",
    sharjah: "Sharjah",
    ajman: "Ajman",
    "ras-al-khaimah": "Ras Al Khaimah",
    fujairah: "Fujairah",
    "umm-al-quwain": "Umm Al Quwain",
  };
  return emirateMap[emirate] || capitalize(emirate);
}

function formatPriceRange(priceRange: { basePrice: number; maxPrice: number }) {
  if (!priceRange) return "N/A";
  const { basePrice, maxPrice } = priceRange;
  if (basePrice === maxPrice) {
    return `$${basePrice}`;
  }
  return `$${basePrice} - $${maxPrice}`;
}

function getEmirateColor(emirate: string) {
  const colorMap: Record<string, string> = {
    dubai: "primary",
    "abu-dhabi": "success",
    sharjah: "warning",
    ajman: "secondary",
    "ras-al-khaimah": "danger",
    fujairah: "default",
    "umm-al-quwain": "default",
  };
  return colorMap[emirate] || "default";
}

const StarIcon = ({ filled = false, ...props }) => {
  return (
    <svg
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default function VetsPage() {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [emirateFilter, setEmirateFilter] = useState<Set<string>>(new Set());
  const [specialityFilter, setSpecialityFilter] = useState<Set<string>>(
    new Set(),
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "clinicName",
    direction: "ascending" as "ascending" | "descending",
  });
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Build query params for RTK Query
  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {
      page: page.toString(),
      limit: rowsPerPage.toString(),
      sortBy: sortDescriptor.column,
      sortOrder: sortDescriptor.direction === "ascending" ? "asc" : "desc",
    };

    if (filterValue) {
      params.search = filterValue;
    }

    if (emirateFilter.size > 0) {
      params.emirate = Array.from(emirateFilter).join(",");
    }

    if (specialityFilter.size > 0) {
      params.speciality = Array.from(specialityFilter)[0];
    }

    return params;
  }, [
    page,
    rowsPerPage,
    sortDescriptor,
    filterValue,
    emirateFilter,
    specialityFilter,
  ]);

  // RTK Query hooks - fix: handle both possible response structures
  const {
    data: vetResponse,
    isLoading,
    isFetching,
  } = useGetVetsQuery(queryParams);
  const [deleteVet, { isLoading: isDeleting }] = useDeleteVetMutation();

  // Handle both response formats: direct array OR object with data/meta
  const vets = React.useMemo(() => {
    if (!vetResponse) return [];
    // If response has data property (ApiResponse format)
    if (Array.isArray(vetResponse)) return vetResponse;
    // If response is the ApiResponse object
    if (vetResponse.data && Array.isArray(vetResponse.data))
      return vetResponse.data;
    return [];
  }, [vetResponse]);

  const total = React.useMemo(() => {
    if (!vetResponse) return 0;
    // If response has meta with total
    if (vetResponse.meta?.total) return vetResponse.meta.total;
    // If response is an array, use its length
    if (Array.isArray(vetResponse)) return vetResponse.length;
    return 0;
  }, [vetResponse]);

  const pages = React.useMemo(() => {
    if (!vetResponse) return 1;
    // If response has meta with pages
    if (vetResponse.meta?.pages) return vetResponse.meta.pages;
    // Calculate pages based on total and rowsPerPage
    return Math.ceil(total / rowsPerPage) || 1;
  }, [vetResponse, total, rowsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filterValue, emirateFilter, specialityFilter]);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const handleDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteVet(deleteConfirm).unwrap();
        setDeleteConfirm(null);
        onClose();
      } catch (error) {
        console.error("Failed to delete vet:", error);
      }
    }
  };

  const handleEdit = (vet: TVet) => {
    // Navigate to edit page or open edit modal
    console.log("Edit vet:", vet);
  };

  const handleView = (vet: TVet) => {
    // Navigate to view page or open view modal
    console.log("View vet:", vet);
  };

  const handleAddNew = () => {
    // Navigate to add new page or open add modal
    console.log("Add new vet");
  };

  const renderCell = useCallback(
    (vet: TVet, columnKey: string | number) => {
      switch (columnKey) {
        case "clinicName":
          return (
            <User
              avatarProps={{
                radius: "lg",
                src:
                  vet.coverPhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(vet.clinicName)}&background=0D8F81&color=fff`,
              }}
              description={vet.area}
              name={vet.clinicName}
            />
          );
        case "name":
          return vet.name || "—";
        case "location":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{vet.area}</p>
              <p className="text-tiny text-default-400 truncate max-w-[200px]">
                {vet.address}
              </p>
            </div>
          );
        case "emirate":
          return (
            <Chip
              className="capitalize"
              color={getEmirateColor(vet.emirate) as any}
              size="sm"
              variant="flat"
            >
              {formatEmirate(vet.emirate)}
            </Chip>
          );
        case "specialities":
          return (
            <div className="flex flex-wrap gap-1 max-w-[200px]">
              {vet.specialities?.slice(0, 2).map((spec) => (
                <Chip
                  key={spec}
                  size="sm"
                  variant="flat"
                  className="capitalize text-xs"
                >
                  {spec.replace("-", " ")}
                </Chip>
              ))}
              {vet.specialities && vet.specialities.length > 2 && (
                <Chip size="sm" variant="flat" className="text-xs">
                  +{vet.specialities.length - 2}
                </Chip>
              )}
            </div>
          );
        case "priceRange":
          return (
            <span className="text-small font-medium">
              {formatPriceRange(vet.priceRange)}
            </span>
          );
        case "emergency":
          return (
            <Chip
              className="capitalize"
              color={vet.emergency ? "danger" : "default"}
              size="sm"
              variant={vet.emergency ? "solid" : "flat"}
            >
              {vet.emergency ? "24/7" : "No"}
            </Chip>
          );
        case "rating":
          return (
            <div className="flex items-center gap-1">
              <StarIcon filled={true} className="text-warning" />
              <span className="text-small font-semibold">
                {vet.rating?.toFixed(1) || "0"}
              </span>
              <span className="text-tiny text-default-400">
                ({vet.reviewCount || 0})
              </span>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <EllipsisVertical className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="view" onPress={() => handleView(vet)}>
                    View Details
                  </DropdownItem>
                  <DropdownItem key="edit" onPress={() => handleEdit(vet)}>
                    Edit Clinic
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onPress={() => {
                      setDeleteConfirm(vet._id);
                      onOpen();
                    }}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return vet[columnKey as keyof TVet] as React.ReactNode;
      }
    },
    [onOpen],
  );

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-1 pt-4 text-xs">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%] text-xs focus:ring-0 focus:ring-transparent"
            size="sm"
            placeholder="Search by clinic, doctor, or area..."
            startContent={<Search size={14} />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            {/* Emirate Filter Dropdown */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDown size={14} />}
                  variant="flat"
                  size="sm"
                >
                  {emirateFilter.size > 0
                    ? `Emirates (${emirateFilter.size})`
                    : "Emirate"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection={false}
                aria-label="Emirate Filter"
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

            {/* Speciality Filter Dropdown */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDown size={14} />}
                  variant="flat"
                  size="sm"
                >
                  {specialityFilter.size > 0
                    ? `Specialities (${specialityFilter.size})`
                    : "Speciality"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection={false}
                aria-label="Speciality Filter"
                closeOnSelect={false}
                selectedKeys={specialityFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setSpecialityFilter(keys as Set<string>)
                }
              >
                {specialityOptions.map((speciality) => (
                  <DropdownItem key={speciality.uid} className="capitalize">
                    {speciality.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* Columns Dropdown */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDown size={14} />}
                  variant="flat"
                  size="sm"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setVisibleColumns(keys as Set<string>)
                }
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button
              // color="primary"
              className="bg-steel-blue text-white dark:bg-lime-burst/70"
              size="sm"
              endContent={<Plus size={14} />}
              onPress={handleAddNew}
            >
              Add New Vet
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-default-400">
            Total {total} veterinary clinics
          </span>
          <label className="flex items-center text-default-400  ">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-xs ml-2"
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
    emirateFilter,
    specialityFilter,
    visibleColumns,
    rowsPerPage,
    total,
    onSearchChange,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys.size === total && total > 0
            ? "All items selected"
            : `${selectedKeys.size} of ${total} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, total, page, pages, onPreviousPage, onNextPage]);

  const loadingState = isLoading || isFetching ? "loading" : "idle";

  return (
    <>
      <div className="px-4 border-0 border-transparent ">
        <Table
          isHeaderSticky
          aria-label="Veterinary clinics table"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-[600px]",
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
          onSortChange={(descriptor) => setSortDescriptor(descriptor as any)}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={
              loadingState === "loading"
                ? "Loading..."
                : "No veterinary clinics found"
            }
            items={vets}
            loadingContent={<Spinner />}
            loadingState={loadingState}
          >
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>{" "}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this veterinary clinic?</p>
            <p className="text-danger text-small">
              This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
