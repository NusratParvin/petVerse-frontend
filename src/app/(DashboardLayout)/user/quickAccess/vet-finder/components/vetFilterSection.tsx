"use client";

import { EMIRATES, SPECIALITIES } from "@/src/constant";
import { TEmirate, TSpeciality } from "@/src/types";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { MapPin, Search, SlidersHorizontal, X } from "lucide-react";

interface VetFiltersProps {
  emirate: TEmirate | "";
  speciality: TSpeciality | "";
  search: string;
  onEmirateChange: (value: TEmirate | "") => void;
  onSpecialityChange: (value: TSpeciality | "") => void;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

const VetFilters = ({
  emirate,
  speciality,
  search,
  onEmirateChange,
  onSpecialityChange,
  onSearchChange,
  onClear,
}: VetFiltersProps) => {
  const hasFilters = !!(emirate || speciality || search);

  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      <div className="flex flex-col sm:flex-row gap-2 w-full min-w-0">
        {/* Search Input */}
        <Input
          placeholder="Search clinic or area..."
          value={search}
          onValueChange={onSearchChange}
          startContent={
            <Search className="w-4 h-4 text-default-400 shrink-0" />
          }
          isClearable
          onClear={() => onSearchChange("")}
          variant="bordered"
          size="sm"
          radius="lg"
          classNames={{
            base: "flex-1 min-w-0",
            inputWrapper:
              "border-default-200 dark:border-default-100/10 hover:border-primary/50 data-[focus=true]:border-primary bg-white dark:bg-default-50/5",
          }}
        />

        {/* Emirate Select */}
        <Select
          placeholder="All Emirates"
          selectedKeys={emirate ? [emirate] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            onEmirateChange((selected as TEmirate) ?? "");
          }}
          variant="bordered"
          size="sm"
          radius="lg"
          startContent={
            <MapPin className="w-4 h-4 text-default-400 shrink-0" />
          }
          classNames={{
            base: "w-full sm:w-44 shrink-0",
            trigger:
              "border-default-200 dark:border-default-100/10 hover:border-primary/50 data-[open=true]:border-primary bg-white dark:bg-default-50/5",
          }}
        >
          {EMIRATES.map((e) => (
            <SelectItem key={e.value} value={e.value}>
              {e.label}
            </SelectItem>
          ))}
        </Select>

        {/* Speciality Select */}
        <Select
          placeholder="All Specialities"
          selectedKeys={speciality ? [speciality] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            onSpecialityChange((selected as TSpeciality) ?? "");
          }}
          variant="bordered"
          size="sm"
          radius="lg"
          startContent={
            <SlidersHorizontal className="w-4 h-4 text-default-400 shrink-0" />
          }
          classNames={{
            base: "w-full sm:w-48 shrink-0",
            trigger:
              "border-default-200 dark:border-default-100/10 hover:border-primary/50 data-[open=true]:border-primary bg-white dark:bg-default-50/5",
          }}
        >
          {SPECIALITIES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </Select>

        {/* Clear Button */}
        {hasFilters && (
          <Button
            variant="flat"
            color="default"
            size="sm"
            radius="lg"
            startContent={<X className="w-3.5 h-3.5" />}
            onPress={onClear}
            className="shrink-0 w-full sm:w-auto"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {emirate && (
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs">
              <MapPin className="w-3 h-3" />
              <span>{EMIRATES.find((e) => e.value === emirate)?.label}</span>
              <button
                onClick={() => onEmirateChange("")}
                className="hover:bg-primary-100 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {speciality && (
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs">
              <SlidersHorizontal className="w-3 h-3" />
              <span>
                {SPECIALITIES.find((s) => s.value === speciality)?.label}
              </span>
              <button
                onClick={() => onSpecialityChange("")}
                className="hover:bg-primary-100 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {search && (
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs">
              <Search className="w-3 h-3" />
              <span>"{search}"</span>
              <button
                onClick={() => onSearchChange("")}
                className="hover:bg-primary-100 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VetFilters;
