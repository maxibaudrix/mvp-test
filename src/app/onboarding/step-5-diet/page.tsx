// src/app/onboarding/step-5-diet/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import StepButtons from '@/components/onboarding/StepButtons';
import { useOnboardingForm, dietSchema } from '@/hooks/useOnboardingForm'; 
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea'; 
import { useOnboardingStore } from '@/store/onboarding';
import { DietData } from '@/types/onboarding';

const NEXT_PATH = '/onboarding/step-6-macros';
const PREV_PATH = '/onboarding/step-4-training-level';
const CURRENT_STEP = 5; // Paso actual

const DietOptions = [
  { value: 'NONE', label: 'Ninguna' },
  { value: 'VEGETARIAN', label: 'Vegetariana' },
  { value: 'VEGAN', label: 'Vegana' },
  { value: 'PALEO', label: 'Paleo' },
  { value: 'KETO', label: 'Keto (Ceto)' },
];

// Convierte cadena separada por comas a string[]
const stringToArray = (str: string | undefined): string[] =>
  str?.split(',').map(s => s.trim()).filter(s => s.length > 0) || [];

export default function Step5DietPage() {
  const router = useRouter();
  const { setDiet, calculateAndSaveMacros } = useOnboardingStore();

  // Hook de formulario
  const {
    register,
    handleSubmitStore,
    formState: { errors, isSubmitting },
    watch,
  } = useOnboardingForm(CURRENT_STEP, dietSchema, async (formData) => {
    const dietDataForStore: DietData = {
      dietType: formData.dietType,
      allergies: stringToArray(formData.allergens),
      excludedIngredients: stringToArray(formData.restrictions),
    };

    setDiet(dietDataForStore);
    await calculateAndSaveMacros();
    router.push(NEXT_PATH);
  });

  const dietType = watch('dietType');

  // Helper para normalizar mensajes de error
  const FieldErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-red-500 text-sm mt-1">{message}</p>;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <StepHeader
          currentStep={CURRENT_STEP}
          totalSteps={6} // Total de pasos del onboarding
          title="Preferencias Dietéticas"
          description="Personaliza tu plan indicando tu tipo de dieta y restricciones."
        />
        <CardContent>
          <form onSubmit={handleSubmitStore} className="space-y-6">
            {/* Tipo de Dieta */}
            <div>
              <Label htmlFor="dietType" className="mb-2 block">Tipo de Dieta</Label>
              <select
                id="dietType"
                {...register('dietType')}
                className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                {DietOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FieldErrorMessage message={errors.dietType?.message?.toString()} />
            </div>

            {/* Alérgenos */}
            <div>
              <Label htmlFor="allergens" className="mb-2 block">Alérgenos (Separados por coma)</Label>
              <Textarea
                id="allergens"
                {...register('allergens')}
                placeholder="Ej: gluten, nueces, lactosa"
                className="w-full p-3 border rounded-lg"
              />
              <FieldErrorMessage message={errors.allergens?.message?.toString()} />
            </div>

            {/* Restricciones */}
            <div>
              <Label htmlFor="restrictions" className="mb-2 block">Ingredientes Excluidos / Restricciones (Separados por coma)</Label>
              <Textarea
                id="restrictions"
                {...register('restrictions')}
                placeholder="Ej: carne roja, azúcar refinada, cebolla"
                className="w-full p-3 border rounded-lg"
              />
              <FieldErrorMessage message={errors.restrictions?.message?.toString()} />
            </div>

            <StepButtons
              prevPath={PREV_PATH}
              isSubmitting={isSubmitting}
              currentStep={CURRENT_STEP}
              nextPath={NEXT_PATH}
              onNext={() => {}}
              isLastStep={false}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
