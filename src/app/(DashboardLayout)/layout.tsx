import { ReactNode } from "react";
import MenuSidebar from "./components/menuSidebar";
import NavbarDashboard from "./components/navbarDashboard";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-pv-gradient">
      {/* ── Deep space nebula orbs ── */}
      {/* Center blue nebula glow — matches the photo */}
      <div
        className="fixed top-[-20%] left-[0%] w-[700px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(30,80,200,0.25) 0%, rgba(10,40,120,0.12) 40%, transparent 70%)",
        }}
      />
      {/* Top left dark corner */}
      <div
        className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(5,15,50,0.8) 0%, transparent 70%)",
        }}
      />
      {/* Bottom right dark corner */}
      <div
        className="fixed bottom-0 right-0 w-[350px] h-[350px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(2,8,18,0.9) 0%, transparent 70%)",
        }}
      />
      {/* Subtle purple-blue accent */}
      <div
        className="fixed top-[40%] right-[20%] w-[500px] h-[200px] rounded-full pointer-events-none z-0 backdrop-blur-xl"
        style={{
          background:
            "radial-gradient(circle, rgba(30,100,255,0.1) 10%, transparent 70%)",
        }}
      />

      {/* Navbar */}
      <NavbarDashboard />

      {/* Body */}
      <div className="relative z-10 flex flex-col md:flex-row w-full pt-12">
        {/* Sidebar */}
        <div className="md:w-[220px] w-full shrink-0">
          <MenuSidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 min-h-screen overflow-y-auto">{children}</div>
        {/* Right Sidebar */}
        {/* <div className="md:w-[25%] w-full relative">
        <div className="  top-0 h-screen">
          <Sidebar />
        </div>
      </div> */}
      </div>
    </div>
  );
}
