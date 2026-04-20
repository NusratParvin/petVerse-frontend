"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAppSelector } from "@/src/redux/hooks";
import { Avatar } from "@heroui/react";

import { navItems } from "./menuConstants";
import MenuSection from "./menuSection";
import PetSection from "./petSection/petSection";

export default function LeftSidebar() {
  const user = useAppSelector(useCurrentUser);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden h-14 flex items-center justify-around px-4 backdrop-blur-xl bg-white/95 dark:bg-bg/95 border-t border-steel-blue/20 dark:border-steel-blue/30">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

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
                <Icon size={14} />
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
      <aside className="hidden lg:flex fixed top-12   h-[calc(100vh-50px)] left-0   w-[220px] flex-col z-40 overflow-y-auto transition-all duration-500 bg-white dark:bg-bg border-r border-steel-blue/10 dark:border-lime-burst/20 custom-scrollbar ">
        {/* My Pets Section */}
        <PetSection />

        {/* Navigation Section */}
        <MenuSection />

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
