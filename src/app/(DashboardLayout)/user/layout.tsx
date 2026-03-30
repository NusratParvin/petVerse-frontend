import { ReactNode } from "react";

import Sidebar from "../components/sidebar";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="aqua flex flex-col md:flex-row w-full gap-0  ">
      {/* Middle Content (children) */}
      <div className="md:w-[70%] w-full relative overflow-y-auto bg-blue-400/20 dark:bg-transparent ">
        {children}
      </div>

      {/* Right Sidebar */}
      <div className="md:w-[30%] w-full relative">
        <div className="  top-0 h-screen">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
