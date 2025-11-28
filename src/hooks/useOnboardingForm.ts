// src/hooks/useOnboardingForm.ts
import { useForm, Resolver, DefaultValues, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, AnyZodObject } from 'zod';
import { useOnboardingStore } from '@/store/onboarding';

/**
 * Mapa entre paso numérico y nombre del método del store.
 * Ajusta si cambias nombres o añades pasos.
 */
const stepActions = {
  1: 'setBiometrics',
  2: 'setGoal',
  3: 'setDiet',
} as const;

type StepKey = keyof typeof stepActions;

/**
 * Hook genérico para manejar formularios del onboarding.
 * - `step`: número del paso (1,2,3...)
 * - `schema`: un Zod object (AnyZodObject) que describe los campos del formulario
 * - `onSubmitCallback`: opcional, se ejecuta después de guardar en el store
 */

export const dietSchema = z.object({
  dietType: z.enum(['NONE', 'VEGETARIAN', 'VEGAN', 'PALEO', 'KETO']),
  allergens: z.string().optional(),
  restrictions: z.string().optional(),
});

export function useOnboardingForm<T extends Record<string, any>>(
  step: number,
  schema: AnyZodObject,
  onSubmitCallback?: (values: T) => void
) {
  const store = useOnboardingStore();

  // Construir defaultValues sólo con las keys definidas en el esquema (schema.shape)
  const defaultValuesObj: Partial<T> = {};

  const shape = (schema as AnyZodObject).shape as Record<string, z.ZodTypeAny>;

  Object.keys(shape).forEach((key) => {
    const storeVal = store.data[key as keyof typeof store.data];
    // si storeVal es undefined, dejamos string vacío para evitar valores `undefined` en defaultValues
    (defaultValuesObj as any)[key] = storeVal ?? '';
  });

  // react-hook-form espera DefaultValues<T> — hacemos un cast controlado
  const defaultValues = defaultValuesObj as unknown as DefaultValues<T>;

  const form = useForm<T>({
    resolver: zodResolver(schema) as unknown as Resolver<T>,
    defaultValues,
    mode: 'onTouched',
  });

  const onSubmit: SubmitHandler<T> = (values) => {
    const actionName = stepActions[step as keyof typeof stepActions];

    // Ejecutamos el setter correspondiente en el store.
    // Hacemos cast a any aquí porque los setters del store aceptan tipos concretos (BiometricsData, GoalData, DietData)
    // y `values` es T (unión genérica). En tiempo de ejecución los shapes coinciden con el schema.
    try {
      (store as any)[actionName](values as any);
    } catch (err) {
      // Por seguridad, captura errores del setter
      // (opcional) console.error('Error al ejecutar action del store:', err);
    }

    if (onSubmitCallback) {
      onSubmitCallback(values);
    }
  };

  return {
    ...form,
    // Nombre claro para integrar con componentes: form.handleSubmitStore()
    handleSubmitStore: form.handleSubmit(onSubmit),
  };
}
