// "use client";

// import { Button, Chip, Input, Select, SelectItem } from "@heroui/react";
// import { ArrowUpDown, Search, X } from "lucide-react";

// import {
//   CATEGORY_OPTIONS,
//   DEFAULT_FILTERS,
//   PET_OPTIONS,
//   RANGE_OPTIONS,
//   RANGE_SORTS,
//   SORT_OPTIONS,
//   TArticleFilters,
//   TOption,
//   TYPE_OPTIONS,
// } from "./articleFilterConstants";

// const labelOf = (options: TOption[], value: string) =>
//   options.find((o) => o.value === value)?.label ?? value;

// // Rounded pill button (categories and pets)
// const Pill = ({
//   active,
//   onClick,
//   children,
// }: {
//   active: boolean;
//   onClick: () => void;
//   children: React.ReactNode;
// }) => (
//   <button
//     className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
//       active
//         ? "bg-customBlue text-white shadow-sm"
//         : "border border-default-200 bg-white text-default-600 hover:bg-default-100 dark:bg-white/5 dark:hover:bg-white/10"
//     }`}
//     type="button"
//     onClick={onClick}
//   >
//     {children}
//   </button>
// );

// // Small segmented toggle (Free/Premium and time range)
// const Segmented = ({
//   options,
//   value,
//   onChange,
//   label,
// }: {
//   options: TOption[];
//   value: string;
//   onChange: (value: string) => void;
//   label: string;
// }) => (
//   <div
//     aria-label={label}
//     className="inline-flex rounded-full bg-default-100 p-1 dark:bg-white/5"
//     role="group"
//   >
//     {options.map((o) => (
//       <button
//         key={o.value || "all"}
//         className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
//           value === o.value
//             ? "bg-white text-customBlue shadow-sm dark:bg-white/10"
//             : "text-default-500 hover:text-default-700"
//         }`}
//         type="button"
//         onClick={() => onChange(o.value)}
//       >
//         {o.label}
//       </button>
//     ))}
//   </div>
// );

// const scrollRow =
//   "flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

// type Props = {
//   filters: TArticleFilters;
//   onChange: (next: TArticleFilters) => void;
//   total?: number;
// };

// const ArticleFilters = ({ filters, onChange, total }: Props) => {
//   const set = (patch: Partial<TArticleFilters>) =>
//     onChange({ ...filters, ...patch });

//   const showRange = RANGE_SORTS.includes(filters.sort);

//   // Removable chips for everything currently applied
//   const active: {
//     key: string;
//     label: string;
//     clear: Partial<TArticleFilters>;
//   }[] = [];

//   if (filters.search)
//     active.push({
//       key: "search",
//       label: `“${filters.search}”`,
//       clear: { search: "" },
//     });
//   if (filters.category)
//     active.push({
//       key: "category",
//       label: labelOf(CATEGORY_OPTIONS, filters.category),
//       clear: { category: "" },
//     });
//   if (filters.petType)
//     active.push({
//       key: "petType",
//       label: labelOf(PET_OPTIONS, filters.petType),
//       clear: { petType: "" },
//     });
//   if (filters.isPremium)
//     active.push({
//       key: "isPremium",
//       label: labelOf(TYPE_OPTIONS, filters.isPremium),
//       clear: { isPremium: "" },
//     });
//   if (showRange && filters.range !== "all")
//     active.push({
//       key: "range",
//       label: labelOf(RANGE_OPTIONS, filters.range),
//       clear: { range: "all" },
//     });

//   return (
//     <div className="mb-4 space-y-3">
//       {/* Search */}
//       <Input
//         isClearable
//         className="max-w-md"
//         placeholder="Search articles, tags..."
//         size="sm"
//         startContent={<Search size={14} />}
//         value={filters.search}
//         onClear={() => set({ search: "" })}
//         onValueChange={(value) => set({ search: value })}
//       />

//       {/* Category pills */}
//       <div className={scrollRow}>
//         {CATEGORY_OPTIONS.map((o) => {
//           const Icon = o.icon;

//           return (
//             <Pill
//               key={o.value || "all"}
//               active={filters.category === o.value}
//               onClick={() => set({ category: o.value })}
//             >
//               {Icon && <Icon size={14} />}
//               {o.label}
//             </Pill>
//           );
//         })}
//       </div>

//       {/* Pet chips */}
//       <div className={scrollRow}>
//         {PET_OPTIONS.map((o) => (
//           <Pill
//             key={o.value || "all"}
//             active={filters.petType === o.value}
//             onClick={() => set({ petType: o.value })}
//           >
//             <span>{o.emoji}</span>
//             {o.label}
//           </Pill>
//         ))}
//       </div>

//       {/* Type, sort and time range */}
//       <div className="flex flex-wrap items-center gap-3">
//         <Segmented
//           label="Article type"
//           options={TYPE_OPTIONS}
//           value={filters.isPremium}
//           onChange={(value) => set({ isPremium: value })}
//         />

