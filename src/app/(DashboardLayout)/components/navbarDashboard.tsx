"use client";
import {
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PawPrint, Moon, Sun } from "lucide-react";

import InvitationsPopover from "../user/pages/components/InvitationsPopover";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  useCurrentUser,
  removePendingInvite,
  logout,
} from "@/src/redux/features/auth/authSlice";
import {
  useAcceptPageInvitationMutation,
  useRejectPageInvitationMutation,
} from "@/src/redux/features/pages/pagesApi";
import { logoutCookies } from "@/src/services/AuthService";
import { Switch } from "@heroui/react";
import ThemeToggle from "@/src/components/ThemeToggle";

interface PageDetail {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  members: { _id: string; name: string; profilePhoto?: string }[];
  admins: string[];
  pendingInvites: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const NavbarDashboard = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isUser = useAppSelector(useCurrentUser);
  const [acceptInvitation] = useAcceptPageInvitationMutation();
  const [rejectInvitation] = useRejectPageInvitationMutation();
  const [pageDetails, setPageDetails] = useState<PageDetail[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const icons = {
    darkMode: {
      off: Moon,
      on: Sun,
      selectedControlClass: "",
    },
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (isUser?.pendingInvites?.length) {
        const promises = isUser.pendingInvites.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_BASE_API}/pages/${id}`).then((res) =>
            res.json(),
          ),
        );
        const results = await Promise.all(promises);
        setPageDetails(results);
      }
    };
    fetchDetails();
  }, [isUser?.pendingInvites]);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      const result = await logoutCookies();
      if (result.success) {
        dispatch(logout());
        toast.success("Logged out successfully!", { id: toastId });
        router.push("/");
      } else {
        toast.error("Failed to log out", { id: toastId });
      }
    } catch {
      toast.error("An error occurred during logout", { id: toastId });
    }
  };

  const handleDashboardClick = () => {
    isUser?.role === "USER"
      ? router.push("/user/newsfeed")
      : router.push("/admin/dashboard");
  };

  const handleAccept = async (pageId: string) => {
    try {
      const success = await acceptInvitation(pageId).unwrap();
      if (success) {
        setPageDetails((prev) => prev.filter((d) => d._id !== pageId));
        dispatch(removePendingInvite(pageId));
        toast.success("Invitation accepted!");
      }
    } catch {
      toast.error("An error occurred while accepting the invitation.");
    }
  };

  const handleReject = async (pageId: string) => {
    try {
      const success = await rejectInvitation(pageId).unwrap();
      if (success) {
        setPageDetails((prev) => prev.filter((d) => d._id !== pageId));
        dispatch(removePendingInvite(pageId));
        toast.success("Invitation rejected!");
      }
    } catch {
      toast.error("An error occurred while rejecting the invitation.");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-6 bg-pv-bg/10 backdrop-blur-xl border-b border-white/[0.07]">
      {/* Logo */}
      <button
        onClick={handleDashboardClick}
        className="flex items-center gap-2"
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-pv-purple/20 border border-pv-purple/35">
          <PawPrint size={14} className="text-pv-purple" />
        </div>
        <span className="font-grotesk text-[17px] font-bold tracking-tight text-pv-yellow">
          Pet<span className="text-pv-teal">Verse</span>
        </span>
      </button>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <InvitationsPopover
          handleAccept={handleAccept}
          handleReject={handleReject}
          invitations={pageDetails}
        />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              color="secondary"
              name={isUser?.name}
              size="sm"
              src={
                isUser?.profilePhoto ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{isUser?.role}</p>
            </DropdownItem>
            <DropdownItem key="dashboard" onClick={handleDashboardClick}>
              Dashboard
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default NavbarDashboard;
