// src/types/user.d.ts

// NOTA: Si usas la CLI de Supabase, reemplaza con tu tipo Database
// import { Database } from '@/lib/supabase/types';

/**
 * Tipos para la información del perfil del usuario (coincide con la tabla UserProfile de Prisma).
 * Se utilizan String | null para campos opcionales y compatibilidad con JSON/cadenas para SQLite.
 */
export interface UserProfile {
  id: string; // UUID del usuario, coincide con auth.users.id
  firstName: string | null;
  lastName: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  dateOfBirth: string | null;
  heightCm: number | null;
  weightKg: number | null;
  activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE' | null;
  goal: 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE' | null;
  dietType: string | null;
  
  // Importante: Usamos String? para compatibilidad con SQLite en desarrollo (antes era String[])
  allergies: string | null; // Cadena JSON o separada por comas
  excludedIngredients: string | null; // Cadena JSON o separada por comas
  
  targetWeightKg: number | null;
  weeklyGoalKg: number | null;
}

/**
 * Extensión del tipo de usuario para incluir el perfil asociado.
 */
export interface AuthenticatedUser {
  id: string;
  email: string | undefined;
  // Añadimos el perfil para acceder a los datos biométricos
  profile: UserProfile | null;
  // AÑADIDO (Resuelve el error 'name' en page.tsx)
    name: string | null; 

    // Relaciones (ambas existen en el modelo User de Prisma)
    profile: UserProfileType | null;
    
    // AÑADIDO (Resuelve el error 'goals' en page.tsx)
    goals: UserGoalsType | null;
}