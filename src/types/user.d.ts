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
  
  // AÑADIDO: Metas nutricionales
  targetCalories: number | null;
  targetMacros: {
    protein: number;
    carbs: number;
    fat: number;
    tdee
  } | null;
}

/**
 * Tipo para las metas del usuario
 */
export interface UserGoals {
  id: string;
  userId: string;
  targetCalories: number | null;
  targetMacros: {
    protein: number;
    carbs: number;
    fat: number;
  } | null;
  tdee?: number; // <-- agregar esta línea (opcional si puede no existir)
  createdAt: string;
  updatedAt: string;
}

/**
 * Extensión del tipo de usuario para incluir el perfil asociado.
 */
export interface AuthenticatedUser {
  id: string;
  email: string | undefined;
  name: string | null;
  
  // Relaciones (ambas existen en el modelo User de Prisma)
  profile: UserProfile | null;
  goals: UserGoals | null;
}