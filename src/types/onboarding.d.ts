/**
 * Tipos para los datos recogidos en el flujo de Onboarding (Pasos 1-3).
 */

// Paso 1: Biometría
export interface BiometricsData {
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  heightCm: number;
  weightKg: number;
  age: number; // Asumo que la edad se calcula en el front-end y se guarda aquí.
  heightCm: number;
  weightKg: number;
}

// Paso 2: Objetivos y Actividad
export interface GoalData {
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
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