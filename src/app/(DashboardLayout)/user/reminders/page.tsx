"use client";

import { useState } from "react";
import ReminderHeader from "./components/reminderHeader";
import ReminderFilters from "./components/reminderFilters";
import PetStories from "./components/petStories";
import ReminderCard from "./components/reminderCard";
import ReminderGridCard from "./components/reminderGridCard";
import ReminderListItem from "./components/reminderListItem";
import { Spinner } from "@heroui/react";
import { useGetAllRemindersQuery } from "@/src/redux/features/pets/petsApi";
import { TReminder } from "@/src/types";

const RemindersPage = () => {
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("feed");
  const [search, setSearch] = useState("");

  const { data: reminderInfo, isLoading } = useGetAllRemindersQuery(undefined);
  const reminders = reminderInfo?.data ?? [];

  // console.log(reminders);

  const getFilteredReminders = () => {
    let filteredReminders = reminders;
    const urgencyFilters = ["high", "medium", "low", "overdue"];

    if (urgencyFilters.includes(filter)) {
      filteredReminders = filteredReminders.filter(
        (r: TReminder) => r.urgency === filter,
      );
    } else if (filter === "wa") {
      filteredReminders = filteredReminders.filter(
        (r: TReminder) => r.whatsapp === true,
      );
    }

    if (search !== "") {
      filteredReminders = filteredReminders.filter(
        (r: TReminder) =>
          r.pet.toLowerCase().includes(search.toLowerCase()) ||
          r.record.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filteredReminders;
  };

  function getUniquePets() {
    const petNames: string[] = [];
    const uniquePets = [];

    for (let i = 0; i < reminders.length; i++) {
      const pet = reminders[i];
      if (!petNames.includes(pet.pet)) {
        petNames.push(pet.pet);
        uniquePets.push(pet);
      }
    }

    return uniquePets;
  }

  const urgentCount = reminders.filter(
    (r: TReminder) => r.urgency === "high",
  ).length;
  const soonCount = reminders.filter(
    (r: TReminder) => r.urgency === "medium",
  ).length;
  const okCount = reminders.filter(
    (r: TReminder) => r.urgency === "low",
  ).length;
  const overdueCount = reminders.filter(
    (r: TReminder) => r.urgency === "overdue",
  ).length;
  const whatsappCount = reminders.filter(
    (r: TReminder) => r.whatsapp === true,
  ).length;
  const allCount = reminders.length;

  const filteredReminders = getFilteredReminders();
  const uniquePets = getUniquePets();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-transparent flex items-center justify-center">
        <Spinner size="lg" label="Loading  ..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-transparent text-gray-900 dark:text-white sm:p-4 p-3 mb-16">
      <div className="w-full mx-auto">
        <ReminderHeader
          remindersCount={reminders.length}
          view={view}
          setView={setView}
        />

        <ReminderFilters
          urgentCount={urgentCount}
          soonCount={soonCount}
          okCount={okCount}
          overdueCount={overdueCount}
          whatsappCount={whatsappCount}
          allCount={allCount}
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
        />

        {uniquePets.length > 0 && (
          <PetStories
            uniquePets={uniquePets}
            reminders={reminders}
            setSearch={setSearch}
          />
        )}

        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[10px] font-black uppercase text-gray-500 dark:text-white/70 tracking-wide">
              Reminder Feed
            </p>
          </div>

          {filteredReminders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <span className="text-4xl block mb-2">🐾</span>
              <p className="text-sm font-medium">No reminders found</p>
              <p className="text-xs mt-1">
                Try changing your filters or search
              </p>
            </div>
          )}

          {view === "feed" && (
            <div className="space-y-3">
              {filteredReminders.map((reminder: TReminder, idx: number) => (
                <ReminderCard key={idx} reminder={reminder} />
              ))}
            </div>
          )}

          {view === "grid" && (
            <div className="grid grid-cols-2 gap-3">
              {filteredReminders.map((reminder: TReminder, idx: number) => (
                <ReminderGridCard key={idx} reminder={reminder} />
              ))}
            </div>
          )}

          {view === "list" && (
            <div className="space-y-2">
              {filteredReminders.map((reminder: TReminder, idx: number) => (
                <ReminderListItem key={idx} reminder={reminder} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default RemindersPage;
