import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session.user model in NextAuth
   */
  // types/next-auth.d.ts

  interface User {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
  }

  /**
   * Extends the built-in session model to include accessToken
   */
  interface Session {
    user?: User;
    accessToken?: string;
  }
}

interface JWT {
  accessToken?: string;
  user?: User;
}
interface Session {
  accessToken?: string;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}
