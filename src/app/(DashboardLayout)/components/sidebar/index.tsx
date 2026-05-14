"use client";

import SuggestedAuthor from "../../user/components/suggestedAuthor";
import SuggestedArticles from "../../user/components/suggestedArticles";
import InsuranceCard from "../../user/components/insuranceCard";
import UpcomingReminders from "../../user/components/upcomingReminders";
import QuickAccess from "../../user/components/quickAccess";

export default function Sidebar() {
  return (
    <div className="flex flex-col border-none bg-transparent gap-4">
      {/*   Quick Access Section   */}
      <QuickAccess />

      {/*   Upcoming Reminders Section   */}
      <UpcomingReminders />

      {/*   Insurance Card - Premium Design   */}
      <InsuranceCard />

      {/*   Divider   */}
      <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-steel-blue/40 to-transparent dark:via-lime-burst/30" />

      {/*   Suggested Content Sections   */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-steel-blue dark:bg-lime-burst" />
          <p className="text-[10px] font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst/80">
            Suggested for you
          </p>
        </div>
      </div>

      <div className="min-h-[40vh]">
        <SuggestedAuthor />
      </div>
      <div className="min-h-[50vh]">
        <SuggestedArticles />
      </div>
    </div>
  );
}
