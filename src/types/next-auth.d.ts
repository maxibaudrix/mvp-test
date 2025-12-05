import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    password?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
