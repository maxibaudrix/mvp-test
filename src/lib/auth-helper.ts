import { getServerSession } from 'next-auth';
// Asumo que tu configuración de NextAuth está en '@/lib/auth'.
// Este archivo debe existir y exportar 'authOptions'.
import { auth } from '@/lib/auth'; 

/**
 * Obtiene el ID del usuario actual a partir de la sesión de NextAuth.
 * @returns El ID del usuario o null si no hay sesión o ID.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(auth);

  if (!session?.user?.id) {
    // Si no hay sesión o ID, devuelve null.
    return null;
  }
  return session.user.id;
}