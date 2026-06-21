import { ReactNode } from "react";
import NavbarDashboard from "./components/navbarDashboard";
import ThemeLayout from "./components/ThemeLayout";
import LeftSidebar from "./components/leftSidebar/leftSidebar";
import Sidebar from "./components/sidebar";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAppSelector } from "@/src/redux/hooks";
import RightSidebarWrapper from "./components/leftSidebar/rightSidebarWrapper";

export default function Layout({ children }: { children: ReactNode }) {
  return (
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
            {/* <div className="hidden md:block w-[300px] flex-shrink-0 overflow-y-auto custom-scrollbar h-[calc(100vh-60px)]"> */}
            <RightSidebarWrapper />
            {/* </div> */}
          </div>
        </div>
      </div>
    </ThemeLayout>
  );
}
