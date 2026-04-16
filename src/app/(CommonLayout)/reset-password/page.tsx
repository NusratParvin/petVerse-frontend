"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input, Button, Card, Spacer } from "@heroui/react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { useResetPasswordMutation } from "@/src/redux/features/auth/authApi";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const token = searchParams.get("token");
  //   console.log(urlToken);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: any) => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");

      return;
    }

    try {
      const result = await resetPassword({
        newPassword: data.newPassword,
        token,
        id,
      }).unwrap();

      if (result.success) {
        toast.success("Password reset successfully!");
        router.push("/login");
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="md:w-1/2 w-full mx-auto p-8 text-gray-700">
        <h2 className="text-center mb-6">Reset Your Password</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* New Password Field */}
          <Input
            label="New Password"
            placeholder="Enter your new password"
            type={showPassword ? "text" : "password"}
            {...register("newPassword", {
              required: "New password is required",
            })}
            fullWidth
            color={errors.newPassword ? "danger" : "default"}
            endContent={
              <Button
                className="text-gray-600 bg-transparent"
                size="sm"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <Eye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </Button>
            }
            variant="bordered"
          />

          <Spacer y={1} />

          {/* Confirm Password Field */}
          <Input
            label="Confirm New Password"
            placeholder="Confirm your new password"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Please confirm your password",
            })}
            fullWidth
            color={errors.confirmPassword ? "danger" : "default"}
            endContent={
              <Button
                className="text-gray-600 bg-transparent"
                size="sm"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <Eye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </Button>
            }
            variant="bordered"
          />

          <Spacer y={1.5} />

          <div className="w-1/3 mx-auto">
            <Button color="primary" disabled={isLoading} type="submit">
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