//         <Select
//           disallowEmptySelection
//           aria-label="Sort articles"
//           className="w-44"
//           selectedKeys={[filters.sort]}
//           size="sm"
//           startContent={<ArrowUpDown size={14} />}
//           onSelectionChange={(keys) =>
//             set({ sort: String(Array.from(keys)[0]) })
//           }
//         >
//           {SORT_OPTIONS.map((o) => (
//             <SelectItem key={o.value}>{o.label}</SelectItem>
//           ))}
//         </Select>

//         {showRange && (
//           <Segmented
//             label="Time range"
//             options={RANGE_OPTIONS}
//             value={filters.range}
//             onChange={(value) => set({ range: value })}
//           />
//         )}
//       </div>

//       {/* Active filters and result count */}
//       {(active.length > 0 || total !== undefined) && (
//         <div className="flex flex-wrap items-center gap-2">
//           {total !== undefined && (
//             <span className="text-sm text-default-500">
//               {total} {total === 1 ? "article" : "articles"}
//             </span>
//           )}
//           {active.map((a) => (
//             <Chip
//               key={a.key}
//               size="sm"
//               variant="flat"
//               onClose={() => set(a.clear)}
//             >
//               {a.label}
//             </Chip>
//           ))}
//           {active.length > 0 && (
//             <Button
//               size="sm"
//               startContent={<X size={14} />}
//               variant="light"
//               onPress={() =>
//                 onChange({ ...DEFAULT_FILTERS, sort: filters.sort })
//               }
//             >
//               Clear all
//             </Button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ArticleFilters;

"use client";

import { useState } from "react";
import {
  Button,
  Chip,
  Divider,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from "@heroui/react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import {
  CATEGORY_OPTIONS,
  DEFAULT_FILTERS,
  PET_OPTIONS,
  RANGE_OPTIONS,
  RANGE_SORTS,
  SORT_OPTIONS,
  TArticleFilters,
  TOption,
  TYPE_OPTIONS,
} from "./articleFilterConstants";

