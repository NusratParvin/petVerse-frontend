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
      {/* ── Mobile bottom nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden h-14 flex items-center justify-around px-4"
        style={{
          background: "rgba(7,11,24,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {menuItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1"
            style={{
              color:
                pathname === item.href ? "#00E5CC" : "rgba(255,255,255,0.3)",
            }}
          >
            {item.icon}
          </Link>
        ))}
      </nav>

      {/* ── Desktop sidebar ── */}
      <div
        className="hidden lg:flex fixed top-0 left-0 h-screen w-[220px] flex-col pt-14 z-40"
        style={glassPanel}
      >
        {/* My Pets section */}
        <div className="px-4 pt-4 pb-2">
          <p
            className="text-[9px] uppercase tracking-widest mb-2"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            My Pets
          </p>

          {myPets.map((pet) => (
            <Link
              key={pet.id}
              href={`/user/pets/${pet.id}`}
              className="flex items-center gap-2 py-[7px] px-2 rounded-lg mb-[2px] transition-all"
              style={{ color: "rgba(255,255,255,0.88)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div
                className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-sm shrink-0"
                style={{
                  background: "rgba(204,68,255,0.12)",
                  border: "1px solid rgba(204,68,255,0.25)",
                }}
              >
                {pet.emoji}
              </div>
              <div>
                <p className="text-xs font-medium leading-none">{pet.name}</p>
                <p
                  className="text-[10px] mt-[2px]"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {pet.breed}
                </p>
              </div>
            </Link>
          ))}

          {/* Add pet button */}
          <button
            className="w-full mt-1 py-[7px] px-3 rounded-lg text-xs flex items-center gap-2 transition-all"
            style={{
              border: "1px dashed rgba(245,208,32,0.3)",
              background: "rgba(245,208,32,0.04)",
              color: "#F5D020",
            }}
          >
            <Plus size={12} />
            Add a pet
          </button>
        </div>

        {/* Divider */}
        <div
          className="mx-4 my-2"
          style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
        />

        {/* Nav links */}
        <div className="px-2 flex flex-col gap-[2px]">
          <p
            className="text-[9px] uppercase tracking-widest px-2 mb-1"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Navigate
          </p>

          {menuItems.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-[9px] px-3 py-[9px] rounded-lg text-xs transition-all"
                style={{
                  color: isActive ? "#00E5CC" : "rgba(255,255,255,0.28)",
                  background: isActive ? "rgba(0,229,204,0.08)" : "transparent",
                  borderRight: isActive
                    ? "2px solid #00E5CC"
                    : "2px solid transparent",
                  fontWeight: isActive ? 500 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = "rgba(255,255,255,0.28)";
                }}
              >
                <span className="shrink-0">{link.icon}</span>
                {link.label}
                {link.label === "Reminders" && (
                  <span
                    className="ml-auto text-[9px] px-[6px] py-[1px] rounded-full font-bold"
                    style={{ background: "#FF4D6D", color: "white" }}
                  >
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
