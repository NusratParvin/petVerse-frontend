"use client";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Button,
  Link,
  Skeleton,
} from "@heroui/react";
import { MapPin, Link as LinkIcon, Calendar, PhoneCall } from "lucide-react";

import UpdateProfileInfo from "./updateProfileInfo";

import { useGetUserInfoQuery } from "@/src/redux/features/user/userApi";
import avatarImage from "@/src/assets/images/team.png";

export default function Profile() {
  const { data: userInfo, isLoading, error } = useGetUserInfoQuery(undefined);
  const user = userInfo?.data;
  console.log(user, "here i ");
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    return (
      <div className="me-1">
        <Card className="w-full max-w-3xl mx-auto shadow-md" radius="none">
          {/* Background header with a gradient skeleton */}
          <CardHeader className="h-[120px] overflow-hidden p-0 relative">
            <Skeleton className="w-full h-full" />
          </CardHeader>

          {/* Avatar skeleton */}
          <Skeleton className="absolute top-16 left-4 w-32 h-32 border-4 border-white z-10" />

          {/* Main card body skeleton */}
          <CardBody className="mt-16 ps-8">
            {/* Name and Edit button skeleton */}
            <div className="flex justify-between items-start text-black mb-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-16" />
            </div>

            {/* Bio skeleton */}
            <Skeleton className="h-4 w-full mb-4" />

            {/* Additional profile details skeleton */}
            <div className="flex flex-wrap gap-y-2 text-sm text-gray-600 mb-4">
              <Skeleton className="h-4 w-1/4 mr-4" />
              <Skeleton className="h-4 w-1/4 mr-4" />
              <Skeleton className="h-4 w-1/4" />
            </div>

            {/* Followers and following count skeleton */}
            <div className="flex gap-4 mt-4 text-sm text-black/70">
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/6" />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) return <div>Error loading user data.</div>;

  return (
    <div className="me-1">
      {isEditing ? (
        <UpdateProfileInfo toggleEditMode={toggleEditMode} user={user} />
      ) : (
        <Card className="w-full max-w-3xl mx-auto shadow-md" radius="none">
          {/* Background header with a gradient */}
          <CardHeader className="h-[120px] overflow-hidden p-0 relative">
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-customBlue absolute top-0 left-0 z-0" />
          </CardHeader>

          <Avatar
            alt={`${user?.name}'s avatar`}
            className="absolute top-16 left-4 w-32 h-32 border-4 border-white z-10"
            src={user?.profilePhoto || avatarImage}
          />

          {/* Main card body with profile information */}
          <CardBody className="mt-16 ps-8">
            <div className="flex justify-between items-start text-black">
              <div>
                <h2 className="text-xl font-semibold"> {user?.name}</h2>
              </div>
              {/* Edit button */}
              <Button
                color="default"
                radius="full"
                variant="flat"
                onClick={toggleEditMode}
              >
                Edit
              </Button>
            </div>

            {/* Bio */}
            <p className="mb-4 text-sm text-gray-700">
              {user.bio || " This user has not added a bio yet."}
            </p>

            {/* Additional profile details */}
            <div className="flex flex-wrap gap-y-3 gap-12 text-sm text-gray-600">
              {user?.address && (
                <div className="flex items-center mr-4 text-sm">
                  <MapPin className="mr-1" size={12} />
                  <span>{user.address}</span>
                </div>
              )}
              {user?.email && (
                <div className="flex items-center mr-4 text-sm">
                  <LinkIcon className="mr-1" size={12} />
                  <Link
                    className="text-customOrange text-sm italic hover:underline"
                    href={`mailto:${user.email}`}
                  >
                    {user.email}
                  </Link>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-y-3 gap-20 text-sm text-gray-600 mt-4">
              {user?.phone && (
                <div className="flex items-center mr-4 text-sm">
                  <PhoneCall className="mr-1" size={12} />

                  <span>{user?.phone}</span>
                </div>
              )}
              {user?.createdAt && (
                <div className="flex items-center mr-4 text-sm">
                  <Calendar className="mr-1" size={12} />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Followers and following count */}
            <div className="flex gap-4 mt-4 text-sm text-black/70">
              <span className="font-semibold">
                {user?.following?.length || 0}{" "}
                <span className="font-normal text-gray-500 text-xs">
                  Following
                </span>
              </span>
              <span className="font-semibold">
                {user?.followers?.length || 0}{" "}
                <span className="font-normal text-gray-500 text-xs">
                  Followers
                </span>
              </span>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
