import { ReactNode } from "react";
import NavbarDashboard from "./components/navbarDashboard";
import ThemeLayout from "./components/ThemeLayout";
import LeftSidebar from "./components/leftSidebar/leftSidebar";
import Sidebar from "./components/sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    // <ThemeLayout>
    //   <NavbarDashboard />
    //   <div className="relative z-10 flex flex-col md:flex-row w-full pt-12">
    //     <div className="md:w-[220px] w-full shrink-0">
    //       <LeftSidebar />
    //     </div>
    //     <div className="flex-1">{children}</div>
    //   </div>
    // </ThemeLayout>

    // <ThemeLayout>
    //   <NavbarDashboard />

    //   {/* Main container */}
    //   <div className="relative z-10 flex w-full pt-12">
    //     {/* Left Sidebar - fixed on desktop */}
    //     <LeftSidebar />

    //     {/* Main content - pushes right on desktop */}
    //     <div className="flex-1 lg:ml-[220px] min-h-screen">
    //       <div className="p-4 md:p-6">{children}</div>
    //     </div>
    //   </div>
    // </ThemeLayout>
    <ThemeLayout>
      <NavbarDashboard />

      <div className="flex w-full min-h-screen pt-12">
        <LeftSidebar />

        <div className="flex-1 lg:ml-[220px]">
          <div className="flex flex-col md:flex-row gap-0 h-[calc(100vh-60px)]">
            {/* Main Content - scrolls */}
            <div className="w-full md:flex-1 bg-white dark:bg-transparent rounded-xl overflow-y-auto custom-scrollbar">
              <div>{children}</div>
            </div>

            {/* Right Sidebar - scrolls independently */}
            <div className="hidden md:block w-[300px] flex-shrink-0 overflow-y-auto custom-scrollbar h-[calc(100vh-60px)]">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </ThemeLayout>
  );
}
