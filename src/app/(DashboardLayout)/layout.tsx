import { ReactNode } from "react";
import MenuSidebar from "./components/menuSidebar";
import NavbarDashboard from "./components/navbarDashboard";
import ThemeLayout from "./components/ThemeLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    // <div className="relative min-h-screen w-full overflow-hidden bg-pv-gradient">
    //   {/* ── Nebula orbs ── */}
    //   <div
    //     className="fixed top-[-20%] left-[-5%] w-[700px] h-[600px] rounded-full pointer-events-none z-0"
    //     style={{
    //       background:
    //         "radial-gradient(circle, rgba(30,80,200,0.35) 0%, rgba(10,40,120,0.18) 40%, transparent 70%)",
    //     }}
    //   />
    //   <div
    //     className="fixed top-[30%] right-[-5%] w-[450px] h-[450px] rounded-full pointer-events-none z-0"
    //     style={{
    //       background:
    //         "radial-gradient(circle, rgba(20,60,180,0.2) 0%, rgba(5,20,80,0.08) 50%, transparent 70%)",
    //     }}
    //   />
    //   <div
    //     className="fixed bottom-[-10%] left-[30%] w-[400px] h-[300px] rounded-full pointer-events-none z-0"
    //     style={{
    //       background:
    //         "radial-gradient(circle, rgba(15,50,150,0.15) 0%, transparent 70%)",
    //     }}
    //   />

    //   {/* ── Navbar ── */}
    //   <NavbarDashboard />

    //   {/* ── Body ── */}
    //   <div className="relative z-10 flex flex-col md:flex-row w-full pt-12">
    //     {/* Sidebar */}
    //     <div className="md:w-[220px] w-full shrink-0">
    //       <MenuSidebar />
    //     </div>

    //     {/* Soft fade from sidebar into content */}
    //     <div
    //       className="hidden md:block fixed left-[220px] top-0 h-screen w-12 z-20 pointer-events-none"
    //       style={{
    //         background:
    //           "linear-gradient(to right, rgba(2,8,18,0.35), transparent)",
    //       }}
    //     />

    //     {/* Main content */}
    //     <div className="flex-1 min-h-screen overflow-y-auto">{children}</div>
    //     {/* Right Sidebar */}
    //     {/* <div className="md:w-[25%] w-full relative">
    //     <div className="  top-0 h-screen">
    //       <Sidebar />
    //     </div>
    //   </div> */}
    //   </div>
    // </div>

    <ThemeLayout>
      <NavbarDashboard />
      <div className="relative z-10 flex flex-col md:flex-row w-full pt-12">
        <div className="md:w-[220px] w-full shrink-0">
          <MenuSidebar />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </ThemeLayout>
  );
}
