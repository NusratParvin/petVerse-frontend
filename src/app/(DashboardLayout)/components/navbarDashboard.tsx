// "use client";
// import {
//   Navbar,
//   NavbarContent,
//   NavbarItem,
//   Dropdown,
//   DropdownMenu,
//   DropdownTrigger,
//   DropdownItem,
//   Avatar,
//   NavbarBrand,
// } from "@nextui-org/react";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// import InvitationsPopover from "../user/pages/components/InvitationsPopover";

// import image from "@/src/assets/images/Fish-logo-template-on-transparent-background-PNG.png";
// import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
// import {
//   logout,
//   removePendingInvite,
//   useCurrentUser,
// } from "@/src/redux/features/auth/authSlice";
// import { logoutCookies } from "@/src/services/AuthService";
// import {
//   useAcceptPageInvitationMutation,
//   useRejectPageInvitationMutation,
// } from "@/src/redux/features/pages/pagesApi";
// import { useFetchPageDetails } from "@/src/lib/usePageDetailsHook";

// const NavbarDashboard = () => {
//   const isUser = useAppSelector(useCurrentUser);

//   const dispatch = useAppDispatch();

//   const router = useRouter();
//   const [acceptInvitation] = useAcceptPageInvitationMutation();
//   const [rejectInvitation] = useRejectPageInvitationMutation();

//   const pageDetails = useFetchPageDetails(isUser?.pendingInvites || []);

//   const handleLogout = async () => {
//     const toastId = toast.loading("Logging out...");

//     try {
//       const result = await logoutCookies();

//       if (result.success) {
//         dispatch(logout());
//         toast.success("Logged out successfully!", {
//           id: toastId,
//         });

//         router.push("/");
//       } else {
//         toast.error("Failed to log out", { id: toastId });
//       }
//     } catch (error) {
//       toast.error("An error occurred during logout", { id: toastId });
//     }
//   };

//   const handleDashboardClick = () => {
//     router.push("/");
//   };

//   const handleAccept = async (pageId: string) => {
//     try {
//       const success = await acceptInvitation(pageId).unwrap();

//       if (success) {
//         dispatch(removePendingInvite(pageId));

//         toast.success("Invitation accepted!");
//       } else {
//         toast.error("Failed to accept invitation. ");
//       }
//     } catch (error) {
//       console.error("Error accepting invitation:", error);
//       toast.error("An error occurred while accepting the invitation.");
//     }
//   };

//   const handleReject = async (pageId: string) => {
//     try {
//       const { data: success } = await rejectInvitation(pageId).unwrap();

//       if (success) {
//         dispatch(removePendingInvite(pageId));

//         toast.success("Invitation rejected!");
//       } else {
//         toast.error("Failed to reject invitation.");
//       }
//     } catch (error) {
//       console.error("Error rejecting invitation:", error);
//       toast.error("An error occurred while rejecting the invitation.");
//     }
//   };

//   return (
//     <div className="bg-customBlue/30 p-0 grid grid-cols-2 justify-between items-center fixed top-0 z-50 w-screen ">
//       {/* Left side content */}
//       <Navbar className="md:ps-10 ps-1 " height={46}>
//         <NavbarContent justify="start">
//           <NavbarBrand>
//             <Link className="flex items-center space-x-2 " href="/">
//               <Image
//                 alt="logo"
//                 className="w-6 h-6"
//                 height={16}
//                 src={image}
//                 width={16}
//               />
//               <p className="font-normal font-raleway text-2xl  text-[#FF7F50] tracking-tighter">
//                 <span className="italic font-semibold">fish</span>Cove
//               </p>
//             </Link>
//           </NavbarBrand>
//         </NavbarContent>
//       </Navbar>
//       {/* <div className="flex items-center space-x-1 md:pe-1 pe-1"> */}
//       {/* User Profile Dropdown */}
//       <Navbar height={46}>
//         <NavbarContent
//           className="flex items-center justify-end space-x-0"
//           justify="end"
//         >
//           {" "}
//           <InvitationsPopover
//             handleAccept={handleAccept}
//             handleReject={handleReject}
//             invitations={pageDetails}
//           />
//           <NavbarItem>
//             <Dropdown placement="bottom-end">
//               <DropdownTrigger>
//                 <Avatar
//                   as="button"
//                   className="transition-transform"
//                   color="secondary"
//                   name={isUser?.name}
//                   size="sm"
//                   src={
//                     isUser?.profilePhoto ||
//                     "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
//                   }
//                 />
//               </DropdownTrigger>
//               <DropdownMenu aria-label="Profile Actions" variant="flat">
//                 <DropdownItem key="profile" className="h-14 gap-2">
//                   <p className="font-semibold">Signed in as</p>
//                   <p className="font-semibold">{isUser?.role}</p>
//                 </DropdownItem>
//                 <DropdownItem key="dashboard" onClick={handleDashboardClick}>
//                   Back to Homepage
//                 </DropdownItem>
//                 <DropdownItem
//                   key="logout"
//                   color="danger"
//                   onClick={handleLogout}
//                 >
//                   Log Out
//                 </DropdownItem>
//               </DropdownMenu>
//             </Dropdown>
//           </NavbarItem>
//         </NavbarContent>
//       </Navbar>
//       {/* Invitations Popover
//         <InvitationsPopover
//           invitations={invitations}
//           handleAccept={handleAccept}
//           handleReject={handleReject}
//         /> */}
//       {/* </div> */}
//     </div>
//   );
// };

