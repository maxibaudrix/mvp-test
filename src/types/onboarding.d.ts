/**
 * Tipos para los datos recogidos en el flujo de Onboarding (Pasos 1-3).
 */

// Paso 1: Biometría
export interface BiometricsData {
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  heightCm: number;
  weightKg: number;
}

// Paso 2: Objetivos y Actividad
export interface GoalData {
  activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE';
  goal: 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE';
  targetWeightKg: number;
  weeklyGoalKg: number;
}

// Paso 3: Preferencias Dietéticas
export interface DietData {
  dietType: string; // omnivore, vegetarian, vegan, keto, paleo
  // Usamos arrays para el manejo de formularios, el backend lo convertirá a cadena
  allergies: string[]; 
  excludedIngredients: string[]; 
}

/**
 * Objeto completo de los datos del Onboarding.
 */
export type OnboardingData = BiometricsData & GoalData & DietData;