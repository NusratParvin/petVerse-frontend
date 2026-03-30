"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PawPrint,
  Plus,
  ChevronRight,
  Heart,
  Stethoscope,
  Bell,
  Users,
  User,
  FileText,
} from "lucide-react";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAppSelector } from "@/src/redux/hooks";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Avatar } from "@heroui/react";

// Mock pets — replace with real Redux data later
const myPets = [
  { id: "1", name: "Max", breed: "Golden Retriever", emoji: "🐕" },
  { id: "2", name: "Luna", breed: "Persian Cat", emoji: "🐈" },
  { id: "3", name: "Kiwi", breed: "Cockatiel", emoji: "🦜" },
];

// Navigation items with icons
const navItems = [
  { href: "/user/newsfeed", label: "News Feed", icon: <PawPrint size={14} /> },
  { href: "/user/pets", label: "My Pets", icon: <Heart size={14} /> },
  { href: "/user/health", label: "Health", icon: <Stethoscope size={14} /> },
  {
    href: "/user/reminders",
    label: "Reminders",
    icon: <Bell size={14} />,
    badge: 2,
  },
  { href: "/user/create", label: "Create", icon: <FileText size={14} /> },
  { href: "/user/friends", label: "Friends", icon: <Users size={14} /> },
  { href: "/user/profile", label: "Profile", icon: <User size={14} /> },
];

