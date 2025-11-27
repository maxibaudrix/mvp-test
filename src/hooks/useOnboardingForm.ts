
// src/hooks/useOnboardingForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboardingStore } from '@/store/onboarding';

// Esquemas de validación (deben coincidir con el store)
export const personalInfoSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: 'Selecciona tu género' }),
  birthDate: z.string().refine(date => !isNaN(new Date(date).getTime()), 'Fecha inválida'),
  heightCm: z.number().min(50, 'Altura mínima 50 cm').max(250, 'Altura máxima 250 cm'),
  weightKg: z.number().min(30, 'Peso mínimo 30 kg').max(300, 'Peso máximo 300 kg'),
});

export const lifestyleSchema = z.object({
  activityLevel: z.enum(['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTREMELY_ACTIVE'], { required_error: 'Selecciona tu nivel de actividad' }),
  goal: z.enum(['MAINTAIN', 'LOSE', 'GAIN'], { required_error: 'Selecciona tu objetivo' }),
  weeklyTarget: z.number().min(0.25, 'Mínimo 0.25 kg').max(1.5, 'Máximo 1.5 kg'),
});

export const dietSchema = z.object({
    dietType: z.enum(['NONE', 'VEGETARIAN', 'VEGAN', 'PALEO', 'KETO']),
    allergens: z.string().optional(),
    restrictions: z.string().optional(),
});

// Tipos de formularios
export type PersonalInfoForm = z.infer<typeof personalInfoSchema>;
export type LifestyleForm = z.infer<typeof lifestyleSchema>;
export type DietForm = z.infer<typeof dietSchema>;

/**
 * Hook para gestionar el formulario de Onboarding y sincronizarlo con Zustand.
 * @param {number} step - El paso actual del onboarding.
 * @param {z.ZodSchema} schema - El esquema de validación para el paso.
 * @param {Function} onSubmitCallback - Función a ejecutar al enviar (además de guardar en el store).
 * @returns El objeto useForm.
 */
export const useOnboardingForm = <T extends PersonalInfoForm | LifestyleForm | DietForm>(
    step: number,
    schema: z.ZodSchema<T>,
    onSubmitCallback: (data: T) => void
) => {
    const { data: onboardingData, updateStep } = useOnboardingStore();
    
    // Obtener valores iniciales basados en el esquema y el estado actual
    const initialValues = Object.keys(schema.shape).reduce((acc, key) => {
        // @ts-ignore
        acc[key] = onboardingData[key];
        return acc;
    }, {} as T);

    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: initialValues,
        mode: 'onTouched',
    });

    const onSubmit = (data: T) => {
        updateStep(data);
        onSubmitCallback(data);
    };

    return {
        ...form,
        handleSubmitStore: form.handleSubmit(onSubmit),
    };
};
        