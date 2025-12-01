// src/hooks/useOnboardingForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schemas actualizados
export const biometricsSchema = z.object({
  age: z.number().min(18).max(100),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  height: z.number().min(140).max(220),
  weight: z.number().min(40).max(200),
  bodyFatPercentage: z.number().min(5).max(50).optional(),
});

export const goalSchema = z.object({
  goalType: z.enum(['LOSE', 'GAIN', 'MAINTAIN', 'RECOMP']),
  targetWeight: z.number().optional(),
  goalSpeed: z.enum(['SLOW', 'MODERATE', 'AGGRESSIVE']).optional(),
});

export const lifestyleSchema = z.object({
  activityLevel: z.enum(['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTREMELY_ACTIVE']),
  goal: z.enum(['MAINTAIN', 'LOSE', 'GAIN']),
  weeklyTarget: z.number().min(0.25).max(1.5).optional(),
});

export const dietSchema = z.object({
  dietType: z.enum(['OMNIVORE', 'VEGETARIAN', 'VEGAN', 'KETO', 'PALEO']),
  allergies: z.array(z.string()).optional(),
  excludedIngredients: z.array(z.string()).optional(),
});

export function useOnboardingForm<T extends z.ZodType>(
  step: number,
  schema: T,
  onSuccess: (data: z.infer<T>) => void
) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
  });

  const handleSubmitStore = form.handleSubmit((data) => {
    onSuccess(data);
  });

  return {
    ...form,
    handleSubmitStore,
  };
}