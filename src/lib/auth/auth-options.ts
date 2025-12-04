// src/lib/auth/auth-options.ts
import { type AuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import AppleProvider from 'next-auth/providers/apple'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import { verifyPassword } from './password'
import type { JWT } from 'next-auth/jwt'
import type { Session, User, Account } from 'next-auth'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // OAuth - Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // OAuth - Apple
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),

    // Credentials (Email/Password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials?: { email: string; password: string }) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña requeridos')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('Credenciales inválidas')
        }

        const isValidPassword = await verifyPassword(
          credentials.password,
          user.password
        )

        if (!isValidPassword) {
          throw new Error('Credenciales inválidas')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login', // Error redirect
    verifyRequest: '/login', // Email verification
    newUser: '/onboarding/welcome', // New users go to onboarding
  },

  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Redirect después de login
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  events: {
    async createUser({ user }: { user: User }) {
      // Enviar email de bienvenida al registrarse
      // Implementar aquí si necesitas
      console.log('Nuevo usuario creado:', user.email)
    },
  },

  debug: process.env.NODE_ENV === 'development',
}