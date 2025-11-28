// src/store/onboarding.ts
'use client'; // NECESARIO para Zustand en Next.js

import { create } from 'zustand';
import { BiometricsData, GoalData, DietData, OnboardingData } from '@/types/onboarding'; // Asumiendo que estos tipos existen

interface OnboardingStore {
  // Solo la propiedad 'data' que contiene todos los campos
  data: Partial<OnboardingData>; 
  step: number;
    
  // Acciones
  setBiometrics: (data: BiometricsData) => void;
  setGoal: (data: GoalData) => void;
  setDiet: (data: DietData) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetOnboarding: () => void;
}

/**
 * Tienda de Zustand para manejar el estado temporal del flujo de Onboarding.
 */
export const useOnboardingStore = create<OnboardingStore>((set) => ({
  data: {},
  step: 1,

  setBiometrics: (biometrics) => set((state) => ({ data: { ...state.data, ...biometrics } })),
  setGoal: (goal) => set((state) => ({ data: { ...state.data, ...goal } })),
  setDiet: (diet) => set((state) => ({ data: { ...state.data, ...diet } })),
  
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  
  resetOnboarding: () => set({ data: {}, step: 1 }),
}));