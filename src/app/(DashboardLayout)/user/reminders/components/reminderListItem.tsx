"use client";

import { MapPin, Calendar, User } from "lucide-react";
import { RECORD_LABEL, recordIcon, TReminder } from "@/src/types";
import { Chip } from "@heroui/react";

const getUrgencyStyle = (urgency: string) => {
  if (urgency === "high") {
    return {
      textColor: "text-red-600 dark:text-red-400",
      badgeBg: "bg-red-500",
      badgeText: "text-white",
      borderColor: "#FFE0E0",
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

function WhatsAppIcon() {
  return (
    <div className="w-6 h-6 rounded-full bg-[#25D366]/15 flex items-center justify-center transition-all hover:bg-[#25D366]/25">
      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none">
        <path
          d="M12.032 2.5C6.764 2.5 2.5 6.764 2.5 12.032c0 1.84.48 3.63 1.384 5.212l-1.456 4.728 4.9-1.408a9.485 9.485 0 0 0 4.704 1.22c5.268 0 9.532-4.264 9.532-9.532 0-5.268-4.264-9.532-9.532-9.532z"
          fill="#25D366"
        />
        <path
          d="M16.968 13.744c-.288-.144-1.704-.84-1.968-.936-.264-.096-.456-.144-.648.144-.192.288-.744.936-.912 1.128-.168.192-.336.216-.624.072-.288-.144-1.216-.448-2.312-1.424-.856-.76-1.432-1.696-1.6-1.984-.168-.288-.016-.444.128-.588.128-.128.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.24-.576-.48-.48-.648-.48-.168 0-.36-.024-.552-.024-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4 0 1.416 1.032 2.784 1.176 2.976.144.192 2.04 3.096 4.92 4.344 2.88 1.248 2.88.832 3.4.78.52-.048 1.68-.672 1.92-1.32.24-.648.24-1.2.168-1.32-.072-.12-.264-.192-.552-.336z"
          fill="white"
        />
      </svg>
    </div>
  );
}

const ReminderListItem = ({ reminder }: { reminder: TReminder }) => {
  const style = getUrgencyStyle(reminder.urgency);
  const icon = recordIcon[reminder.type] || "📋";

  return (
    <div
      className="rounded-md border dark:border-0  bg-gray-50 dark:bg-gray-900 overflow-hidden hover:shadow-md transition-shadow p-3"
      style={{ borderColor: style.borderColor }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-base">
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900 dark:text-white/90">
                {RECORD_LABEL[reminder.type]}
              </span>
              <span className="text-[10px] text-steel-blue dark:text-lime-burst">
                @{reminder.pet}
              </span>
            </div>
            {/* <div className="font-medium text-xs text-gray-800 dark:text-gray-200 mt-1">
              {reminder.record}
            </div> */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
                <User size={10} /> Dr. {reminder.vet}
              </span>
              <span className="text-[10px] text-gray-400">•</span>

              <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
                <MapPin size={10} /> {reminder.clinicName}
              </span>
              <span className="text-[10px] text-gray-400">•</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
                <Calendar size={10} /> {reminder.dueDate}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold ${style.textColor}`}>
            {reminder.dueText}
          </span>
          {reminder.whatsapp && <WhatsAppIcon />}
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
            className="text-[9px] font-bold h-auto px-2 py-1"
          >
            {getUrgencyLabel(reminder.urgency)}
          </Chip>
        </div>
      </div>
    </div>
  );
};

export default ReminderListItem;
