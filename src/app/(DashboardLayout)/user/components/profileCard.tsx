"use client";
import { Avatar, Card, Divider } from "@heroui/react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";

import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAppSelector } from "@/src/redux/hooks";

const UserProfileCard = () => {
  const user = useAppSelector(useCurrentUser);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <h2 className="text-red-500">No user data available</h2>
      </div>
    );
  }

  return (
    <Card className="w-[200px] px-4 py-2 rounded-sm bg-transparent text-black/80">
      {/* User Avatar */}
      <div className="flex items-center gap-4">
        <Avatar
          alt={user?.name}
          className="rounded-full"
          size="lg"
          src={user?.profilePhoto}
        />

        <div className="flex flex-col">
          <h2 className="font-semibold text-sm">{user?.name}</h2>
          <h2 className="text-gray-600 text-xs">
            {user?.address || "No address available"}
          </h2>
        </div>
      </div>

      {/* <Divider className="my-2 dark:divide-gray-300" />

      <div className="flex justify-center pt-2 space-x-4 mb-2">
        <Link aria-label="Facebook" href="/">
          <Facebook className="text-customBlue/80 w-4 h-4" />
        </Link>
        <Link aria-label="Twitter" href="/">
          <Twitter className="text-customBlue/80 w-4 h-4" />
        </Link>
        <Link aria-label="Linkedin" href="/">
          <Linkedin className="text-customBlue/80 w-4 h-4" />
        </Link>
        <Link aria-label="Instagram" href="/">
          <Instagram className="text-customBlue/80 w-4 h-4" />
        </Link>
      </div> */}
    </Card>
  );
};

export default UserProfileCard;
