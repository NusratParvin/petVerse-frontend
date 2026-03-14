import { ReactNode } from "react";
import MenuSidebar from "./components/menuSidebar";
import NavbarDashboard from "./components/navbarDashboard";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* ── Background gradient ── */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(135deg,#070b18_0%,#0d0f24_40%,#0a0720_70%,#0d1020_100%)]" />

      {/* ── Orbs ── */}
      <div className="fixed top-[-80px] left-[60px] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(180,60,255,0.32)_0%,transparent_70%)] z-0 pointer-events-none" />
      <div className="fixed bottom-[-60px] right-[80px] w-[260px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(0,210,255,0.22)_0%,transparent_70%)] z-0 pointer-events-none" />
      <div className="fixed top-[40%] right-[260px] w-[180px] h-[180px] rounded-full bg-[radial-gradient(circle,rgba(245,208,32,0.16)_0%,transparent_70%)] z-0 pointer-events-none" />

      {/* ── Navbar ── */}
      <NavbarDashboard />

      {/* ── Body ── */}
      <div className="relative z-10 flex flex-col md:flex-row w-full pt-12">
        {/* Sidebar */}
        <div className="md:w-[220px] w-full shrink-0">
          <MenuSidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 min-h-screen overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
