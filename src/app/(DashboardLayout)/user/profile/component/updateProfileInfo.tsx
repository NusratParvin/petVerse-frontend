import React, { useState } from "react";
import { Card, CardBody, Avatar, Button, Input } from "@heroui/react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useUpdateUserMutation } from "@/src/redux/features/user/userApi";
import avatarImage from "@/src/assets/images/team.png";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setUser, useCurrentToken } from "@/src/redux/features/auth/authSlice";

interface UpdateProfileInfoProps {
  user: any;
  toggleEditMode: () => void;
}

const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const UpdateProfileInfo: React.FC<UpdateProfileInfoProps> = ({
  user,
  toggleEditMode,
}) => {
  const [profilePhoto, setProfilePhoto] = useState(
    user?.profilePhoto || avatarImage,
  );
  const [uploading, setUploading] = useState(false);
  const dispatch = useAppDispatch();
  const currentToken = useAppSelector(useCurrentToken);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      address: user?.address || "",
      email: user?.email || "",
      phone: user?.phone || "",
      profilePhoto: user?.profilePhoto || "",
    },
  });

  const [updateUser] = useUpdateUserMutation();

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
        },
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

    console.log("Form data to update:", updatedData);

    try {
      const res = await updateUser(updatedData).unwrap();

      if (res.success) {
        toast.success("Profile updated successfully", {
          className: "text-green-500",
        });
        // console.log(res.data);
        dispatch(setUser({ user: res.data, token: currentToken }));

        toggleEditMode();
      } else {
        throw new Error(res.message || "Update failed");
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error.message || error);

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

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md" radius="none">
      {/* Background header with a gradient */}
      <div className="h-[120px] overflow-hidden p-0 relative bg-gradient-to-r from-blue-400 to-customBlue" />
      <div className="flex flex-row justify-between items-center">
        <div>
          <Avatar
            alt={`${user?.name}'s avatar`}
            className="absolute top-16 left-4 w-32 h-32 border-4 border-white z-10 cursor-pointer"
            src={profilePhoto}
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
      <div className="relative mt-8">
        <form id="profileForm" onSubmit={handleSubmit(onSubmit)}>
          <CardBody className="mt-10 ps-8 text-black ">
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
                {" "}
                {/* Added text-black */}
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
                {" "}
                {/* Added text-black */}
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
                {" "}
                {/* Added text-black */}
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
                {" "}
                {/* Added text-black */}
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
        </form>
      </div>

      {/* Save and Cancel buttons */}
      <div className="flex items-center justify-end gap-2 mt-2">
        <Button
          className="bg-customBlue font-semibold text-white"
          color="default"
          form="profileForm"
          type="submit"
        >
          Save
        </Button>
        <Button color="default" variant="shadow" onClick={toggleEditMode}>
          <X size={16} />
        </Button>
      </div>
    </Card>
  );
};

export default UpdateProfileInfo;
