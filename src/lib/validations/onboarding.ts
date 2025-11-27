// src/lib/validations/onboarding.ts
import { z } from 'zod';

export const BiometricsSchema = z.object({
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
        required_error: 'El género es requerido.',
    }),
    dateOfBirth: z.string().refine(date => {
        const d = new Date(date);
        // Validar que sea una fecha válida y que no sea futura
        return !isNaN(d.getTime()) && d < new Date();
    }, {
        message: 'Fecha de nacimiento inválida o futura.',
    }),
    heightCm: z.number().int().min(50, 'Altura mínima: 50 cm.').max(250, 'Altura máxima: 250 cm.'),
    weightKg: z.number().min(30, 'Peso mínimo: 30 kg.').max(300, 'Peso máximo: 300 kg.'),
});

export const GoalSchema = z.object({
    activityLevel: z.enum(['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTREMELY_ACTIVE'], {
        required_error: 'El nivel de actividad es requerido.',
    }),
    goal: z.enum(['LOSE_WEIGHT', 'MAINTAIN', 'GAIN_MUSCLE'], {
        required_error: 'El objetivo es requerido.',
    }),
    targetWeightKg: z.number().min(30, 'Peso objetivo mínimo: 30 kg.').max(300, 'Peso objetivo máximo: 300 kg.'),
    weeklyGoalKg: z.number().min(-1.5, 'Meta semanal mínima: -1.5 kg.').max(1, 'Meta semanal máxima: 1 kg.'),
});

export const DietSchema = z.object({
    dietType: z.string().min(1, 'El tipo de dieta es requerido.'),
    allergies: z.array(z.string()).optional(),
    excludedIngredients: z.array(z.string()).optional(),
});

/**
 * Esquema completo del flujo de Onboarding.
 */
export const OnboardingSchema = BiometricsSchema.and(GoalSchema).and(DietSchema);

export type OnboardingFormSchema = z.infer<typeof OnboardingSchema>;