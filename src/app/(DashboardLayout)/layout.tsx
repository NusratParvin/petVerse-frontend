import { ReactNode } from "react";

import MenuSidebar from "./components/menuSidebar";
import NavbarDashboard from "./components/navbarDashboard";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className=" aqua w-full">
      <NavbarDashboard />

      <div className=" flex flex-col md:flex-row w-full gap-0">
        {/* Left Sidebar */}
        <div className="md:w-[20%] w-full relative ">
          {/* <div className="relat   "> */}
          <MenuSidebar />
          {/* </div> */}
        </div>

        {/* Middle Content (children) */}
        <div className="md:w-[80%] w-full relative overflow-y-hidden top-12">
          {children}
        </div>

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
