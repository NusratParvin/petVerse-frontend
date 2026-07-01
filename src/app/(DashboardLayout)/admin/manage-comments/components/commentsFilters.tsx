"use client";

import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Tooltip,
} from "@heroui/react";
import { Filter, Search, RotateCcw } from "lucide-react";

export interface CommentFilters {
  search: string;
  targetType: string;
  isSighting: string;
  isHelpfulLead: string;
  isDeleted: string;
}

type CommentsFiltersProps = {
  filters: CommentFilters;
  hasFilters: boolean;
  updateFilters: (key: keyof CommentFilters, value: string) => void;
  clearFilters: () => void;
};

export default function CommentsFilters({
  filters,
  hasFilters,
  updateFilters,
  clearFilters,
}: CommentsFiltersProps) {
  const activeCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <Card className="bg-white dark:bg-zinc-900/60 shadow-sm border border-zinc-100 dark:border-zinc-800/60 rounded-md dark:shadow-primary">
      <CardBody className="p-3 space-y-3">
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
                className={`p-1 rounded-md transition-all ${hasFilters ? "text-zinc-400 hover:text-steel-blue dark:hover:text-lime-burst hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <RotateCcw className="size-3.5" />
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <Input
            placeholder="Search comments..."
            value={filters.search}
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

          {[
            {
              key: "targetType" as keyof CommentFilters,
              placeholder: "Type",
              options: [
                { key: "Article", label: "Articles" },
                { key: "LostFound", label: "Lost & Found" },
              ],
            },
            {
              key: "isSighting" as keyof CommentFilters,
              placeholder: "Sighting",
              options: [
                { key: "true", label: "Sightings only" },
                { key: "false", label: "Non-sightings" },
              ],
            },
            {
              key: "isHelpfulLead" as keyof CommentFilters,
              placeholder: "Helpful Lead",
              options: [
                { key: "true", label: "Helpful leads" },
                { key: "false", label: "Not marked" },
              ],
            },
            {
              key: "isDeleted" as keyof CommentFilters,
              placeholder: "Status",
              options: [
                { key: "false", label: "Active" },
                { key: "true", label: "Deleted" },
              ],
            },
          ].map(({ key, placeholder, options }) => (
            <Select
              key={key}
              placeholder={placeholder}
              size="sm"
              selectedKeys={filters[key] ? [filters[key]] : []}
              onSelectionChange={(keys) =>
                updateFilters(key, (Array.from(keys)[0] as string) ?? "")
              }
              classNames={{
                trigger:
                  "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 h-7",
                value: "text-[11px] text-zinc-800 dark:text-zinc-200",
                selectorIcon: "size-4",
              }}
            >
              {options.map((o) => (
                <SelectItem key={o.key} className="text-[11px]">
                  {o.label}
                </SelectItem>
              ))}
            </Select>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
