import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";

const UpcomingReminders = () => {
  const reminders = [
    {
      pet: "Max",
      record: "Rabies Booster",
      vet: "German Vet Clinic",
      dueDate: "2024-04-03",
      dueText: "Due in 4 days",
      urgency: "medium",
      icon: "💉",
      whatsapp: true,
    },
    {
      pet: "Luna",
      record: "Annual Checkup",
      vet: "VetCare Abu Dhabi",
      dueDate: "2024-04-01",
      dueText: "Due in 2 days",
      urgency: "high",
      icon: "🏥",
      whatsapp: false,
    },
    {
      pet: "Max",
      record: "Grooming",
      vet: "Monthly scheduled",
      dueDate: "2024-04-09",
      dueText: "Due in 10 days",
      urgency: "low",
      icon: "✂️",
      whatsapp: false,
    },
  ];

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case "high":
        return {
          borderColor: "#FF4D6D",
          bgLight: "bg-red-50",
          bgDark: "dark:bg-red-950/20",
          textColor: "text-red-600 dark:text-red-400",
          badgeBg: "bg-red-100 dark:bg-red-900/30",
          badgeText: "text-red-700 dark:text-red-300",
          dotColor: "bg-red-500",
        };
      case "medium":
        return {
          borderColor: "#4682B4",
          bgLight: "bg-steel-blue/5",
          bgDark: "dark:bg-steel-blue/10",
          textColor: "text-steel-blue dark:text-steel-blue/80",
          badgeBg: "bg-steel-blue/10 dark:bg-steel-blue/20",
          badgeText: "text-steel-blue dark:text-steel-blue/80",
          dotColor: "bg-steel-blue",
        };
      case "low":
        return {
          borderColor: "#B8FF2E",
          bgLight: "bg-lime-50",
          bgDark: "dark:bg-lime-burst/5",
          textColor: "text-lime-600 dark:text-lime-burst",
          badgeBg: "bg-lime-100 dark:bg-lime-burst/10",
          badgeText: "text-lime-700 dark:text-lime-burst",
          dotColor: "bg-lime-500",
        };
      default:
        return {};
    }
  };

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 rounded-full bg-steel-blue dark:bg-lime-burst" />
          <p className="text-[9px] font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst/80">
            Upcoming Reminders
          </p>
        </div>
        <Link
          href="/user/reminders"
          className="text-[7px] font-semibold text-steel-blue/40 dark:text-white/30 hover:text-steel-blue dark:hover:text-lime-burst"
        >
          View all →
        </Link>
      </div>

      <div className="flex flex-col gap-1.5">
        {reminders.map((r, i) => {
          const urgencyStyle = getUrgencyStyle(r.urgency);
          return (
            <div
              key={i}
              className={`
                  relative rounded-lg transition-all duration-200 hover:scale-[1.01] 
                  overflow-hidden border-l-3 cursor-pointer
                  ${urgencyStyle?.bgLight} ${urgencyStyle?.bgDark}
                `}
              style={{
                borderLeftWidth: "3px",
                borderLeftColor: urgencyStyle?.borderColor,
              }}
            >
              <div className="p-2">
                {/* Compact row layout */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm">{r.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[11px] font-bold text-gray-800 dark:text-white truncate">
                          {r.pet}
                        </p>
                        <span className="text-[9px] text-gray-500 dark:text-white/40">
                          •
                        </span>
                        <p className="text-[10px] font-medium text-gray-600 dark:text-white/60 truncate">
                          {r.record}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin
                          size={8}
                          className="text-steel-blue/40 dark:text-white/30"
                        />
                        <span className="text-[8px] text-steel-blue/40 dark:text-white/30 truncate">
                          {r.vet}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - due date and WhatsApp logo */}
                  <div className="flex items-center gap-1.5 ml-2">
                    <div className="flex items-center gap-1">
                      <Clock
                        size={8}
                        className="text-steel-blue/40 dark:text-white/30"
                      />
                      <span
                        className={`text-[8px] font-semibold ${urgencyStyle?.textColor}`}
                      >
                        {r.dueText}
                      </span>
                    </div>
                    {r.whatsapp && (
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-all">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-3 h-3"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
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
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingReminders;
