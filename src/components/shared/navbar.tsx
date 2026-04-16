"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarMenuItem,
} from "@heroui/react";
import { Link } from "@heroui/react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { siteConfig } from "@/src/config/site";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { logout, useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { logoutCookies } from "@/src/services/AuthService";

// import { ThemeSwitch } from "@/src/components/theme-switch";

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const isUser = useAppSelector(useCurrentUser);

  // console.log(isUser);
  const router = useRouter();

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
  console.log(isUser?.role);
  const handleDashboardClick = () => {
    if (isUser?.role === "USER") {
      router.push("/user/newsfeed");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="relative">
      <NextUINavbar
        className="bg-transparent fixed top-0 left-0 w-full z-20"
        isBlurred={false}
        maxWidth="xl"
        position="sticky"
      >
        <NavbarContent className=" basis-1 pl-4" justify="end">
          {/* <ThemeSwitch /> */}

          {isUser ? (
            <div>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    name={isUser.name}
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
                    <p className="font-semibold">{isUser.email}</p>
                  </DropdownItem>
                  <DropdownItem key="dashboard" onClick={handleDashboardClick}>
                    My Dashboard
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
            </div>
          ) : (
            // <NavbarMenuItem className="hover:text-primary/70 hover:font-semibold transition-colors text-xl my-3 ">
            //   <Link href={"/login"}>Login </Link>
            //   <span> || </span>
            //   <Link href={"/regigter"}>Register </Link>
            // </NavbarMenuItem>

            <NavbarMenuItem className="flex items-center justify-center space-x-4 text-lg my-4">
              {/* Login Link */}
              <Link
                className="text-customBlue hover:text-customOrange hover:underline font-semibold transition-colors duration-200"
                href="/login"
              >
                Login
              </Link>

              {/* Separator */}
              <span className="text-gray-400 font-light">|</span>

              {/* Register Link */}
              <Link
                className="text-customBlue hover:text-customOrange hover:underline font-semibold transition-colors duration-200"
                href="/register"
              >
                Register
              </Link>
            </NavbarMenuItem>
          )}

          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarMenu className="bg-[#F4E3D7] md:w-1/3 w-full md:left-2/3 fixed top-0 z-20 max-h-screen">
          <div className="mx-12 mt-24 flex flex-col gap-2 text-text-default  top-0">
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="hover:text-primary/70 hover:font-semibold transition-colors text-4xl my-3 text-[#FF7F50]"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          </div>
        </NavbarMenu>
      </NextUINavbar>
    </div>
  );
};
