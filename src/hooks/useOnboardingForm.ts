// src/hooks/useOnboardingForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ============================================
// SCHEMAS CON MENSAJES EN ESPAÑOL
// ============================================

export const biometricsSchema = z.object({
  age: z
    .number({
      required_error: 'La edad es obligatoria',
      invalid_type_error: 'Ingresa un número válido',
    })
    .min(18, 'Debes ser mayor de 18 años')
    .max(100, 'Edad máxima: 100 años'),

  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    required_error: 'Selecciona tu género',
    invalid_type_error: 'Selecciona una opción válida',
  }),

  height: z
    .number({
      required_error: 'La altura es obligatoria',
      invalid_type_error: 'Ingresa un número válido',
    })
    .min(140, 'Altura mínima: 140 cm')
    .max(220, 'Altura máxima: 220 cm'),

  weight: z
    .number({
      required_error: 'El peso es obligatorio',
      invalid_type_error: 'Ingresa un número válido',
    })
    .min(40, 'Peso mínimo: 40 kg')
    .max(200, 'Peso máximo: 200 kg'),

  bodyFatPercentage: z
    .number({
      invalid_type_error: 'Ingresa un número válido',
    })
    .min(5, 'Porcentaje mínimo: 5%')
    .max(50, 'Porcentaje máximo: 50%')
    .optional()
    .or(z.literal(undefined)), // ✅ Permite vacío sin errores
});

export const goalSchema = z.object({
  goalType: z.enum(['LOSE', 'GAIN', 'MAINTAIN', 'RECOMP'], {
    required_error: 'Selecciona tu objetivo',
    invalid_type_error: 'Selecciona una opción válida',
  }),

  targetWeight: z
    .number({
      invalid_type_error: 'Ingresa un número válido',
    })
    .min(40, 'Peso mínimo: 40 kg')
    .max(200, 'Peso máximo: 200 kg')
    .optional(),

  goalSpeed: z
    .enum(['SLOW', 'MODERATE', 'AGGRESSIVE'], {
      invalid_type_error: 'Selecciona una opción válida',
    })
    .optional(),
});

export const lifestyleSchema = z.object({
  activityLevel: z.enum(
    ['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTREMELY_ACTIVE'],
    {
      required_error: 'Selecciona tu nivel de actividad',
      invalid_type_error: 'Selecciona una opción válida',
    }
  ),

  goal: z.enum(['MAINTAIN', 'LOSE', 'GAIN'], {
    required_error: 'Selecciona tu objetivo',
    invalid_type_error: 'Selecciona una opción válida',
  }),

  weeklyTarget: z
    .number({
      invalid_type_error: 'Ingresa un número válido',
    })
    .min(0.25, 'Mínimo: 0.25 kg/semana')
    .max(1.5, 'Máximo: 1.5 kg/semana')
    .optional(),
});

export const dietSchema = z.object({
  dietType: z.enum(['OMNIVORE', 'VEGETARIAN', 'VEGAN', 'KETO', 'PALEO'], {
    required_error: 'Selecciona tu tipo de dieta',
    invalid_type_error: 'Selecciona una opción válida',
  }),

  allergies: z.array(z.string()).optional(),
  excludedIngredients: z.array(z.string()).optional(),
});

// ============================================
// HOOK GENÉRICO
// ============================================

export function useOnboardingForm<T extends z.ZodType>(
  step: number,
  schema: T,
  onSuccess: (data: z.infer<T>) => void
) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: 'onBlur', // Valida cuando el campo pierde foco
  });

  const handleSubmitStore = form.handleSubmit(
    (data) => {
      onSuccess(data);
    },
    (errors) => {
      console.error('Errores de validación:', errors);
    }
  );

  return {
    ...form,
    handleSubmitStore,
  };
}