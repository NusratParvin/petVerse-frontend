"use client";

import { useForm, FieldValues } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { Input, Checkbox, Button } from "@heroui/react";
import { useState } from "react";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import image from "@/src/assets/images/Fish-logo-template-on-transparent-background-PNG.png";
import { useSignupMutation } from "@/src/redux/features/auth/authApi";

const Registration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FieldValues>();

  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [signup, { isLoading, error }] = useSignupMutation();

  const router = useRouter();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Fetching environment variables for Cloudinary
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Cloudinary upload handler using environment variables
  const handleProfilePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

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

      setValue("profilePhoto", data.secure_url);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
    }
  };

  const onSubmit = async (data: FieldValues) => {
    console.log(data);
    const toastId = toast.loading("Signing up...");

    const userInfo = { ...data, role: "user" };

    try {
      const res = await signup(userInfo).unwrap();

      console.log(res);
      if (res.statusCode === 201) {
        toast.success("Registration successful!", {
          id: toastId,
          duration: 2000,
          className: "text-green-600",
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (signUpError: any) {
      console.log(signUpError);
      if (signUpError.status === 400 && signUpError.data) {
        const message =
          signUpError?.data?.errorSources[0]?.path +
          signUpError?.data?.errorSources[0]?.message;

        toast.error(`SignUp Failed: ${message}`, {
          id: toastId,
          duration: 4000,
          className: "text-red-700",
        });
      } else {
        toast.error("Something went wrong", {
          id: toastId,
          duration: 2000,
          className: "bg-red-500 text-white",
        });
      }
    }
  };

  return (
    // <div className="bg-white flex items-center min-h-screen  p-4 mt-16 mb-24">
    //   <div className="w-full max-w-4xl mx-auto  ">
    //     <div className="grid md:grid-cols-2 gap-16 bg-gray-50 shadow w-full sm:p-8 px-6 rounded-xl relative">
    //       {/* Left side content */}
    //       <div className="flex items-start justify-center flex-col">
    //         <div className="mb-4">
    //           <Link className="flex items-center justify-start" href="/">
    //             <Image
    //               alt="logo"
    //               className="w-20 inline-block"
    //               height={40}
    //               src={image}
    //               width={160}
    //             />
    //             <p className="font-normal font-raleway text-5xl text-[#FF7F50] tracking-tighter">
    //               <span className="italic font-semibold">fish</span>Cove
    //             </p>
    //           </Link>
    //         </div>

    //         <div className="space-y-8 ml-12 ">
    //           <div className="flex items-center gap-3">
    //             <CheckCircle className="w-5 h-5 text-[#33B7FF]" />
    //             <h4 className="text-gray-800 text-base font-semibold">
    //               Create Your Account
    //             </h4>
    //           </div>
    //           <div className="flex items-center gap-3">
    //             <CheckCircle className="w-5 h-5 text-[#33B7FF]" />
    //             <h4 className="text-gray-800 text-base font-semibold">
    //               Simple & Secure Registration
    //             </h4>
    //           </div>
    //           <div className="flex items-center gap-3">
    //             <CheckCircle className="w-5 h-5 text-[#33B7FF]" />
    //             <h4 className="text-gray-800 text-base font-semibold">
    //               Terms and Conditions Agreement
    //             </h4>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Form Section */}
    //       <form
    //         className="md:max-w-lg w-full mx-auto"
    //         onSubmit={handleSubmit(onSubmit)}
    //       >
    //         <div className="mb-8">
    //           <h3 className="text-black/60 text-2xl font-bold uppercase tracking-tighter">
    //             Register
    //           </h3>
    //         </div>

    //         <div className="space-y-4">
    //           {/* Name Field */}
    //           <div className="flex items-baseline gap-3">
    //             <label className="text-gray-800 text-sm w-1/5" htmlFor="name">
    //               Name
    //             </label>
    //             <div className="relative w-4/5">
    //               <Input
    //                 {...register("name", { required: "Name is required" })}
    //                 fullWidth
    //                 //   underlined
    //                 //   clearable
    //                 color={errors.name ? "danger" : "default"}
    //                 //   helperText={errors.name?.message as string}
    //                 placeholder="Enter name"
    //               />
    //             </div>
    //           </div>

    //           {/* Email Field */}
    //           <div className="flex items-baseline gap-3">
    //             <label className="text-gray-800 text-sm w-1/5" htmlFor="email">
    //               Email
    //             </label>
    //             <div className="relative w-4/5">
    //               <Input
    //                 {...register("email", {
    //                   required: "Email is required",
    //                   pattern: {
    //                     value:
    //                       /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    //                     message: "Enter a valid email address",
    //                   },
    //                 })}
    //                 fullWidth
    //                 //   underlined
    //                 //   clearable
    //                 color={errors.email ? "danger" : "default"}
    //                 //   helperText={errors.email?.message as string}
    //                 placeholder="Enter email"
    //               />
    //             </div>
    //           </div>

    //           {/* Address Field */}
    //           <div className="flex items-baseline gap-3">
    //             <label
    //               className="text-gray-800 text-sm w-1/5"
    //               htmlFor="address"
    //             >
    //               Address
    //             </label>
    //             <div className="relative w-4/5">
    //               <Input
    //                 {...register("address")}
    //                 fullWidth
    //                 placeholder="Enter address"
    //               />
    //             </div>
    //           </div>

    //           {/*  Phone Number Field */}
    //           <div className="flex items-baseline gap-3">
    //             <label className="text-gray-800 text-sm w-1/5" htmlFor=" phone">
    //               Phone
    //             </label>
    //             <div className="relative w-4/5">
    //               <Input
    //                 {...register("phone", {
    //                   required: "Phone number is required",
    //                   pattern: {
    //                     value: /^[0-9]{8,}$/,
    //                     message: "Enter a valid phone number",
    //                   },
    //                 })}
    //                 fullWidth
    //                 //   clearable
    //                 color={errors.phone ? "danger" : "default"}
    //                 //   helperText={errors.phone?.message as string}
    //                 placeholder="Enter  Phone number"
    //               />
    //             </div>
    //           </div>

    //           {/* Password Field */}
    //           <div className="flex items-baseline gap-3  ">
    //             <label
    //               className="text-gray-800 text-sm w-1/5"
    //               htmlFor="password"
    //             >
    //               Password
    //             </label>
    //             <div className="relative w-4/5">
    //               <Input
    //                 {...register("password", {
    //                   required: "Password is required",
    //                   minLength: 6,
    //                 })}
    //                 // fullWidth
    //                 className="w-full"
    //                 color={errors.password ? "danger" : "default"}
    //                 endContent={
    //                   <Button
    //                     className="text-gray-600 bg-transparent"
    //                     size="sm"
    //                     onClick={togglePasswordVisibility}
    //                   >
    //                     {showPassword ? (
    //                       <EyeOff className="text-2xl text-default-400 pointer-events-none" />
    //                     ) : (
    //                       <Eye className="text-2xl text-default-400 pointer-events-none" />
    //                     )}
    //                   </Button>
    //                 }
    //                 placeholder="Enter password"
    //                 type={showPassword ? "text" : "password"}
    //               />
    //             </div>
    //           </div>

    //           {/* Profile Photo Upload */}
    //           <div className="flex items-baseline gap-3">
    //             <label
    //               className="text-gray-800 text-sm w-1/5"
    //               htmlFor="profilePhoto"
    //             >
    //               Photo
    //             </label>
    //             <div className="relative w-4/5">
    //               <input
    //                 accept="image/*"
    //                 className="w-full mt-2 bg-gray-100 rounded-xl p-1.5 text-sm text-gray-500"
    //                 type="file"
    //                 onChange={handleProfilePhotoUpload}
    //               />
    //               {uploading && (
    //                 <p className="text-green-500 text-xs pt-1">Uploading...</p>
    //               )}
    //             </div>
    //           </div>

    //           {/* Terms and Conditions */}
    //           <div className="flex items-start space-x-2">
    //             <Checkbox
    //               id="terms"
    //               {...register("terms", {
    //                 required: "You must accept the terms and conditions",
    //               })}
    //               color="primary"
    //               size="sm"
    //             />
    //             <label className="text-gray-800 text-xs" htmlFor="terms">
    //               I accept the{" "}
    //               <Link
    //                 className="text-[#33B7FF] font-semibold hover:underline text-xs"
    //                 href="/terms"
    //               >
    //                 Terms and Conditions
    //               </Link>
    //             </label>
    //           </div>
    //           {errors.terms && (
    //             <p className="text-red-500 text-xs">
    //               {errors.terms.message as string}
    //             </p>
    //           )}
    //         </div>

    //         <div className="mt-6">
    //           <Button
    //             className="bg-[#FF7F50] w-full text-white font-semibold rounded-sm"
    //             disabled={uploading}
    //             type="submit"
    //           >
    //             {uploading ? "Uploading..." : "Create Account"}
    //           </Button>
    //         </div>

    //         <p className="text-sm text-gray-800 mt-2 text-center">
    //           Already have an account?{" "}
    //           <Link
    //             className="text-[#33B7FF] font-semibold hover:underline ml-1"
    //             href="/login"
    //           >
    //             Login here
    //           </Link>
    //         </p>
    //       </form>
    //       <div className="divider absolute left-0 right-0 mx-auto w-1 h-full border-l border-gray-200 max-md:hidden" />
    //     </div>
    //   </div>
    // </div>

    <div className="bg-white dark:bg-pv-bg flex items-center min-h-screen p-4 mt-16 mb-24">
      <div className="w-full max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 bg-gray-50/80 dark:bg-pv-surface/80 backdrop-blur-sm shadow-xl w-full sm:p-8 px-6 rounded-xl relative border border-steel-blue/10 dark:border-steel-blue/20">
          {/* Left side content */}
          <div className="flex items-start justify-center flex-col">
            <div className="mb-4">
              <Link className="flex items-center justify-start" href="/">
                <Image
                  alt="logo"
                  className="w-20 inline-block"
                  height={40}
                  src={image}
                  width={160}
                />
                <p className="font-normal font-raleway text-5xl text-steel-blue dark:text-lime-burst tracking-tighter">
                  <span className="italic font-semibold">fish</span>Cove
                </p>
              </Link>
            </div>

            <div className="space-y-8 ml-12">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-steel-blue dark:text-lime-burst" />
                <h4 className="text-gray-700 dark:text-white/80 text-base font-semibold">
                  Create Your Account
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-steel-blue dark:text-lime-burst" />
                <h4 className="text-gray-700 dark:text-white/80 text-base font-semibold">
                  Simple & Secure Registration
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-steel-blue dark:text-lime-burst" />
                <h4 className="text-gray-700 dark:text-white/80 text-base font-semibold">
                  Terms and Conditions Agreement
                </h4>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form
            className="md:max-w-lg w-full mx-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-8">
              <h3 className="text-steel-blue/70 dark:text-lime-burst/80 text-2xl font-bold uppercase tracking-tighter">
                Register
              </h3>
            </div>

            <div className="space-y-4">
              {/* Name Field */}
              <div className="flex items-baseline gap-3">
                <label
                  className="text-gray-600 dark:text-white/60 text-sm w-1/5"
                  htmlFor="name"
                >
                  Name
                </label>
                <div className="relative w-4/5">
                  <Input
                    {...register("name", { required: "Name is required" })}
                    fullWidth
                    color={errors.name ? "danger" : "default"}
                    placeholder="Enter name"
                    classNames={{
                      input: "dark:bg-pv-surface/50 dark:text-white",
                    }}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message as string}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="flex items-baseline gap-3">
                <label
                  className="text-gray-600 dark:text-white/60 text-sm w-1/5"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative w-4/5">
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    fullWidth
                    color={errors.email ? "danger" : "default"}
                    placeholder="Enter email"
                    classNames={{
                      input: "dark:bg-pv-surface/50 dark:text-white",
                    }}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message as string}
                    </p>
                  )}
                </div>
              </div>

              {/* Address Field */}
              <div className="flex items-baseline gap-3">
                <label
                  className="text-gray-600 dark:text-white/60 text-sm w-1/5"
                  htmlFor="address"
                >
                  Address
                </label>
                <div className="relative w-4/5">
                  <Input
                    {...register("address")}
                    fullWidth
                    placeholder="Enter address"
                    classNames={{
                      input: "dark:bg-pv-surface/50 dark:text-white",
                    }}
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="flex items-baseline gap-3">
                <label
                  className="text-gray-600 dark:text-white/60 text-sm w-1/5"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <div className="relative w-4/5">
                  <Input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{8,}$/,
                        message: "Enter a valid phone number",
                      },
                    })}
                    fullWidth
                    color={errors.phone ? "danger" : "default"}
                    placeholder="Enter phone number"
                    classNames={{
                      input: "dark:bg-pv-surface/50 dark:text-white",
                    }}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message as string}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="flex items-baseline gap-3">
                <label
                  className="text-gray-600 dark:text-white/60 text-sm w-1/5"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative w-4/5">
                  <Input
                    {...register("password", {
                      required: "Password is required",
                      minLength: 6,
                    })}
                    className="w-full"
                    color={errors.password ? "danger" : "default"}
                    endContent={
                      <button
                        className="text-gray-600 dark:text-white/50 focus:outline-none"
                        type="button"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="text-xl text-default-400" />
                        ) : (
                          <Eye className="text-xl text-default-400" />
                        )}
                      </button>
                    }
                    placeholder="Enter password"
                    type={showPassword ? "text" : "password"}
                    classNames={{
                      input: "dark:bg-pv-surface/50 dark:text-white",
                    }}
                  />
                  {errors.terms && (
                    <p className="text-red-500 text-xs">
                      {errors.terms.message as string}
                    </p>
                  )}
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div className="flex items-baseline gap-3">
                <label
                  className="text-gray-600 dark:text-white/60 text-sm w-1/5"
                  htmlFor="profilePhoto"
                >
                  Photo
                </label>
                <div className="relative w-4/5">
                  <input
                    accept="image/*"
                    className="w-full mt-2 bg-gray-100 dark:bg-pv-surface/50 rounded-xl p-1.5 text-sm text-gray-500 dark:text-white/60 dark:file:text-white/80 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-steel-blue file:text-white hover:file:bg-steel-blue/80 dark:file:bg-lime-burst dark:file:text-gray-900"
                    type="file"
                    onChange={handleProfilePhotoUpload}
                  />
                  {uploading && (
                    <p className="text-steel-blue dark:text-lime-burst text-xs pt-1">
                      Uploading...
                    </p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  {...register("terms", {
                    required: "You must accept the terms and conditions",
                  })}
                  color="primary"
                  size="sm"
                  classNames={{
                    label: "text-gray-600 dark:text-white/60 text-xs",
                  }}
                />
                <label
                  className="text-gray-600 dark:text-white/60 text-xs"
                  htmlFor="terms"
                >
                  I accept the{" "}
                  <Link
                    className="text-steel-blue dark:text-lime-burst font-semibold hover:underline text-xs"
                    href="/terms"
                  >
                    Terms and Conditions
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-xs">
                  {errors.terms.message as string}
                </p>
              )}
            </div>

            <div className="mt-6">
              <Button
                className="bg-steel-blue dark:bg-lime-burst text-white dark:text-gray-900 w-full font-semibold rounded-lg hover:opacity-90 transition-opacity"
                disabled={uploading || isLoading}
                type="submit"
              >
                {uploading || isLoading
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>
            </div>

            <p className="text-sm text-gray-600 dark:text-white/60 mt-2 text-center">
              Already have an account?{" "}
              <Link
                className="text-steel-blue dark:text-lime-burst font-semibold hover:underline ml-1"
                href="/login"
              >
                Login here
              </Link>
            </p>
          </form>

          <div className="divider absolute left-0 right-0 mx-auto w-px h-full border-l border-steel-blue/15 dark:border-white/10 max-md:hidden" />
        </div>
      </div>
    </div>
  );
};

export default Registration;
