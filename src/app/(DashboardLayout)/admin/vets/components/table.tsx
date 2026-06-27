"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  User,
  Pagination,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { TVet } from "@/src/types";
import { EllipsisVertical } from "lucide-react";
import { StarIcon } from "./starIcon";
import { formatEmirate, getEmirateColor } from "./utils";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

const columns = [
  { name: "#", uid: "serial", sortable: false },
  { name: "CLINIC", uid: "clinicName", sortable: true },
  { name: "LOCATION", uid: "location" },
  { name: "EMIRATE", uid: "emirate", sortable: true },
  { name: "SPECIALITIES", uid: "specialities" },
  { name: "EMERGENCY", uid: "emergency", sortable: true },
  { name: "RATING", uid: "rating", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

type SortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};

type VetsTableProps = {
  vets: TVet[];
  total: number;
  page: number;
  pages: number;
  limit: number;
  isLoading: boolean;
  isFetching: boolean;
  sortDescriptor: SortDescriptor;
  onPageChange: (page: number) => void;
  onSortChange: (descriptor: SortDescriptor) => void;
  onDelete: (id: string, name: string) => void;
};

type VetWithIndex = TVet & { _index: number };

export default function VetsTable({
  vets,
  total,
  page,
  pages,
  limit,
  isLoading,
  isFetching,
  sortDescriptor,
  onPageChange,
  onSortChange,
  onDelete,
}: VetsTableProps) {
  const router = useRouter();
  const loadingState = isLoading || isFetching ? "loading" : "idle";

  const itemsWithIndex = useMemo(() => {
    return vets.map((item, index) => ({
      ...item,
      _index: (page - 1) * limit + index + 1,
    }));
  }, [vets, page, limit]);

  const renderCell = useCallback(
    (vet: VetWithIndex, columnKey: string | number) => {
      switch (columnKey) {
        case "serial":
          return (
            <span className="text-[11px] text-default-400">{vet._index}</span>
          );
        case "clinicName":
          return (
            <User
              avatarProps={{
                radius: "lg",
                size: "sm",
                src:
                  vet.coverPhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(vet.clinicName)}&background=0D8F81&color=fff&size=32`,
              }}
              description={vet.area}
              name={vet.clinicName}
              classNames={{
                name: "text-[12px]",
                description: "text-[10px]",
              }}
            />
          );
        case "location":
          return (
            <div className="flex flex-col gap-0.5">
              <p className="text-[12px]">{vet.area}</p>
              <p className="text-[10px] text-default-400 truncate max-w-[180px]">
                {vet.address}
              </p>
            </div>
          );
        case "emirate":
          return (
            <Chip
              className="capitalize text-[10px]"
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
                  className="capitalize text-[10px]"
                >
                  {spec.replace("-", " ")}
                </Chip>
              ))}
              {vet.specialities && vet.specialities.length > 2 && (
                <Chip size="sm" variant="flat" className="text-[10px]">
                  +{vet.specialities.length - 2}
                </Chip>
              )}
            </div>
          );
        case "emergency":
          return (
            <Chip
              color={vet.emergency ? "danger" : "default"}
              size="sm"
              variant={vet.emergency ? "solid" : "flat"}
              className="text-[10px]"
            >
              {vet.emergency ? "24/7" : "No"}
            </Chip>
          );
        case "rating":
          return (
            <div className="flex items-center gap-1">
              <StarIcon filled className="text-warning size-3" />
              <span className="text-[12px] font-semibold">
                {vet.rating?.toFixed(1) || "0"}
              </span>
              <span className="text-[10px] text-default-400">
                ({vet.reviewCount || 0})
              </span>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EllipsisVertical className="text-default-300 size-4" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key="view"
                    onPress={() =>
                      router.push(`/admin/vets/${vet._id}?mode=view`)
                    }
                  >
                    View Details
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    onPress={() =>
                      router.push(`/admin/vets/${vet._id}?mode=edit`)
                    }
                  >
                    Edit Clinic
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onPress={() => onDelete(String(vet._id), vet.clinicName)}
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
    [router, onDelete],
  );

  //calc index
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  const bottomContent = (
    <div className="py-2 px-2 flex justify-between items-center">
      <span className="text-[12px] text-default-400">
        Showing {startIndex}-{endIndex} of {total} results
      </span>
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages}
        onChange={onPageChange}
      />
      <div className="hidden sm:flex gap-2">
        <Button
          isDisabled={page <= 1}
          size="sm"
          variant="flat"
          onPress={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          isDisabled={page >= pages}
          size="sm"
          variant="flat"
          onPress={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );

  return (
    <Table
      isHeaderSticky
      aria-label="Veterinary clinics table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper:
          "min-h-[500px] max-h-[800px] rounded-md overflow-y-auto custom-scrollbar",
      }}
      sortDescriptor={sortDescriptor}
      onSortChange={(d) => onSortChange(d as SortDescriptor)}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
            className="text-[11px]"
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
        items={itemsWithIndex}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {(item: VetWithIndex) => (
          <TableRow key={String(item._id)}>
            {(columnKey) => (
              <TableCell className="py-2">
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
