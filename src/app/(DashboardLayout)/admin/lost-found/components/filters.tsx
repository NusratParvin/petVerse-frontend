import { Card, CardBody, Input, Select, SelectItem } from "@heroui/react";
import { Filter, Search } from "lucide-react";

const EMIRATES = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "RAK",
  "Fujairah",
  "UAQ",
];

const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Reptile", "Other"];

interface Filters {
  search: string;
  typeFilter: string;
  statusFilter: string;
  emirateFilter: string;
  speciesFilter: string;
}

type LostFoundFilterProps = {
  hasFilters: boolean;
  clearFilters: () => void;
  filters: Filters;
  updateFilters: (key: keyof Filters, value: string) => void;
};

const LostFoundFilters = ({
  hasFilters,
  clearFilters,
  filters,
  updateFilters,
}: LostFoundFilterProps) => {
  const { search, typeFilter, statusFilter, emirateFilter, speciesFilter } =
    filters;

  return (
    <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
      <CardBody className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          <Filter className="size-3.5" />
          Filters
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-red-400 hover:text-red-500 font-normal normal-case tracking-normal"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <Input
            placeholder="Search posts..."
            value={search}
            onValueChange={(v) => updateFilters("search", v)}
            size="sm"
            startContent={<Search className="size-3.5 text-zinc-400" />}
            classNames={{
              inputWrapper:
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
              input: "text-xs",
            }}
            className="col-span-2 sm:col-span-1"
          />

          <Select
            placeholder="Type"
            size="sm"
            selectedKeys={typeFilter ? [typeFilter] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              updateFilters("typeFilter", selected ?? "");
            }}
            classNames={{
              trigger:
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs",
            }}
          >
            <SelectItem key="lost">Lost</SelectItem>
            <SelectItem key="found">Found</SelectItem>
          </Select>

          <Select
            placeholder="Status"
            size="sm"
            selectedKeys={statusFilter ? [statusFilter] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              updateFilters("statusFilter", selected ?? "");
            }}
            classNames={{
              trigger:
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs",
            }}
          >
            <SelectItem key="active">Active</SelectItem>
            <SelectItem key="resolved">Resolved</SelectItem>
          </Select>

          <Select
            placeholder="Emirate"
            size="sm"
            selectedKeys={emirateFilter ? [emirateFilter] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              updateFilters("emirateFilter", selected ?? "");
            }}
            classNames={{
              trigger:
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs",
            }}
          >
            {EMIRATES.map((e) => (
              <SelectItem key={e}>{e}</SelectItem>
            ))}
          </Select>

          <Select
            placeholder="Species"
            size="sm"
            selectedKeys={speciesFilter ? [speciesFilter] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              updateFilters("speciesFilter", selected ?? "");
            }}
            classNames={{
              trigger:
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs",
            }}
          >
            {SPECIES.map((s) => (
              <SelectItem key={s.toLowerCase()}>{s}</SelectItem>
            ))}
          </Select>
        </div>
      </CardBody>
    </Card>
  );
};

export default LostFoundFilters;
