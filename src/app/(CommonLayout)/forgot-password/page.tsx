"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input, Button, Card, Spacer } from "@nextui-org/react";
import { toast } from "sonner";

import { useForgetPasswordMutation } from "@/src/redux/features/auth/authApi";

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Form setup with React Hook Form
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation(); // RTK Query mutation for forget-password API
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const result = await forgetPassword(data.email).unwrap();

      if (result.success) {
        setEmailSent(true);
        console.log(result);
        toast.success(
          "A reset link has been sent to your email. Please check your inbox."
        );
      }
    } catch (error) {
      console.error("Error sending reset email", error);
      toast.error("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  bg-gray-50">
      <Card className="md:w-1/2 w-full mx-auto p-8 text-gray-700">
        <h2 className="text-center mb-6 ">Forgot Your Password?</h2>
        {!emailSent ? (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <Input
              label="Email"
              placeholder="Enter your email address"
              type="email"
              {...register("email", { required: "Email is required" })}
              fullWidth
              className="text-gray-700"
              color={errors.email ? "danger" : "default"}
              variant="bordered"
            />

            <Spacer y={1.5} />

            <div className="w-1/3 mx-auto">
              <Button
                className="py-1.5 px-3"
                color="primary"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? "Sending..." : "Send Reset Email"}
              </Button>
            </div>
          </form>
        ) : (
          <h2 className="text-center">
            A reset link has been sent to your email. Please check your inbox.
          </h2>
        )}
      </Card>
    </div>
  );
};

export default ForgetPassword;
