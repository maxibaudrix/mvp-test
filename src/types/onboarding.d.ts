// src/types/onboarding.d.ts

// ============================================
// PASO 1: BIOMETRICS
// ============================================
export interface BiometricsData {
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  height: number; // cm
  weight: number; // kg
  bodyFatPercentage?: number; // opcional
}

// ============================================
// PASO 2: GOAL
// ============================================
export interface GoalData {
  goalType: 'LOSE' | 'GAIN' | 'MAINTAIN' | 'RECOMP';
  targetWeight?: number; // kg, solo si LOSE o GAIN
  goalSpeed?: 'SLOW' | 'MODERATE' | 'AGGRESSIVE'; // solo si no MAINTAIN
}

// ============================================
// PASO 3-4: LIFESTYLE (Activity + Training Level)
// ============================================
export interface LifestyleData {
  activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE';
  goal: 'MAINTAIN' | 'LOSE' | 'GAIN'; // Simplificado para cálculos
  weeklyTarget?: number; // kg/semana, solo si LOSE o GAIN
}

// ============================================
// PASO 5: DIET
// ============================================
export interface DietData {
  dietType: 'OMNIVORE' | 'VEGETARIAN' | 'VEGAN' | 'KETO' | 'PALEO';
  allergies?: string[]; // Array de alergias
  excludedIngredients?: string[]; // Array de ingredientes excluidos
}

// ============================================
// DATOS COMPLETOS DEL ONBOARDING (Estructura Anidada)
// ============================================
export interface OnboardingData {
  biometrics?: BiometricsData;
  goal?: GoalData;
  lifestyle?: LifestyleData;
  diet?: DietData;
  
  // Macros calculados (se añaden en Step 6)
  calculatedMacros?: {
    bmr: number;
    tdee: number;
    targetCalories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}