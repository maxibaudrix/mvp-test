import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
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
