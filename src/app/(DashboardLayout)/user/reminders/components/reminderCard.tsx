"use client";

import { Calendar, MapPin, Bell, User } from "lucide-react";
import { RECORD_LABEL, recordIcon, TReminder } from "@/src/types";
import { Chip } from "@heroui/react";

const getUrgencyStyle = (urgency: string) => {
  if (urgency === "high") {
    return {
      textColor: "text-red-600 dark:text-red-400",
      badgeBg: "bg-red-500",
      badgeText: "text-white",
      borderColor: "#FFE0E0", // Very light red/pink
    };
  }
  if (urgency === "medium") {
    return {
      textColor: "text-steel-blue dark:text-steel-blue/80",
      badgeBg: "bg-steel-blue",
      badgeText: "text-white",
      borderColor: "#E0F0FF",
    };
  }
  if (urgency === "overdue") {
    return {
      textColor: "text-orange-600 dark:text-orange-400",
      badgeBg: "bg-orange-500",
      badgeText: "text-white",
      borderColor: "#FFF0E0",
    };
  }
  return {
    textColor: "text-lime-600 dark:text-lime-burst",
    badgeBg: "bg-lime-500",
    badgeText: "text-black dark:text-white",
    borderColor: "#F0FFD6",
  };
};

function getUrgencyLabel(urgency: string) {
  if (urgency === "high") return "🔥 Urgent";
  if (urgency === "medium") return "⏳ Coming up";
  if (urgency === "overdue") return "⚠️ Overdue";
  return "✅ Scheduled";
}

const ReminderCard = ({ reminder }: { reminder: TReminder }) => {
  const style = getUrgencyStyle(reminder.urgency);
  const icon = recordIcon[reminder.type] || "📋";

  return (
    <div
      className="rounded-md border dark:border-dotted  dark:border-gray-700overflow-hidden hover:shadow-md transition-shadow bg-gray-50 dark:bg-transparent"
      style={{ borderColor: style.borderColor }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xl">
              {icon}
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">
                {RECORD_LABEL[reminder.type]}
              </div>
              <div className="text-[11px] text-steel-blue dark:text-lime-burst font-normal">
                @{reminder.pet}
              </div>
            </div>
          </div>

          <Chip
            size="sm"
            radius="full"
            variant="flat"
            color={
              reminder.urgency === "high"
                ? "danger"
                : reminder.urgency === "medium"
                  ? "primary"
                  : reminder.urgency === "overdue"
                    ? "warning"
                    : "success"
            }
            className="text-[11px] font-bold h-auto min-w-[90px] justify-center px-4 py-1.5"
          >
            {getUrgencyLabel(reminder.urgency)}
          </Chip>
        </div>

        {/* Record name */}
        <div className="mb-3">
          <div className="font-medium text-xs text-gray-800 dark:text-gray-200 mb-2  ">
            {reminder.record}
          </div>
          <div className="flex items-center gap-3  ">
            {/* Vet name */}
            <div className="flex items-center gap-1.5">
              <User size={11} className="flex-shrink-0 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Dr. {reminder.vet}
              </span>
            </div>

            {/* Separator */}
            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />

            {/* Clinic */}
            <div className="flex items-center gap-1.5">
              <MapPin size={11} className="flex-shrink-0 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {reminder.clinicName}
              </span>
            </div>
          </div>
        </div>

        {/* Due date */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Bell size={12} className={style.textColor} />
            <span className={`text-xs font-semibold ${style.textColor}`}>
              {reminder.dueText}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            <span>{reminder.dueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
