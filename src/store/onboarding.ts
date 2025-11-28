// src/store/onboarding.ts
'use client';

import { create } from 'zustand';
import { BiometricsData, GoalData, DietData, OnboardingData } from '@/types/onboarding';

interface OnboardingStore {
  data: Partial<OnboardingData>; 
  step: number;
    
  setBiometrics: (data: BiometricsData) => void;
  setGoal: (data: GoalData) => void;
  setDiet: (data: DietData) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetOnboarding: () => void;
  calculateAndSaveMacros: () => Promise<void>;
}

/**
 * Función helper para calcular macros basado en los datos del usuario
 */
function calculateMacros(data: Partial<OnboardingData>) {
  const { weightKg, heightCm, age, gender, activityLevel, goal } = data;
  
  // Valores por defecto si faltan datos
  if (!weightKg || !heightCm || !age) {
    return {
      targetCalories: 2000,
      targetMacros: { protein: 150, carbs: 200, fat: 65 }
    };
  }

  // Cálculo de BMR (Basal Metabolic Rate) usando Mifflin-St Jeor
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else if (gender === 'female') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    // Para 'other', usar promedio
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78;
  }

  // Factores de actividad (coinciden con los valores de GoalData)
  const activityFactors: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    extra_active: 1.9
  };

  const tdee = bmr * (activityFactors[activityLevel || 'moderate'] || 1.55);

  // Ajustar según objetivo
  let targetCalories = tdee;
  if (goal === 'lose_weight') {
    targetCalories = tdee - 500; // Déficit de 500 cal
  } else if (goal === 'gain_muscle') {
    targetCalories = tdee + 300; // Superávit de 300 cal
  }
  // Si es 'maintain', targetCalories = tdee (sin cambios)

  // Calcular macros (ejemplo: 30% proteína, 40% carbos, 30% grasa)
  const proteinCalories = targetCalories * 0.30;
  const carbsCalories = targetCalories * 0.40;
  const fatCalories = targetCalories * 0.30;

  return {
    targetCalories: Math.round(targetCalories),
    targetMacros: {
      protein: Math.round(proteinCalories / 4), // 4 cal/g
      carbs: Math.round(carbsCalories / 4),     // 4 cal/g
      fat: Math.round(fatCalories / 9)          // 9 cal/g
    }
  };
}

/**
 * Tienda de Zustand para manejar el estado temporal del flujo de Onboarding.
 */
export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  data: {},
  step: 1,

  setBiometrics: (biometrics) => set((state) => ({ data: { ...state.data, ...biometrics } })),
  setGoal: (goal) => set((state) => ({ data: { ...state.data, ...goal } })),
  setDiet: (diet) => set((state) => ({ data: { ...state.data, ...diet } })),
  
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  
  resetOnboarding: () => set({ data: {}, step: 1 }),

  calculateAndSaveMacros: async () => {
    const currentData = get().data;
    const macros = calculateMacros(currentData);
    
    set((state) => ({
      data: {
        ...state.data,
        ...macros
      }
    }));
  },
}));