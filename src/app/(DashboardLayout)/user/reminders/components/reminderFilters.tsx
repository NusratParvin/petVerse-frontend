import { Search } from "lucide-react";
import { Button, Input } from "@heroui/react";

type ReminderFiltersProps = {
  urgentCount: number;
  soonCount: number;
  okCount: number;
  overdueCount: number;
  whatsappCount: number;
  allCount: number;
  filter: string;
  setFilter: (filter: string) => void;
  search: string;
  setSearch: (search: string) => void;
};

const ReminderFilters = ({
  urgentCount,
  soonCount,
  okCount,
  overdueCount,
  whatsappCount,
  allCount,
  filter,
  setFilter,
  search,
  setSearch,
}: ReminderFiltersProps) => {
  const filters = [
    { key: "all", label: "All", count: allCount },
    { key: "high", label: "🔥 Urgent", count: urgentCount },
    { key: "medium", label: "⏳ Coming up", count: soonCount },
    { key: "low", label: "✅ Scheduled", count: okCount },
    { key: "overdue", label: "⚠️ Overdue", count: overdueCount },
    { key: "wa", label: "💬 WhatsApp", count: whatsappCount },
  ];

  const getButtonClass = (f: any) => {
    if (filter !== f.key) {
      return "border-gray-200 dark:border-white/40 text-gray-500 dark:text-white/80 bg-transparent";
    }
    if (f.key === "high") {
      return "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400";
    }
    if (f.key === "medium") {
      return "border-steel-blue bg-steel-blue/5 dark:bg-steel-blue/10 text-steel-blue";
    }
    if (f.key === "low") {
      return "border-lime-500 bg-lime-50 dark:bg-lime-burst/5 text-lime-600 dark:text-lime-burst";
    }
    if (f.key === "overdue") {
      return "border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400";
    }
    if (f.key === "wa") {
      return "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400";
    }
    return "border-steel-blue bg-steel-blue/5 text-steel-blue";
  };

  return (
    <div className="flex flex-wrap items-base gap-2 mb-4">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-1 flex-1">
        {filters.map((f) => (
          <Button
            key={f.key}
            size="sm"
            radius="full"
            variant="bordered"
            onPress={() => setFilter(f.key)}
            className={`text-[9px] font-bold px-1 py-0.5 h-6 min-w-fit w-auto border ${getButtonClass(f)}`}
          >
            {f.label}
            {f.count > 0 && (
              <span
                className={`ml-0 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold ${
                  filter === f.key
                    ? f.key === "high"
                      ? "bg-red-500 text-white shadow-sm"
                      : f.key === "medium"
                        ? "bg-steel-blue text-white shadow-sm"
                        : f.key === "low"
                          ? "bg-lime-500 text-black shadow-sm"
                          : f.key === "overdue"
                            ? "bg-orange-500 text-white shadow-sm"
                            : "bg-green-500 text-white shadow-sm"
                    : "bg-gray-300 dark:bg-white/30 text-gray-800 dark:text-white"
                }`}
              >
                {f.count}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Search  */}
      <div className="flex-shrink-0">
        <Input
          size="sm"
          radius="full"
          placeholder="Search by pet or record..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startContent={<Search size={12} className="text-gray-400" />}
          className="w-52"
          classNames={{
            input: "text-[10px]",
            inputWrapper:
              "h-7 min-h-7 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10",
          }}
        />
      </div>
    </div>
  );
};

export default ReminderFilters;