export default function MenuSidebar() {
  const user = useAppSelector(useCurrentUser);
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && (theme === "petverse-dark" || theme === "dark");

  return (
    // <>
    //   {/* Mobile Bottom Navigation */}
    //   <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden h-14 flex items-center justify-around px-4 backdrop-blur-xl  bg-white/95 dark:bg-[#0A0F1E]/95 border-t border-steel-blue/10 dark:border-steel-blue/20 transition-all duration-500">
    //     {navItems.slice(0, 5).map((item) => {
    //       const isActive = pathname === item.href;
    //       return (
    //         <Link
    //           key={item.href}
    //           href={item.href}
    //           className="flex flex-col items-center gap-0.5"
    //         >
    //           <div
    //             className={`p-1.5 rounded-lg transition-all ${isActive ? "scale-105" : ""}`}
    //             style={{
    //               color: isActive
    //                 ? "#B8FF2E"
    //                 : isDark
    //                   ? "rgba(255,255,255,0.5)"
    //                   : "#4682B4",
    //               background: isActive
    //                 ? "rgba(184, 255, 46, 0.15)"
    //                 : "transparent",
    //             }}
    //           >
    //             {item.icon}
    //           </div>
    //           <span
    //             className="text-[9px] font-medium"
    //             style={{
    //               color: isActive
    //                 ? "#B8FF2E"
    //                 : isDark
    //                   ? "rgba(255,255,255,0.4)"
    //                   : "#4682B4",
    //             }}
    //           >
    //             {item.label}
    //           </span>
    //         </Link>
    //       );
    //     })}
    //   </nav>

    //   {/* Desktop Sidebar - Compact */}
    //   <aside
    //     className="hidden lg:flex fixed top-0 left-0 h-screen w-[220px] flex-col z-40 pt-14  backdrop-blur-2xl transition-all duration-500"
    //     // style={{
    //     //   background: isDark
    //     //     ? "linear-gradient(180deg, rgba(10, 20, 30, 0.98) 0%, rgba(5, 12, 20, 0.98) 100%)"
    //     //     : "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 255, 0.98) 100%)",
    //     //   borderRight: `1px solid ${isDark ? "rgba(70, 130, 180, 0.2)" : "rgba(70, 130, 180, 0.1)"}`,
    //     // }}
    //     style={{
    //       background: isDark ? "rgba(2,8,18,0.55)" : "rgba(255,255,255,0.75)",
    //       borderRight: isDark
    //         ? "1px solid rgba(255,255,255,0.04)"
    //         : "1px solid rgba(30,80,200,0.08)",
    //     }}
    //   >
    //     {/* My Pets Section - Compact */}
    //     <div className="px-3 pt-3 pb-2">
    //       <div className="flex items-center justify-between mb-2 px-1">
    //         <p className="text-xs font-semibold uppercase tracking-wider dark:text-lime-burst/70 text-steel-blue">
    //           My Pets
    //         </p>
    //         <span className="text-[8px] px-1.5 py-0.5 rounded-full dark:bg-lime-burst/15 bg-steel-blue/10 dark:text-lime-burst text-steel-blue">
    //           {myPets.length}
    //         </span>
    //       </div>

    //       {/* Background Container - like the image */}
    //       <div className="bg-steel-blue/70 dark:bg-steel-blue/40 rounded-2xl overflow-hidden py-3">
    //         <div className="divide-y  divide-white/50 px-4">
    //           {myPets.map((pet) => (
    //             <Link
    //               key={pet.id}
    //               href={`/user/pets/${pet.id}`}
    //               className="flex items-center gap-2  py-2 transition-all group hover:bg-steel-blue/5 dark:hover:bg-white/5"
    //               style={{
    //                 background:
    //                   pathname === `/user/pets/${pet.id}`
    //                     ? isDark
    //                       ? "rgba(70, 130, 180, 0.25)"
    //                       : "rgba(70, 130, 180, 0.1)"
    //                     : "transparent",
    //               }}
    //             >
    //               <div className="w-7 h-7 flex items-center justify-center text-2xl ">
    //                 {pet.emoji}
    //               </div>
    //               <div className="flex-1 min-w-0">
    //                 <p className="text-[12px] font-bold leading-tight dark:text-white text-gray-800 truncate">
    //                   {pet.name}
    //                 </p>
    //                 <p className="text-[10px] mt-0 text-lime-burst dark:text-white/50  truncate">
    //                   {pet.breed}
    //                 </p>
    //               </div>
    //               <ChevronRight
    //                 size={14}
    //                 className="opacity-0 group-hover:opacity-100 text-lime-burst transition-opacity"
    //               />
    //             </Link>
    //           ))}
    //         </div>
    //       </div>

    //       {/* Add Pet Button */}
    //       <button className="w-full mt-2 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-dashed dark:border-lime-burst border-steel-blue dark:text-lime-burst text-steel-blue dark:bg-lime-burst/5 bg-steel-blue/5 hover:dark:bg-lime-burst/10 hover:bg-steel-blue/10">
    //         <Plus size={16} />
    //         Add a pet
    //       </button>
    //     </div>

    //     {/* Divider - Thin */}
    //     {/* <div className="mx-3 my-1 h-px bg-gradient-to-r from-transparent via-steel-blue/40 to-transparent" /> */}

    //     {/* Navigation Section - Compact */}
    //     <div className="px-3 py-2 flex-1">
    //       <div className="flex items-center gap-1.5 my-2 px-1">
    //         {/* <div className="w-1 h-3 rounded-full bg-gradient-to-b from-steel-blue to-lime-burst" /> */}
    //         <p className="text-xs font-semibold uppercase tracking-wider dark:text-lime-burst/70 text-steel-blue">
    //           Navigate
    //         </p>
    //       </div>

    //       <div className="space-y-0.5">
    //         {navItems.map((item) => {
    //           const isActive = pathname === item.href;
    //           return (
    //             <Link
    //               key={item.href}
    //               href={item.href}
    //               className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all group ${
    //                 isActive ? "dark:bg-lime-burst/10 bg-steel-blue/10" : ""
    //               }`}
    //             >
    //               <div
    //                 className={`p-1 rounded-md transition-all ${isActive ? "scale-105" : "group-hover:scale-105"}`}
    //                 style={{
    //                   color: isActive
    //                     ? "#B8FF2E"
    //                     : isDark
    //                       ? "rgba(255,255,255,0.5)"
    //                       : "#4682B4",
    //                   background: isActive
    //                     ? isDark
    //                       ? "rgba(184, 255, 46, 0.15)"
    //                       : "rgba(70, 130, 180, 0.1)"
    //                     : "transparent",
    //                 }}
    //               >
    //                 {item.icon}
    //               </div>
    //               <span
    //                 className="text-xs font-medium"
    //                 style={{
    //                   color: isActive
    //                     ? "#B8FF2E"
    //                     : isDark
    //                       ? "rgba(255,255,255,0.7)"
    //                       : "rgba(70, 130, 180, 0.8)",
    //                 }}
    //               >
    //                 {item.label}
    //               </span>
    //               {item.badge && (
    //                 <span className="ml-auto text-[8px] font-bold px-1 py-0.5 rounded-full bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] text-white">
    //                   {item.badge}
    //                 </span>
    //               )}
    //             </Link>
    //           );
    //         })}
    //       </div>
    //     </div>

    //     {/* Footer - Compact */}
    //     <div
    //       className="px-3 py-3 mt-auto border-t"
    //       style={{
    //         borderColor: isDark
    //           ? "rgba(70, 130, 180, 0.1)"
    //           : "rgba(70, 130, 180, 0.08)",
    //       }}
    //     >
    //       <div className="p-2 rounded-lg bg-gradient-to-br from-steel-blue/10 to-lime-burst/5">
    //         <div className="flex items-center gap-2">
    //           <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br from-steel-blue to-lime-burst text-[10px]">
    //             🐾
    //           </div>
    //           <div className="flex-1 min-w-0">
    //             <p className="text-[10px] font-semibold dark:text-white text-gray-900 truncate">
    //               {user?.name || "Pet Lover"}
    //             </p>
    //             <p className="text-[8px] dark:text-white/40 text-steel-blue/60 truncate">
    //               {user?.email || "happy@pets.com"}
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </aside>

    //   {/* Mobile padding */}
    //   <div className="lg:hidden h-14" />
    // </>

    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden h-14 flex items-center justify-around px-4 backdrop-blur-xl bg-white/95 dark:bg-pv-bg/95 border-t border-steel-blue/20 dark:border-steel-blue/30">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 group"
            >
              <div
                className={`
                  p-1.5 rounded-lg transition-all duration-200
                  ${isActive ? "scale-110" : "group-hover:scale-105"}
                  ${
                    isActive
                      ? "bg-lime-burst/20 text-lime-burst"
                      : "text-steel-blue dark:text-white/50"
                  }
                `}
              >
                {item.icon}
              </div>
              <span
                className={`
                  text-[9px] font-medium transition-colors duration-200
                  ${
                    isActive
                      ? "text-lime-burst"
                      : "text-steel-blue dark:text-white/40"
                  }
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex fixed top-0 left-0 h-screen w-[220px] flex-col z-40 overflow-y-auto transition-all duration-500 bg-white dark:bg-pv-bg border-r border-steel-blue/10 dark:border-lime-burst/20 custom-scrollbar"
        style={{ top: "56px", height: "calc(100vh - 56px)" }}
      >
        {/* My Pets Section */}
        <div className="px-3 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst/90">
              MY PETS
            </p>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold bg-steel-blue dark:bg-lime-burst/20 text-white dark:text-lime-burst">
              {myPets.length}
            </span>
          </div>

          {/* Pets Container */}
          <div className="rounded-xl overflow-hidden   border-steel-blue/30 dark:border-lime-burst/25 bg-steel-blue/10 dark:bg-lime-burst/5">
            <div className="divide-y divide-steel-blue/25 dark:divide-lime-burst/15 px-2.5">
              {myPets.map((pet) => {
                const isActive = pathname === `/user/pets/${pet.id}`;
                return (
                  <Link
                    key={pet.id}
                    href={`/user/pets/${pet.id}`}
                    className={`
                      flex items-center gap-2.5 px-0 py-2 transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-steel-blue/20 dark:bg-lime-burst/20"
                          : "hover:bg-steel-blue/10 dark:hover:bg-lime-burst/10"
                      }
                    `}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-lg bg-steel-blue/25 dark:bg-lime-burst/15">
                      {pet.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold leading-tight truncate text-gray-800 dark:text-white">
                        {pet.name}
                      </p>
                      <p className="text-[9px] mt-0.5 truncate text-steel-blue dark:text-lime-burst/80">
                        {pet.breed}
                      </p>
                    </div>
                    <ChevronRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-steel-blue dark:text-lime-burst"
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Add Pet Button */}
          <button className="group w-full mt-2 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all duration-200 border border-dashed border-lime-burst text-steel-blue bg-lime-burst/70 hover:bg-lime-burst/90 hover:scale-[1.02] dark:border-lime-burst dark:text-lime-burst dark:bg-lime-burst/5 dark:hover:bg-lime-burst/15">
            <Plus
              size={12}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
            ADD A PET
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-2">
          <p className=" mb-3 text-[10px] font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst/90">
            NAVIGATE
          </p>

          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-2.5 py-1.5 rounded-none transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-steel-blue/100 text-white dark:bg-lime-burst/20 border-l-2 border-steel-blue dark:border-lime-burst"
                        : "hover:bg-steel-blue/15 dark:hover:bg-lime-burst/10"
                    }
                  `}
                >
                  <div
                    className={`
                      p-1 rounded-md transition-all duration-200
                      ${isActive ? "scale-110" : "group-hover:scale-110"}
                      ${
                        isActive
                          ? "bg-steel-blue/20 dark:bg-lime-burst/20 text-lime-burst dark:text-lime-burst"
                          : "text-steel-blue dark:text-white/60"
                      }
                    `}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`
                      text-[11px] font-semibold transition-colors duration-200
                      ${
                        isActive
                          ? "text-white dark:text-lime-burst"
                          : "text-gray-700 dark:text-white/80"
                      }
                    `}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-pv-coral to-[#FF6B8A] text-white  shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-3 mt-auto border-t border-steel-blue/20 dark:border-lime-burst/15">
          <div className="p-1.5 rounded-lg bg-steel-blue/10 dark:bg-lime-burst/8">
            <div className="flex items-center gap-2">
              <Avatar
                src={
                  user?.profilePhoto ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                name={user?.name || "Pet Lover"}
                size="sm"
                className="w-6 h-6 text-[10px]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold truncate text-gray-800 dark:text-white">
                  {user?.name || "Pet Lover"}
                </p>
                <p className="text-[7px] truncate text-steel-blue/70 dark:text-lime-burst/60">
                  {user?.email || "happy@pets.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile padding */}
      <div className="lg:hidden h-14" />
    </>
  );
}
