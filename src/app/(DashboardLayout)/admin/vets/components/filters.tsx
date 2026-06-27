import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Tooltip,
} from "@heroui/react";
import { Filter, Search, RotateCcw } from "lucide-react";

const EMIRATES = [
  { label: "Dubai", key: "dubai" },
  { label: "Abu Dhabi", key: "abu-dhabi" },
  { label: "Sharjah", key: "sharjah" },
  { label: "Ajman", key: "ajman" },
  { label: "Ras Al Khaimah", key: "ras-al-khaimah" },
  { label: "Fujairah", key: "fujairah" },
  { label: "Umm Al Quwain", key: "umm-al-quwain" },
];

const SPECIALITIES = [
  { label: "Dogs", key: "dogs" },
  { label: "Cats", key: "cats" },
  { label: "Birds", key: "birds" },
  { label: "Fish", key: "fish" },
  { label: "Rabbits", key: "rabbits" },
  { label: "Reptiles", key: "reptiles" },
  { label: "Exotic", key: "exotic" },
  { label: "Small Animals", key: "small-animals" },
  { label: "Emergency", key: "emergency" },
  { label: "Surgery", key: "surgery" },
  { label: "Dental", key: "dental" },
  { label: "Dermatology", key: "dermatology" },
  { label: "Ophthalmology", key: "ophthalmology" },
  { label: "Nutrition", key: "nutrition" },
];

export interface VetFilters {
  search: string;
  emirateFilter: string;
  specialityFilter: string;
  emergencyFilter: string;
  ratingFilter: string;
}

type VetsFiltersProps = {
  filters: VetFilters;
  hasFilters: boolean;
  updateFilters: (key: keyof VetFilters, value: string) => void;
  clearFilters: () => void;
};

const VetsFilters = ({
  filters,
  hasFilters,
  updateFilters,
  clearFilters,
}: VetsFiltersProps) => {
  const {
    search,
    emirateFilter,
    specialityFilter,
    emergencyFilter,
    ratingFilter,
  } = filters;
  const activeCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <Card className="bg-white dark:bg-zinc-900/60 shadow-sm border border-zinc-100 dark:border-zinc-800/60 rounded-md dark:shadow-primary/40">
      <CardBody className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          <Filter className="size-3.5" />
          <span>Filters</span>
          {hasFilters && (
            <span className="px-1.5 py-0.5 rounded-full bg-steel-blue/10 dark:bg-lime-burst/10 text-[9px] font-bold text-steel-blue dark:text-lime-burst">
              {activeCount}
            </span>
          )}
          <div className="ml-auto">
            <Tooltip content="Clear all filters" placement="top">
              <button
                onClick={clearFilters}
                disabled={!hasFilters}
                className={`p-1 rounded-md transition-all ${
                  hasFilters
                    ? "text-zinc-400 hover:text-steel-blue dark:hover:text-lime-burst hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <RotateCcw className="size-3.5" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Filter  */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <Input
            placeholder="Search clinic, doctor, area..."
            value={search}
            onValueChange={(v) => updateFilters("search", v)}
            size="sm"
            startContent={<Search className="size-3.5 text-zinc-400" />}
            classNames={{
              inputWrapper:
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-7 p-1",
              input: "text-[11px]",
            }}
            className="col-span-2 sm:col-span-1"
          />

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
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-7",
              value: "text-[11px] text-zinc-800 dark:text-zinc-200",
              selectorIcon: "size-4",
            }}
          >
            {EMIRATES.map((e) => (
              <SelectItem key={e.key} className="text-[11px]">
                {e.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            placeholder="Speciality"
            size="sm"
            selectedKeys={specialityFilter ? [specialityFilter] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              updateFilters("specialityFilter", selected ?? "");
            }}
            classNames={{
              trigger:
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-7",
              value: "text-[11px] text-zinc-800 dark:text-zinc-200",
              selectorIcon: "size-4",
            }}
          >
            {SPECIALITIES.map((s) => (
              <SelectItem key={s.key} className="text-[11px]">
                {s.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            placeholder="Emergency"
            size="sm"
            selectedKeys={emergencyFilter ? [emergencyFilter] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              updateFilters("emergencyFilter", selected ?? "");
            }}
            classNames={{
              trigger:
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-7",
              value: "text-[11px] text-zinc-800 dark:text-zinc-200",
              selectorIcon: "size-4",
            }}
          >
            <SelectItem key="true" className="text-[11px]">
              24/7 Emergency
            </SelectItem>
            <SelectItem key="false" className="text-[11px]">
              No Emergency
            </SelectItem>
          </Select>

          {/* 5th slo */}
          <Select
            placeholder="Rating"
            size="sm"
            selectedKeys={ratingFilter ? [ratingFilter] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              updateFilters("ratingFilter", selected ?? "");
            }}
            classNames={{
              trigger:
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-7",
              value: "text-[11px] text-zinc-800 dark:text-zinc-200",
              selectorIcon: "size-4",
            }}
          >
            <SelectItem key="4" className="text-[9px]">
              ⭐ 4.0+ (Excellent)
            </SelectItem>
            <SelectItem key="3" className="text-[9px]">
              ⭐ 3.0+ (Very Good)
            </SelectItem>
            <SelectItem key="2" className="text-[11px]">
              ⭐ 2.0+ (Good)
            </SelectItem>
            <SelectItem key="all" className="text-[11px]">
              All Ratings
            </SelectItem>
          </Select>
        </div>
      </CardBody>
    </Card>
  );
};

export default VetsFilters;
