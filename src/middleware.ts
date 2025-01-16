import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwtDecode from "jwt-decode"; // Assume you're using jwtDecode
import { verifyToken } from "./lib/verifyToken";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Access cookies from the request in middleware
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    // If no token, redirect to login page unless it's a public route
    if (
      pathname === "/login" ||
      pathname === "/register" ||
      pathname.startsWith("/api/auth/callback")
    ) {
      return NextResponse.next(); // Allow access to login/register
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url)
      );
    }
  }

  // Verify token (you can decode it to check user roles, etc.)
  try {
    const decodedToken: any = verifyToken(accessToken);

    // Check user role, permissions, etc., based on the decoded token
    if (decodedToken?.role === "ADMIN" && pathname.startsWith("/admin")) {
      return NextResponse.next(); // Allow access to admin route
    } else if (
      decodedToken?.role === "USER" &&
      pathname.startsWith("/profile")
    ) {
      return NextResponse.next(); // Allow access to user profile
    }
    // else {
    //   // If role does not match, redirect to a not authorized page
    //   return NextResponse.redirect(new URL("/", request.url));
    // }
  } catch (error) {
    // Token verification failed, redirect to login
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    "/user",
    "/admin",
    "/user/[[...page]]",
    "/admin/[[...page]]",
    "/login",
    "/register",
  ],
};
