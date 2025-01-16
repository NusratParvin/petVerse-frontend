// import { NextAuthOptions } from "next-auth";
// import FacebookProvider from "next-auth/providers/facebook";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions: NextAuthOptions = {
//   // Configure one or more authentication providers
//   providers: [
//     FacebookProvider({
//       clientId: process.env.FACEBOOK_CLIENT_ID as string,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID as string,
//       clientSecret: process.env.GOOGLE_SECRET as string,
//     }),
//   ],
//   // pages: {
//   //   signIn: "/login",
//   // },
//   callbacks: {
//     async session({ session, token }) {
//       // Initialize the user object if it does not already exist
//       if (!session.user) {
//         session.user = { name: "", email: "", image: "" };
//       }

//       // Now that you are sure `session.user` is defined, assign the name from the token
//       session.user.name = token.name as string;

//       return session;
//     },

//     async jwt({ token, user }) {
//       // Add the user info to the JWT token if available
//       if (user) {
//         token.user = user;
//       }
//       return token;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

import { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // console.log("called", token, user, account);
      if (user && account) {
        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_BASE_API}/auth/social-login`;
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              profilePhoto: user.image,
              provider: account.provider,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to authenticate with backend");
          }

          const data = await response.json();
          token.accessToken = data.token;
          token.user = data.data;
        } catch (error) {
          console.error("Error in social login:", error);
          throw error;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user as any;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    // signIn: "/login",
    // error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
  },
};