const labelOf = (options: TOption[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value;

/* ---------- Pill button (categories + pets) ---------- */
function Pill({
  active,
  onPress,
  children,
}: {
  active: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      className={`shrink-0 rounded-full px-3.5 text-sm font-medium ${
        active
          ? "bg-customBlue text-white shadow-sm"
          : "border border-default-200 bg-white text-default-600 dark:bg-white/5"
      }`}
      radius="full"
      size="sm"
      variant={active ? "solid" : "bordered"}
      onPress={onPress}
    >
      {children}
    </Button>
  );
}

/* ---------- Segmented toggle (Free/Premium, Time range) ---------- */
function Segmented({
  options,
  value,
  onChange,
  label,
}: {
  options: TOption[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div
      aria-label={label}
      className="inline-flex rounded-full bg-default-100 p-1 dark:bg-white/5"
      role="group"
    >
      {options.map((o) => {
        const active = value === o.value;
        return (
          <Button
            key={o.value || "__all__"}
            className={`h-7 min-w-0 rounded-full px-3 text-xs font-medium ${
              active
                ? "bg-white text-customBlue shadow-sm dark:bg-white/10"
                : "bg-transparent text-default-500"
            }`}
            radius="full"
            size="sm"
            variant="light"
            onPress={() => onChange(o.value)}
          >
            {o.label}
          </Button>
        );
      })}
    </div>
  );
}

/* ---------- Reusable Select wrapper ---------- */
export function FilterSelect({
  label,
  value,
  onChange,
  options,
  className = "w-40",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <Select
      aria-label={label}
      className={className}
      disallowEmptySelection
      selectedKeys={[value || "__all__"]}
      size="sm"
      onSelectionChange={(keys) => {
        const v = String(Array.from(keys)[0] ?? "");
        onChange(v === "__all__" ? "" : v);
      }}
    >
      {options.map((o) => (
        <SelectItem key={o.value || "__all__"}>{o.label}</SelectItem>
      ))}
    </Select>
  );
}

/* ---------- Main component ---------- */
const scrollRow =
  "flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

type Props = {
  filters: TArticleFilters;
  onChange: (next: TArticleFilters) => void;
  total?: number;
};

export default function ArticleFilters({ filters, onChange, total }: Props) {
  const [open, setOpen] = useState(false);
  const set = (patch: Partial<TArticleFilters>) =>
    onChange({ ...filters, ...patch });

  const showRange = RANGE_SORTS.includes(filters.sort);

  const active: {
    key: string;
    label: string;
    clear: Partial<TArticleFilters>;
  }[] = [];
  if (filters.search)
    active.push({
      key: "search",
      label: `“${filters.search}”`,
      clear: { search: "" },
    });
  if (filters.category)
    active.push({
      key: "category",
      label: labelOf(CATEGORY_OPTIONS, filters.category),
      clear: { category: "" },
    });
  if (filters.petType)
    active.push({
      key: "petType",
      label: labelOf(PET_OPTIONS, filters.petType),
      clear: { petType: "" },
    });
  if (filters.isPremium)
    active.push({
      key: "isPremium",
      label: labelOf(TYPE_OPTIONS, filters.isPremium),
      clear: { isPremium: "" },
    });
  if (showRange && filters.range !== "all")
    active.push({
      key: "range",
      label: labelOf(RANGE_OPTIONS, filters.range),
      clear: { range: "all" },
    });

  return (
    <div className="mb-4 space-y-3">
      {/* Search + Advanced + Sort */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Input
          isClearable
          aria-label="Search articles"
          className="min-w-0 flex-1 basis-48"
          placeholder="Find your next good read…"
          size="sm"
          startContent={<Search className="text-default-400" size={14} />}
          value={filters.search}
          onClear={() => set({ search: "" })}
          onValueChange={(v) => set({ search: v })}
        />

        <Popover isOpen={open} placement="bottom-end" onOpenChange={setOpen}>
          <PopoverTrigger>
            <Button
              className="shrink-0"
              size="sm"
              startContent={<SlidersHorizontal size={14} />}
              variant="bordered"
            >
              Filters
              {active.length > 0 && (
                <span className="ml-1 grid size-5 place-items-center rounded-full bg-customBlue text-[10px] font-bold text-white">
                  {active.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[min(320px,calc(100vw-32px))] space-y-4 p-4">
            <div className="flex w-full items-center justify-between">
              <h3 className="text-sm font-semibold">A little more specific</h3>
              <Button
                isIconOnly
                aria-label="Close filters"
                radius="full"
                size="sm"
                variant="light"
                onPress={() => setOpen(false)}
              >
                <X size={14} />
              </Button>
            </div>

            <div className="w-full space-y-1.5">
              <label className="text-xs text-default-500">Pet</label>
              <FilterSelect
                className="w-full"
                label="Filter by pet"
                options={[
                  { value: "", label: "All pets" },
                  ...PET_OPTIONS.filter((p) => p.value).map((p) => ({
                    value: p.value,
                    label: `${p.emoji} ${p.label}`,
                  })),
                ]}
                value={filters.petType}
                onChange={(v) => set({ petType: v })}
              />
            </div>

            <div className="w-full space-y-1.5">
              <label className="text-xs text-default-500">Access</label>
              <FilterSelect
                className="w-full"
                label="Filter by access"
                options={TYPE_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.value === "" ? "All articles" : o.label,
                }))}
                value={filters.isPremium}
                onChange={(v) => set({ isPremium: v })}
              />
            </div>

            {showRange && (
              <div className="w-full space-y-1.5">
                <label className="text-xs text-default-500">Time range</label>
                <FilterSelect
                  className="w-full"
                  label="Filter by time range"
                  options={RANGE_OPTIONS}
                  value={filters.range}
                  onChange={(v) => set({ range: v || "all" })}
                />
              </div>
            )}

            <Button
              className="w-full bg-customBlue text-white"
              size="sm"
              onPress={() => setOpen(false)}
            >
              Show results
            </Button>
          </PopoverContent>
        </Popover>

        <FilterSelect
          className="w-40"
          label="Sort articles"
          options={SORT_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          value={filters.sort}
          onChange={(v) => set({ sort: v || "newest" })}
        />
      </div>

      {/* Category pills */}
      <div className={scrollRow}>
        {CATEGORY_OPTIONS.map((o) => {
          const Icon = o.icon;
          return (
            <Pill
              key={o.value || "__all__"}
              active={filters.category === o.value}
              onPress={() => set({ category: o.value })}
            >
              {Icon && <Icon size={14} />}
              {o.label}
            </Pill>
          );
        })}
      </div>

      {/* Pet chips */}
      <div className={scrollRow}>
        {PET_OPTIONS.map((o) => (
          <Pill
            key={o.value || "__all__"}
            active={filters.petType === o.value}
            onPress={() => set({ petType: o.value })}
          >
            <span>{o.emoji}</span>
            {o.label}
          </Pill>
        ))}
      </div>

      {/* Type + range segmented */}
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          label="Article type"
          options={TYPE_OPTIONS}
          value={filters.isPremium}
          onChange={(v) => set({ isPremium: v })}
        />
        {showRange && (
          <Segmented
            label="Time range"
            options={RANGE_OPTIONS}
            value={filters.range}
            onChange={(v) => set({ range: v })}
          />
        )}
      </div>

      {/* Active chips + total */}
      {(active.length > 0 || total !== undefined) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {total !== undefined && (
            <span className="text-xs text-default-500">
              {total} {total === 1 ? "article" : "articles"}
            </span>
          )}
          {active.map((a) => (
            <Chip
              key={a.key}
              size="sm"
              variant="flat"
              onClose={() => set(a.clear)}
            >
              {a.label}
            </Chip>
          ))}
          {active.length > 0 && (
            <Button
              size="sm"
              startContent={<X size={13} />}
              variant="light"
              onPress={() =>
                onChange({ ...DEFAULT_FILTERS, sort: filters.sort })
              }
            >
              Clear all
            </Button>
          )}
        </div>
      )}
      <Divider className="opacity-60" />
    </div>
  );
}
