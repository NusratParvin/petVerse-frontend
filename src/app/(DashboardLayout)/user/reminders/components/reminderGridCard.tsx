import { MapPin } from "lucide-react";
import { recordIcon } from "@/src/types";

function getUrgencyStyle(urgency) {
  if (urgency === "high") {
    return {
      bgLight: "bg-red-50 dark:bg-red-950/20",
      textColor: "text-red-600 dark:text-red-400",
    };
  }
  if (urgency === "medium") {
    return {
      bgLight: "bg-steel-blue/5 dark:bg-steel-blue/10",
      textColor: "text-steel-blue dark:text-steel-blue/80",
    };
  }
  return {
    bgLight: "bg-lime-50 dark:bg-lime-burst/5",
    textColor: "text-lime-600 dark:text-lime-burst",
  };
}

function getPetHandle(petName) {
  return "@" + petName.toLowerCase().replace(/\s/g, "_") + "_pet";
}

function WhatsAppIcon() {
  return (
    <div className="w-5 h-5 rounded-full bg-[#25D366]/10 flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none">
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

const ReminderGridCard = ({ reminder }) => {
  const style = getUrgencyStyle(reminder.urgency);
  const icon = recordIcon[reminder.type] || "📋";

  return (
    <div className="bg-white dark:bg-[#1d1b2e] border border-gray-200 rounded-2xl overflow-hidden">
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-base ${style.bgLight}`}
          >
            {icon}
          </div>
          <div>
            <div className="font-black text-xs">{reminder.pet}</div>
            <div className="text-[8px] text-gray-500">
              {getPetHandle(reminder.pet)}
            </div>
          </div>
        </div>

        <div className="font-bold text-xs mb-1 line-clamp-1">
          {reminder.record}
        </div>

        <div className="flex items-center gap-1 text-[8px] text-gray-500 mb-2">
          <MapPin size={8} /> {reminder.vet.split(" ").slice(0, 2).join(" ")}
        </div>

        <div
          className={`flex justify-between items-center ${style.bgLight} rounded-lg p-1`}
        >
          <span className={`text-[8px] font-black ${style.textColor}`}>
            {reminder.dueText}
          </span>
          {reminder.whatsapp && <WhatsAppIcon />}
        </div>
      </div>
    </div>
  );
};
export default ReminderGridCard;
