import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Tooltip,
} from "@heroui/react";
import { Filter, Search } from "lucide-react";
import { RotateCcw } from "lucide-react";

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
    <Card className="bg-white dark:bg-zinc-900/60 shadow-sm border border-zinc-100 dark:border-zinc-800/60 rounded-md dark:shadow-primary/40">
      {/* <CardBody className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          <Filter className="size-3.5" />
          Filters
          {hasFilters && (
            <Tooltip content="Clear all filters" placement="top">
              <button
                onClick={clearFilters}
                className="ml-auto p-1 rounded-md text-zinc-400 hover:text-steel-blue dark:hover:text-lime-burst hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <RotateCcw className="size-3.5" />
              </button>
            </Tooltip>
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
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px]",
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
      </CardBody> */}

      <CardBody className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          <Filter className="size-3.5" />
          <span>Filters</span>

          {hasFilters && (
            <span className="px-1.5 py-0.5 rounded-full bg-steel-blue/10 dark:bg-lime-burst/10 text-[9px] font-bold text-steel-blue dark:text-lime-burst">
              {Object.values(filters).filter((v) => v !== "").length}
            </span>
          )}

          <div className="ml-auto">
            <Tooltip content="Clear all filters" placement="top">
              <button
                onClick={clearFilters}
                className={`p-1 rounded-md transition-all ${
                  hasFilters
                    ? "text-zinc-400 hover:text-steel-blue dark:hover:text-lime-burst hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
                disabled={!hasFilters}
              >
                <RotateCcw className="size-3.5" />
              </button>
            </Tooltip>
          </div>
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
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-9 p-1",
              input: "text-[11px]",
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
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-9",
              value: "text-[11px] text-zinc-800 dark:text-zinc-200",
              selectorIcon: "size-4",
              popoverContent: "text-[11px]",
            }}
          >
            <SelectItem key="lost" className="!text-[11px]">
              Lost
            </SelectItem>
            <SelectItem key="found" className="text-[11px]">
              Found
            </SelectItem>
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
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-9",
              value: "text-[11px] text-zinc-800 dark:text-zinc-200",
              selectorIcon: "size-4",
            }}
          >
            <SelectItem key="active" className="text-[11px]">
              Active
            </SelectItem>
            <SelectItem key="resolved" className="text-[11px]">
              Resolved
            </SelectItem>
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
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-9",
              value: "text-[11px] text-zinc-800 dark:text-zinc-200",
              selectorIcon: "size-4",
            }}
          >
            {EMIRATES.map((e) => (
              <SelectItem key={e} className="text-[11px]">
                {e}
              </SelectItem>
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
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-9",
              value: "text-[11px] text-zinc-800 dark:text-zinc-200",
              selectorIcon: "size-4",
            }}
          >
            {SPECIES.map((s) => (
              <SelectItem key={s.toLowerCase()} className="text-[11px]">
                {s}
              </SelectItem>
            ))}
          </Select>
        </div>
      </CardBody>
    </Card>
  );
};

export default LostFoundFilters;
