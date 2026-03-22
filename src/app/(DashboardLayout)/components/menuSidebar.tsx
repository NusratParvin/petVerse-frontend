"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PawPrint, Plus } from "lucide-react";

import { adminLinks, userLinks } from "./sidebar/constants";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAppSelector } from "@/src/redux/hooks";

// Mock pets — replace with real Redux data later
const myPets = [
  { id: "1", name: "Max", breed: "Golden Retriever", emoji: "🐕" },
  { id: "2", name: "Luna", breed: "Persian Cat", emoji: "🐈" },
  { id: "3", name: "Kiwi", breed: "Cockatiel", emoji: "🦜" },
];

const glassPanel = {
  background: "rgba(10,8,25,0.6)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  borderRight: "1px solid rgba(255,255,255,0.07)",
};

export default function MenuSidebar() {
  const user = useAppSelector(useCurrentUser);
  const pathname = usePathname();
  const menuItems = user?.role === "ADMIN" ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden h-14 flex items-center justify-around px-4 bg-pv-bg/0 backdrop-blur-xl border-t border-white/[0.07]">
        {menuItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-colors ${
              pathname === item.href ? "text-pv-teal" : "text-white/30"
            }`}
          >
            {item.icon}
          </Link>
        ))}
      </nav>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed top-0 left-0 h-screen w-[220px] flex-col pt-14 z-40 bg-pv-bg/60 backdrop-blur-2xl border-r border-white/[0.07]">
        {/* My Pets */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-[9px] uppercase tracking-widest text-white/20 mb-2">
            My Pets
          </p>

          {myPets.map((pet) => (
            <Link
              key={pet.id}
              href={`/user/pets/${pet.id}`}
              className="flex items-center gap-2 py-[7px] px-2 rounded-lg mb-[2px] hover:bg-white/5 transition-all"
            >
              <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-sm shrink-0 bg-pv-purple/12 border border-pv-purple/25">
                {pet.emoji}
              </div>
              <div>
                <p className="text-xs font-medium text-white/88 leading-none">
                  {pet.name}
                </p>
                <p className="text-[10px] text-white/25 mt-[2px]">
                  {pet.breed}
                </p>
              </div>
            </Link>
          ))}

          {/* Add pet */}
          <button className="w-full mt-1 py-[7px] px-3 rounded-lg text-xs flex items-center gap-2 border border-dashed border-pv-yellow/30 bg-pv-yellow/4 text-pv-yellow hover:bg-pv-yellow/8 transition-all">
            <Plus size={12} />
            Add a pet
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 my-2 h-px bg-white/[0.06]" />

        {/* Nav links */}
        <div className="px-2 flex flex-col gap-[2px]">
          <p className="text-[9px] uppercase tracking-widest text-white/20 px-2 mb-1">
            Navigate
          </p>

          {menuItems.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-[9px] px-3 py-[9px] rounded-lg text-xs transition-all ${
                  isActive
                    ? "bg-pv-teal/8 text-pv-teal font-medium border-r-2 border-pv-teal"
                    : "text-white/28 hover:text-white/60 border-r-2 border-transparent"
                }`}
              >
                <span className="shrink-0">{link.icon}</span>
                {link.label}
                {link.label === "Reminders" && (
                  <span className="ml-auto text-[9px] px-[6px] py-[1px] rounded-full font-bold bg-pv-coral text-white">
                    2
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
