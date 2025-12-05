import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    password?: string | null;
  }

  declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
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
