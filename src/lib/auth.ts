import { type NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./db"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";


export const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/onboarding/step-1-biometrics", // Redirige aquí después del registro
  },
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Permite vincular cuentas con mismo email
    }),
    
    // Email/Password (Credentials)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales inválidas");
        }

        // Buscar usuario
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Usuario no encontrado");
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    // Redirigir usuarios nuevos al onboarding
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Verificar si es la primera vez que inicia sesión
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { profile: true },
        });

        // Si no tiene perfil, es un usuario nuevo
        if (existingUser && !existingUser.profile) {
          // La redirección al onboarding se maneja en pages.signIn
          return true;
        }
      }
      return true;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};