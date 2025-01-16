"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Input,
  Spinner,
} from "@nextui-org/react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  useGetUserInfoQuery,
  useUpdateUserMutation,
} from "@/src/redux/features/user/userApi";
import avatarImage from "@/src/assets/images/team.png";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setUser, useCurrentToken } from "@/src/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";

const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const AdminEditProfile = () => {
  const { data: userInfo, isLoading, error } = useGetUserInfoQuery(undefined);
  const user = userInfo?.data;

  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const dispatch = useAppDispatch();
  const currentToken = useAppSelector(useCurrentToken);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      bio: "",
      address: "",
      email: "",
      phone: "",
      profilePhoto: "",
    },
  });

  const [updateUser] = useUpdateUserMutation();

  // Set form values when the user data is available
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("bio", user.bio || "");
      setValue("address", user.address || "");
      setValue("email", user.email);
      setValue("phone", user.phone || "");
      setProfilePhoto(user.profilePhoto || avatarImage);
    }
  }, [user, setValue]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET as string);

    try {
      setUploading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      setProfilePhoto(data.secure_url);
      setValue("profilePhoto", data.secure_url);
      setUploading(false);
      toast.success("Image uploaded successfully", {
        className: "text-green-500",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", {
        className: "text-red-500",
      });
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    const updatedData: any = {};

    if (profilePhoto && profilePhoto !== user.profilePhoto) {
      updatedData.profilePhoto = profilePhoto;
    }

    Object.keys(data).forEach((key) => {
      if (data[key] !== user[key]) {
        updatedData[key] = data[key];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      toast.info("No changes detected");
      return;
    }

    try {
      const res = await updateUser(updatedData).unwrap();

      if (res.success) {
        toast.success("Profile updated successfully", {
          className: "text-green-500",
        });
        console.log(res);
        dispatch(setUser({ user: res.data, token: currentToken }));
        router.push("/admin/dashboard");
      } else {
        throw new Error(res.message || "Update failed");
      }
    } catch (error: any) {
      console.log(error);
      console.error("Failed to update profile:", error);

      if (error.status === 409) {
        toast.error("Conflict: You cannot use the same email.", {
          className: "text-red-500",
        });
      } else {
        toast.error(`Failed to update profile: ${error.message || error}`, {
          className: "text-red-500",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load user information.</p>
      </div>
    );
  }

  return (
    <Card className="w-full pb-8 mx-auto shadow-md" radius="none">
      {/* Background header with a gradient */}
      <div className="h-[120px] overflow-hidden p-0 relative bg-gradient-to-r from-blue-400 to-customBlue" />
      <div className="flex flex-row justify-between items-center">
        <div>
          <Avatar
            alt={`${user?.name}'s avatar`}
            className="absolute top-16 left-4 w-32 h-32 border-4 border-white z-10 cursor-pointer"
            src={profilePhoto || ""}
          />
          <input
            accept="image/*"
            id="profilePhotoUpload"
            style={{ display: "none" }}
            type="file"
            onChange={handleImageChange}
          />
          <Button
            className="absolute top-32 left-40"
            color="default"
            size="sm"
            onClick={() =>
              document.getElementById("profilePhotoUpload")?.click()
            }
          >
            Change Image
          </Button>
          {uploading && (
            <p className="absolute top-40 left-40 text-yellow-700 text-xs">
              Uploading...
            </p>
          )}
        </div>
      </div>

      {/* Avatar */}
      <div className="relative w-full  md:w-[80%] my-16 mx-auto">
        <form id="profileForm" onSubmit={handleSubmit(onSubmit)}>
          <CardBody className="mt-10 ps-0 text-black ">
            {/* Name */}
            <div className="grid grid-cols-[100px_1fr] gap-4 items-center mb-4">
              <label className="text-right text-black text-sm" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                size="sm"
                variant="flat"
                {...register("name", { required: "Name is required" })}
                fullWidth
                className="!text-black/90 !placeholder-black/90"
                placeholder="Enter your name"
              />
            </div>

            {/* Bio */}
            <div className="grid grid-cols-[100px_1fr] gap-4 items-center mb-4">
              <label className="text-right text-black text-sm" htmlFor="bio">
                Bio
              </label>
              <Input
                id="bio"
                size="sm"
                variant="flat"
                {...register("bio")}
                fullWidth
                className="!text-black/90 !placeholder-black/90"
                placeholder="Write something about yourself..."
              />
            </div>

            {/* Address */}
            <div className="grid grid-cols-[100px_1fr] gap-4 items-center mb-4">
              <label
                className="text-right text-black text-sm"
                htmlFor="address"
              >
                Address
              </label>
              <Input
                id="address"
                size="sm"
                variant="flat"
                {...register("address")}
                fullWidth
                className="!text-black/90 !placeholder-black/90"
                placeholder="Enter your address"
              />
            </div>

            {/* Email */}
            <div className="grid grid-cols-[100px_1fr] gap-4 items-center mb-4">
              <label className="text-right text-black text-sm" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                size="sm"
                type="email"
                variant="flat"
                {...register("email", { required: "Email is required" })}
                fullWidth
                className="!text-black/90 !placeholder-black/90"
                errorMessage={
                  errors.email ? "Please enter a valid email" : undefined
                }
                placeholder="Enter your email"
              />
            </div>

            {/* Phone */}
            <div className="grid grid-cols-[100px_1fr] gap-4 items-center mb-4">
              <label className="text-right text-black text-sm" htmlFor="phone">
                Phone
              </label>
              <Input
                id="phone"
                size="sm"
                variant="flat"
                {...register("phone")}
                fullWidth
                className="!text-black/90 !placeholder-black/90"
                placeholder="Enter your phone number"
              />
            </div>
          </CardBody>
        </form>{" "}
        {/* Save and Cancel buttons */}
        <div className="flex items-center justify-end gap-2 m-2 ">
          <Button
            className="bg-customBlue font-semibold text-white"
            color="default"
            form="profileForm"
            type="submit"
          >
            Save
          </Button>
          <Button
            color="default"
            variant="shadow"
            onClick={() => window.history.back()}
          >
            <X size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AdminEditProfile;
