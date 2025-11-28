// src/components/onboarding/Step2Goal.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

import { GoalSchema } from '@/lib/validations/onboarding';
import { useOnboardingStore } from '@/store/onboarding';

type GoalFormData = {
  activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE';
  goal: 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE';
  targetWeightKg: number;
  weeklyGoalKg: number;
};

const activityOptions = [
    { value: 'SEDENTARY', label: 'Sedentario (poco o ningún ejercicio)' },
    { value: 'LIGHTLY_ACTIVE', label: 'Actividad ligera (1-3 días a la semana)' },
    { value: 'MODERATELY_ACTIVE', label: 'Actividad moderada (3-5 días a la semana)' },
    { value: 'VERY_ACTIVE', label: 'Actividad alta (6-7 días a la semana)' },
    { value: 'EXTREMELY_ACTIVE', label: 'Actividad extrema (2x al día)' },
];

const goalOptions = [
    { value: 'LOSE_WEIGHT', label: 'Perder Peso (Déficit Calórico)' },
    { value: 'MAINTAIN', label: 'Mantener Peso (Mantenimiento)' },
    { value: 'GAIN_MUSCLE', label: 'Ganar Músculo (Superávit Calórico)' },
];

const Step2Goal: React.FC = () => {
  const router = useRouter();
  const setGoal = useOnboardingStore((state) => state.setGoal);
  const onboardingData = useOnboardingStore((state) => state.data);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GoalFormData>({
    resolver: zodResolver(GoalSchema),
    defaultValues: {
      activityLevel: onboardingData.activityLevel || 'MODERATELY_ACTIVE',
      goal: onboardingData.goal || 'MAINTAIN',
      // Usa el peso actual como fallback o base
      targetWeightKg: onboardingData.targetWeightKg || onboardingData.weightKg || 75, 
      weeklyGoalKg: onboardingData.weeklyGoalKg || 0.5,
    },
  });

  const onSubmit = (data: GoalFormData) => {
    // 1. Guardar datos en Zustand
    setGoal({ 
        activityLevel: data.activityLevel,
        goal: data.goal,
        targetWeightKg: data.targetWeightKg,
        weeklyGoalKg: data.weeklyGoalKg,
    });
    
    // 2. Navegar al siguiente paso
    router.push('/onboarding/step-3-diet');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nivel de Actividad</label>
        <select 
          {...register('activityLevel')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        >
          {activityOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.activityLevel && <p className="text-red-500 text-xs mt-1">{errors.activityLevel.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Meta Principal</label>
        <select 
          {...register('goal')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        >
          {goalOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.goal && <p className="text-red-500 text-xs mt-1">{errors.goal.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Peso Meta (kg)</label>
        <Input 
          type="number" 
          step="0.1" 
          {...register('targetWeightKg', { valueAsNumber: true })} 
          placeholder="Ej: 75.0"
        />
        {errors.targetWeightKg && <p className="text-red-500 text-xs mt-1">{errors.targetWeightKg.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Meta Semanal (kg)</label>
        <Input 
          type="number" 
          step="0.1" 
          {...register('weeklyGoalKg', { valueAsNumber: true })} 
          placeholder="Ej: 0.5 (Perder) o 0.2 (Ganar)"
        />
        {errors.weeklyGoalKg && <p className="text-red-500 text-xs mt-1">{errors.weeklyGoalKg.message}</p>}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Calculando...' : 'Siguiente'}
        </Button>
      </div>
    </form>
  );
};

export default Step2Goal;