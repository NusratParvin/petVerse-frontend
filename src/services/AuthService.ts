"use server";

import { cookies } from "next/headers";

// export const loginUser = async (data: FormValues) => {
//   const res = await fetch(`${process.env.BACKEND_URL}/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//     cache: "no-store",
//   });
//   const userInfo = await res.json();

//   return userInfo;
// };

// export const registerUser = async (data: UserData) => {
//   const res = await fetch(`${process.env.BACKEND_URL}/register`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//     cache: "no-store",
//   });
//   const userInfo = await res.json();

//   return userInfo;
// };

export const logoutCookies = async () => {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");

  return { success: true };
};

// export const getCurrentUser = () => {
//   const accessToken = cookies().get("accessToken")?.value;
//   let decodedToken: IUserJwtPayload | null = null;

//   if (accessToken) {
//     decodedToken = jwtDecode<IUserJwtPayload>(accessToken);

//     return {
//       _id: decodedToken._id,
//       name: decodedToken.name,
//       email: decodedToken.email,
//       role: decodedToken.role,
//       profilePhoto: decodedToken.profilePhoto,
//     };
//   }
// };

// export const getNewAccessToken = async () => {
//   try {
//     const refreshToken = cookies().get("refreshToken")?.value;

//     const res = await axiosInstance({
//       url: "/auth/refresh-token",
//       method: "POST",
//       withCredentials: true,
//       headers: {
//         cookie: `refreshToken=${refreshToken}`,
//       },
//     });

//     return res.data;
//   } catch (error) {
//     throw new Error("Failed to get new access token");
//   }
// };
