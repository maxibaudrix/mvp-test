// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Aquí puedes agregar lógica adicional
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Rutas públicas que no requieren autenticación
        const publicPaths = [
          '/',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/legal',
          '/calculators',
        ]

        const path = req.nextUrl.pathname

        // Permitir rutas públicas
        if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
          return true
        }

        // Requerir autenticación para el resto
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],