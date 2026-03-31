import { ReactNode } from "react";

import Sidebar from "../components/sidebar";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
      {/* Middle Content - with custom scrollbar */}
      <div className="md:w-[70%] w-full h-full overflow-y-auto custom-scrollbar bg-white dark:bg-transparent">
        <div className="pb-8">{children}</div>
      </div>

      {/* Right Sidebar */}
      <div className="md:w-[30%] w-full relative">
        <div className="  top-0 h-screen overflow-y-auto custom-scrollbar">
          <Sidebar />
        </div>
      </div>
    </div>

    // <div className="flex w-full" style={{ height: "calc(100vh - 56px)" }}>
    //   {/* Left Sidebar - Inherited from DashboardLayout */}
    //   {/* This will be merged with the parent layout */}
    //   {children}

    //   {/* Right Sidebar - Independent Scroll */}
    //   <div className="w-[30%] shrink-0 h-full overflow-y-auto border-l border-steel-blue/10 dark:border-lime-burst/15">
    //     <Sidebar />
    //   </div>
    // </div>
  );
}
