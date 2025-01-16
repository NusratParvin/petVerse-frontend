"use client";
import { Button } from "@nextui-org/react";
import Link from "next/link";

import UserProfileCard from "../user/components/profileCard";

import { adminLinks, userLinks } from "./sidebar/constants";

import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAppSelector } from "@/src/redux/hooks";

export default function MenuSidebar() {
  const user = useAppSelector(useCurrentUser);

  const menuItems = user?.role === "ADMIN" ? adminLinks : userLinks;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-customBlue/60">
        <div className="flex items-center justify-around bg-white h-14 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-center text-customBlue"
            >
              <span className="block text-xl">{item.icon}</span>
            </Link>
            // <Button
            //   key={item.href}
            //   fullWidth
            //   as={Link}
            //   className="justify-start font-medium text-base h-10"
            //   href={item.href}
            //   variant="light"
            // >
            //   {item.icon}
            // </Button>
          ))}
        </div>
      </nav>

      <div className="hidden  fixed top-0 h-screen  lg:block">
        {/* Full Nav for large screens */}{" "}
        <div className="flex flex-col h-screen w-full py-4 px-4  ">
          {/* <div className="flex flex-col h-screen w-full py-4 px-4 bg-secondary/20 border-r border-divider"> */}
          {/* User Avatar */}
          <div className="w-full mt-10 ">
            <UserProfileCard />
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col my-4">
            {menuItems.map((link) => (
              <Button
                key={link.href}
                fullWidth
                as={Link}
                className="justify-start font-medium text-base h-10"
                href={link.href}
                startContent={link.icon}
                variant="light"
              >
                {link.label}
              </Button>
            ))}
          </nav>

          {/* {user?.role === "USER" && <ModalButton />} */}
        </div>
      </div>
    </>
  );
}
