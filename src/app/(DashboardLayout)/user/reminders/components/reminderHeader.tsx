import { Button, Tooltip } from "@heroui/react";
import { LayoutDashboard, LayoutGrid, List } from "lucide-react";

type TView = "feed" | "grid" | "list";

type HeaderProps = {
  remindersCount: number;
  view: string;
  setView: (view: TView) => void;
};
const ReminderHeader = ({ remindersCount, view, setView }: HeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            🗓️ Your pets' reminders
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs ms-6 mt-1">
            {remindersCount} health events
          </p>
        </div>

        <div className="flex bg-white dark:bg-white/5 rounded-full p-1 gap-1">
          <Tooltip content="Feed view" placement="top" className="text-xs">
            <Button
              isIconOnly
              size="sm"
              radius="full"
              variant="light"
              onPress={() => setView("feed")}
              className={`min-w-0 w-7 h-7 ${view === "feed" ? "bg-steel-blue/20 text-steel-blue" : "text-gray-400"}`}
            >
              <LayoutDashboard size={14} />
            </Button>
          </Tooltip>

          <Tooltip content="Grid view" placement="top" className="text-xs">
            <Button
              isIconOnly
              size="sm"
              radius="full"
              variant="light"
              onPress={() => setView("grid")}
              className={`min-w-0 w-7 h-7 ${view === "grid" ? "bg-steel-blue/20 text-steel-blue" : "text-gray-400"}`}
            >
              <LayoutGrid size={14} />
            </Button>
          </Tooltip>

          <Tooltip content="List view" placement="top" className="text-xs">
            <Button
              isIconOnly
              size="sm"
              radius="full"
              variant="light"
              onPress={() => setView("list")}
              className={`min-w-0 w-7 h-7 ${view === "list" ? "bg-steel-blue/20 text-steel-blue" : "text-gray-400"}`}
            >
              <List size={14} />
            </Button>
          </Tooltip>
        </div>
      </div>
    </>
  );
};
export default ReminderHeader;
