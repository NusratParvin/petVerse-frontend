import { useGetAllRemindersQuery } from "@/src/redux/features/pets/petsApi";
import { TReminder } from "@/src/types";

export const useReminderBadge = () => {
  const { data: reminderInfo } = useGetAllRemindersQuery(undefined);
  const reminders = reminderInfo?.data ?? [];

  // Count urgent + overdue
  const badgeCount = reminders.filter(
    (r: TReminder) => r.urgency === "high" || r.urgency === "overdue",
  ).length;
  //   console.log(badgeCount);
  return badgeCount > 0 ? badgeCount : null;
};