// export default NavbarDashboard;

"use client";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Avatar,
  NavbarBrand,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import InvitationsPopover from "../user/pages/components/InvitationsPopover";

import image from "@/src/assets/images/Fish-logo-template-on-transparent-background-PNG.png";
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

interface PageDetail {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  members: Member[];
  admins: string[];
  pendingInvites: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Member {
  _id: string;
  name: string;
  profilePhoto?: string;
}

const NavbarDashboard = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [acceptInvitation] = useAcceptPageInvitationMutation();
  const [rejectInvitation] = useRejectPageInvitationMutation();
  const isUser = useAppSelector(useCurrentUser);

  // Fetch initial page details
  // const [pageDetails, setPageDetails] = useState([]);
  const [pageDetails, setPageDetails] = useState<PageDetail[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (isUser && isUser.pendingInvites) {
        const promises = isUser.pendingInvites.map((id) =>
          fetch(`https://fish-cove-backend.vercel.app/api/v1/pages/${id}`).then(
            (res) => res.json()
          )
        );
        const results = await Promise.all(promises);

        setPageDetails(results);
      }
    };

    fetchDetails();
  }, [isUser?.pendingInvites]);

  const handleAccept = async (pageId: string) => {
    try {
      const success = await acceptInvitation(pageId).unwrap();

      if (success) {
        const updatedDetails = pageDetails.filter(
          (detail) => detail._id !== pageId
        );

        setPageDetails(updatedDetails);
        dispatch(removePendingInvite(pageId));
        toast.success("Invitation accepted!");
      } else {
        toast.error("Failed to accept invitation.");
      }
    } catch (error) {
      // console.error("Error accepting invitation:", error);
      toast.error("An error occurred while accepting the invitation.");
    }
  };

  const handleReject = async (pageId: string) => {
    try {
      const success = await rejectInvitation(pageId).unwrap();

      if (success) {
        const updatedDetails = pageDetails.filter(
          (detail) => detail._id !== pageId
        );

        setPageDetails(updatedDetails);
        dispatch(removePendingInvite(pageId));
        toast.success("Invitation rejected!");
      } else {
        toast.error("Failed to reject invitation.");
      }
    } catch (error) {
      console.error("Error rejecting invitation:", error);
      toast.error("An error occurred while rejecting the invitation.");
    }
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      const result = await logoutCookies();

      if (result.success) {
        dispatch(logout());
        toast.success("Logged out successfully!", {
          id: toastId,
        });

        router.push("/");
      } else {
        toast.error("Failed to log out", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred during logout", { id: toastId });
    }
  };

  const handleDashboardClick = () => {
    isUser?.role === "USER"
      ? router.push("/user/newsfeed")
      : router.push("/admin/dashboard");
  };

  return (
    <div className="bg-customBlue/40 p-0 grid grid-cols-2 justify-between items-center fixed top-0 z-50 w-screen ">
      {/* Left side content */}
      <Navbar className="md:ps-10 ps-1 border-none  bg-blue-100/10" height={46}>
        <NavbarContent justify="start">
          <NavbarBrand>
            <button
              className="flex items-center space-x-2"
              onClick={handleDashboardClick}
            >
              <Image
                alt="logo"
                className="w-6 h-6"
                height={16}
                src={image}
                width={16}
              />
              <p className="font-normal font-raleway text-2xl  text-[#FF7F50] tracking-tighter">
                <span className="italic font-semibold">fish</span>Cove
              </p>
            </button>
          </NavbarBrand>
        </NavbarContent>
      </Navbar>
      {/* <div className="flex items-center space-x-1 md:pe-1 pe-1"> */}
      {/* User Profile Dropdown */}
      <Navbar height={46} className="border-none  bg-blue-100/10">
        <NavbarContent
          className="flex items-center justify-end space-x-0"
          justify="end"
        >
          {" "}
          <InvitationsPopover
            handleAccept={handleAccept}
            handleReject={handleReject}
            invitations={pageDetails}
          />
          <NavbarItem>
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
                  Back to Homepage
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {/* Invitations Popover
        <InvitationsPopover
          invitations={invitations}
          handleAccept={handleAccept}
          handleReject={handleReject}
        /> */}
      {/* </div> */}
    </div>
  );
};

export default NavbarDashboard;
