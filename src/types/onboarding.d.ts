// src/types/onboarding.d.ts

// ============================================
// PASO 1: BIOMÉTRICOS
// ============================================
export interface BiometricsData {
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  height: number; // cm
  weight: number; // kg
  bodyFatPercentage?: number;
}

// ============================================
// PASO 2: OBJETIVO
// ============================================
export interface GoalData {
  goalType: 'LOSE' | 'GAIN' | 'MAINTAIN' | 'RECOMP';
  targetWeight?: number;
  goalSpeed?: 'SLOW' | 'MODERATE' | 'AGGRESSIVE';
}

// ============================================
// PASO 3: ACTIVIDAD DIARIA (NEAT)
// ============================================
export interface ActivityData {
  activityLevel:
    | 'SEDENTARY'
    | 'LIGHTLY_ACTIVE'
    | 'MODERATELY_ACTIVE'
    | 'VERY_ACTIVE'
    | 'SUPER_ACTIVE';

  dailySteps?: 'UNDER_3000' | '3K_6K' | '6K_10K' | 'OVER_10K';

  sittingHours?: 'LESS_THAN_4H' | '4H_6H' | '6H_8H' | 'MORE_THAN_8H';

  workType?: 'DESK' | 'MIXED' | 'ACTIVE' | 'PHYSICAL';
}

// ============================================
// PASO 4: NIVEL DE ENTRENAMIENTO
// ============================================
export interface LifestyleData {
  activityLevel:
    | 'SEDENTARY'
    | 'LIGHTLY_ACTIVE'
    | 'MODERATELY_ACTIVE'
    | 'VERY_ACTIVE'
    | 'EXTREMELY_ACTIVE';

  goal: 'MAINTAIN' | 'LOSE' | 'GAIN';
  weeklyTarget?: number;
}

// ============================================
// PASO 5: DIETA
// ============================================
export interface DietData {
  dietType:
    | 'NONE'
    | 'OMNIVORE'
    | 'VEGETARIAN'
    | 'VEGAN'
    | 'PESCETARIAN'
    | 'KETO'
    | 'PALEO'
    | 'MEDITERRANEAN'
    | 'LOW_CARB'
    | 'CARNIVORE'
    | 'OTHER';

  allergies?: string[];
  excludedIngredients?: string[];
}

// ============================================
// DATOS COMPLETOS DEL ONBOARDING
// ============================================
export interface OnboardingData {
  biometrics?: BiometricsData;
  goal?: GoalData;
  activity?: ActivityData;       // ✅ agregado
  lifestyle?: LifestyleData;
  diet?: DietData;

  calculatedMacros?: {
    bmr: number;
    tdee: number;
    targetCalories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}
