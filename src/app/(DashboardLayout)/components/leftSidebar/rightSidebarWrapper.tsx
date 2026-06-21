"use client";

import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import Sidebar from "../sidebar";

const RightSidebarWrapper = () => {
  const user = useAppSelector(useCurrentUser);
  if (user?.role === "ADMIN") return null;

  return (
    <div className="hidden md:block w-[300px] flex-shrink-0 overflow-y-auto custom-scrollbar h-[calc(100vh-60px)]">
      <Sidebar />
    </div>
  );
};

export default RightSidebarWrapper;
