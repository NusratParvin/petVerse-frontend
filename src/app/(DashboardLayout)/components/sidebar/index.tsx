// "use client";
// import Link from "next/link";
// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";
// import SuggestedAuthor from "../../user/components/suggestedAuthor";
// import SuggestedArticles from "../../user/components/suggestedArticles";

// export default function Sidebar() {
//   const { theme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => setMounted(true), []);
//   const isDark = mounted && (theme === "petverse-dark" || theme === "dark");

//   const quickTools = [
//     { icon: "✈️", label: "Import Wizard", href: "/user/import-wizard" },
//     { icon: "🏥", label: "Find a Vet", href: "/user/vet-finder" },
//     { icon: "🛡️", label: "Insurance", href: "/user/insurance" },
//     { icon: "🔍", label: "Lost & Found", href: "/user/lost-found" },
//   ];

//   const reminders = [
//     {
//       pet: "Max",
//       record: "Rabies Booster",
//       vet: "German Vet Clinic",
//       due: "Due in 4 days",
//       color: "steel-blue",
//       whatsapp: true,
//     },
//     {
//       pet: "Luna",
//       record: "Annual Checkup",
//       vet: "VetCare Abu Dhabi",
//       due: "Due in 2 days",
//       color: "lime-burst",
//       whatsapp: false,
//     },
//     {
//       pet: "Max",
//       record: "Grooming",
//       vet: "Monthly scheduled",
//       due: "Due in 10 days",
//       color: "steel-blue",
//       whatsapp: false,
//     },
//   ];

//   return (
//     <div className="flex flex-col border-none bg-transparent">
//       {/* ── Quick Tools ── */}
//       <div className="px-4 pt-4 pb-2">
//         <p className="text-xs font-semibold mb-3 text-gray-800 dark:text-white/70">
//           Quick Tools
//         </p>
//         <div className="grid grid-cols-2 gap-2 mb-4">
//           {quickTools.map((tool) => (
//             <Link
//               key={tool.href}
//               href={tool.href}
//               className="flex flex-col items-center justify-center py-3 rounded-xl text-center transition-all duration-200 hover:scale-105 bg-white/80 dark:bg-white/5 border border-steel-blue/10 dark:border-white/10 hover:border-steel-blue/30 dark:hover:border-lime-burst/30"
//             >
//               <span className="text-lg mb-1">{tool.icon}</span>
//               <span className="text-[10px] text-steel-blue/60 dark:text-white/50">
//                 {tool.label}
//               </span>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* ── Upcoming Reminders ── */}
//       <div className="px-4 pb-3">
//         <p className="text-xs font-semibold mb-3 text-gray-800 dark:text-white/70">
//           Upcoming Reminders
//         </p>
//         <div className="flex flex-col gap-2">
//           {reminders.map((r, i) => (
//             <div
//               key={i}
//               className="px-3 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] bg-white/80 dark:bg-white/5 border border-steel-blue/10 dark:border-white/10"
//             >
//               <p className="text-xs font-medium text-gray-800 dark:text-white/85">
//                 {r.pet} — {r.record}
//               </p>
//               <p className="text-[10px] mt-[2px] text-steel-blue/50 dark:text-white/30">
//                 {r.vet}
//               </p>
//               <p
//                 className={`text-[10px] mt-1 font-medium flex items-center gap-1 text-${r.color} dark:text-${r.color}`}
//               >
//                 🕐 {r.due} {r.whatsapp && "· WhatsApp set"}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── Insurance nudge ── */}
//       <div className="mx-4 mb-3 px-4 py-3 rounded-xl bg-gradient-to-br from-steel-blue/10 to-steel-blue/5 dark:from-steel-blue/15 dark:to-steel-blue/5 border border-steel-blue/20 dark:border-steel-blue/25">
//         <p className="text-xs font-semibold mb-1 text-gray-800 dark:text-white">
//           Is Max insured? 🐾
//         </p>
//         <p className="text-[10px] mb-2 leading-relaxed text-steel-blue/60 dark:text-white/45">
//           Only 10% of UAE pets are covered. An emergency vet bill can reach AED
//           15,000.
//         </p>
//         <Link
//           href="/user/insurance"
//           className="block text-center text-[11px] font-semibold py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] bg-steel-blue dark:bg-lime-burst text-white dark:text-gray-900"
//         >
//           Compare Plans →
//         </Link>
//       </div>

//       {/* ── Divider ── */}
//       <div className="mx-4 mb-2 h-px bg-gradient-to-r from-transparent via-steel-blue/30 to-transparent dark:via-lime-burst/30" />

//       {/* ── Existing components ── */}
//       <div className="min-h-[40vh]">
//         <SuggestedAuthor />
//       </div>
//       <div className="min-h-[50vh]">
//         <SuggestedArticles />
//       </div>
//     </div>
//   );
// }

"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";
import SuggestedAuthor from "../../user/components/suggestedAuthor";
import SuggestedArticles from "../../user/components/suggestedArticles";
import InsuranceCard from "../../user/components/insuranceCard";
import UpcomingReminders from "../../user/components/upcomingReminders";
import QuickTools from "../../user/components/quickTools";

export default function Sidebar() {
  return (
    <div className="flex flex-col border-none bg-transparent gap-4">
      {/* ── Quick Tools Section ── */}
      <QuickTools />

      {/* ── Upcoming Reminders Section ── */}
      <UpcomingReminders />

      {/* ── Insurance Card - Premium Design ── */}
      <InsuranceCard />

      {/* ── Divider ── */}
      <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-steel-blue/40 to-transparent dark:via-lime-burst/30" />

      {/* ── Suggested Content Sections ── */}
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
