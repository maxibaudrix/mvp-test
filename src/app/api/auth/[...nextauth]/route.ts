// src/app/api/auth/[...nextauth]/route.ts

// Importamos los 'handlers' exportados directamente desde tu archivo de configuración (src/lib/auth.ts).
// Estos handlers ya contienen toda la lógica de NextAuth(config).

import { handlers } from '@/lib/auth';

// Renombramos y exportamos los handlers para que Next.js los use como las rutas GET y POST.
// Esto es el estándar para el App Router de Next.js.
export const { GET, POST } = handlers;