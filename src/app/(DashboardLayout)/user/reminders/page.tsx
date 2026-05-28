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

const RemindersPage = () => {
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("feed");
  const [search, setSearch] = useState("");

  const { data: reminderInfo, isLoading } = useGetAllRemindersQuery(undefined);
  const reminders = reminderInfo?.data ?? [];

  console.log(reminders);
  function getFilteredReminders() {
    let filtered = reminders;

    if (filter === "high") {
      filtered = filtered.filter((r) => r.urgency === "high");
    } else if (filter === "medium") {
      filtered = filtered.filter((r) => r.urgency === "medium");
    } else if (filter === "low") {
      filtered = filtered.filter((r) => r.urgency === "low");
    } else if (filter === "wa") {
      filtered = filtered.filter((r) => r.whatsapp === true);
    }

    if (search !== "") {
      filtered = filtered.filter(
        (r) =>
          r.pet.toLowerCase().includes(search.toLowerCase()) ||
          r.record.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filtered;
  }

  function getUniquePets() {
    const petNames = [];
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

  const urgentCount = reminders.filter((r) => r.urgency === "high").length;
  const soonCount = reminders.filter((r) => r.urgency === "medium").length;
  const okCount = reminders.filter((r) => r.urgency === "low").length;
  const overdueCount = reminders.filter((r) => r.urgency === "overdue").length;
  const whatsappCount = reminders.filter((r) => r.whatsapp === true).length;
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
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-3 rounded-full bg-steel-blue dark:bg-lime-burst" />
            <span className="text-[8px] font-black uppercase text-gray-500">
              reminder feed
            </span>
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
              {filteredReminders.map((reminder, idx) => (
                <ReminderCard key={idx} reminder={reminder} />
              ))}
            </div>
          )}

          {view === "grid" && (
            <div className="grid grid-cols-2 gap-3">
              {filteredReminders.map((reminder, idx) => (
                <ReminderGridCard key={idx} reminder={reminder} />
              ))}
            </div>
          )}

          {view === "list" && (
            <div className="space-y-2">
              {filteredReminders.map((reminder, idx) => (
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
