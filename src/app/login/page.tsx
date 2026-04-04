"use client";

import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { getSession, signIn, useSession } from "next-auth/react";

// import image from "@/src/assets/images/Fish-logo-template-on-transparent-background-PNG.png";
import { useAppDispatch } from "@/src/redux/hooks";
import {
  useLoginMutation,
  useSocialLoginMutation,
} from "@/src/redux/features/auth/authApi";
import { setUser } from "@/src/redux/features/auth/authSlice";
import { verifyToken } from "@/src/lib/verifyToken";
import { IUserJwtPayload } from "@/src/types";
import image from "@/src/assets/images/Fish-logo-template-on-transparent-background-PNG.png";

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [socialLogin] = useSocialLoginMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // const handleSocialLogin = async (provider: "google" | "facebook") => {
  //   try {
  //     const result = await signIn(provider, {
  //       redirect: false,
  //     });

  //     if (result?.error) {
  //       toast("Failed to sign in. Please try again.");
  //       return;
  //     }

  //     const session = await getSession();
  //     // if (!session) {
  //     //   console.error("Session is missing after login attempt.", session);
  //     // }

  //     if (session?.user && session?.accessToken) {
  //       // Update Redux store
  //       dispatch(
  //         setUser({
  //           user: session.user,
  //           token: session.accessToken,
  //         })
  //       );

  //       // Set access token in cookie manually if needed
  //       document.cookie = `accessToken=${session.accessToken}; path=/; secure; samesite=lax`;

  //       toast("Successfully signed in!");

  //       router.push("/user/newsfeed");
  //     }
  //   } catch (error) {
  //     console.error("Social login error:", error);
  //     toast("An error occurred during sign-in.");
  //   }
  // };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const autofillCredentials = (role: "user" | "admin") => {
  //   if (role === "user") {
  //     setEmail("u@u.com");
  //     setPassword("111111");
  //   } else if (role === "admin") {
  //     setEmail("admin@gmail.com");
  //     setPassword("111111");
  //   }
  // };

  const autofillCredentials = (role: "user" | "admin") => {
    if (role === "user") {
      setValue("email", "u@u.com"); // Sets the email value
      setValue("password", "u@u.com"); // Sets the password value
    } else if (role === "admin") {
      setValue("email", "admin@gmail.com");
      setValue("password", "111111");
    }
  };
  const onSubmit = async (data: any) => {
    // Display loading toast
    const toastId = toast.loading("Logging in...");

    // console.log(data);

    try {
      const res = await login(data).unwrap();

      console.log(res);

      if (res.statusCode === 200) {
        const verifiedUser = verifyToken(res.token) as IUserJwtPayload;

        if (verifiedUser) {
          dispatch(setUser({ user: res.data, token: res.token }));

          toast.success("Login successful!", {
            id: toastId,
            duration: 2000,
            className: "text-green-500",
          });

          setTimeout(() => {
            if (res?.data?.role === "USER") {
              router.push("/user/newsfeed");
            } else if (res?.data?.role === "ADMIN") {
              router.push("/admin/dashboard");
            }
            // router.push("/");
          }, 1000);
        }
      }
    } catch (loginError: any) {
      if (loginError?.status === 400 && loginError?.data) {
        toast.error(`Login Failed: ${loginError?.data?.message}`, {
          id: toastId,
          duration: 4000,
          className: "text-red-700",
        });
      } else {
        toast.error(`${loginError?.data?.message}`, {
          id: toastId,
          duration: 2000,
          className: "bg-red-700 text-white",
        });
      }
    }
  };

  // const handleSocialLogin = async (provider: "google" | "facebook") => {
  //   toast.loading(`Redirecting to ${provider}...`);
  //   await signIn(provider, {
  //     callbackUrl: "/user/newsfeed",
  //   });
  // };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-md w-full">
          <Link className="flex items-center justify-center mb-6" href="/">
            <Image
              alt="logo"
              className="w-12 h-12"
              height={40}
              src={image}
              width={40}
            />
            <p className="font-normal font-raleway text-4xl text-[#FF7F50] tracking-tighter">
              <span className="italic font-semibold">fish</span>Cove
            </p>
          </Link>

          <div className="p-8 rounded-2xl bg-white shadow">
            <h2 className="text-black/60 text-center text-2xl font-semibold uppercase tracking-tighter">
              Sign in
            </h2>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">
                <label
                  className="text-gray-600 text-sm font-semibold"
                  htmlFor="email"
                >
                  Email
                </label>
                {/* <input
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  // onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-gray-800 text-sm border-b border-gray-300 px-4 py-1.5 rounded-none outline-gray-300"
                  {...register("email", { required: "Email is required" })}
                /> */}
                <input
                  id="email"
                  placeholder="Enter email"
                  className="w-full text-gray-800 text-sm border-b border-gray-300 px-4 py-1.5 rounded-none outline-gray-300"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  className="text-gray-600 text-sm font-semibold"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  {/* <input
                    className="w-full text-gray-800 text-sm border-b border-gray-300 px-4 py-1.5 rounded-none outline-gray-300"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    // onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                  /> */}
                  <input
                    id="password"
                    placeholder="Enter password"
                    type={showPassword ? "text" : "password"}
                    className="w-full text-gray-800 text-sm border-b border-gray-300 px-4 py-1.5 rounded-none outline-gray-300"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  <button
                    className="absolute right-4 text-gray-600"
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message as string}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm">
                  <Link href="/forgot-password">
                    <p className="text-[#FF7F50] hover:underline text-xs">
                      Forgot your password?
                    </p>
                  </Link>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                {/* <button
                  className="py-1 px-4 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  type="button"
                  onClick={() => autofillCredentials("user")}
                >
                  Demo User
                </button>
                <button
                  className="py-1 px-4 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  type="button"
                  onClick={() => autofillCredentials("admin")}
                >
                  Demo Admin
                </button> */}
                <button
                  className="py-1 px-4 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  type="button"
                  onClick={() => autofillCredentials("user")}
                >
                  Demo User
                </button>
                <button
                  className="py-1 px-4 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  type="button"
                  onClick={() => autofillCredentials("admin")}
                >
                  Demo Admin
                </button>
              </div>

              <button
                className="w-full py-2 px-4 tracking-tight rounded-sm text-white font-normal text-base bg-[#33B7FF] hover:bg-blue-400"
                type="submit"
              >
                Sign In
              </button>
            </form>
            {/* social buttons */}
            {/* <div className="mt-4 space-y-2">
              <button
                className="w-full py-2 px-4 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                onClick={() => handleSocialLogin("google")}
              >
                Sign in with Google
              </button>
              <button
                className="w-full py-2 px-4 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                onClick={() => handleSocialLogin("facebook")}
              >
                Sign in with Facebook
              </button>
            </div> */}

            <p className="text-gray-800 text-xs mt-8 text-center">
              Don&lsquo;t have an account?
              <Link href="/register">
                <span className="text-[#FF7F50] hover:underline ml-1 whitespace-nowrap font-semibold">
                  Register here
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
