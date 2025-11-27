
// src/app/onboarding/step-5-diet/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import StepHeader from '@/components/onboarding/StepHeader';
import StepButtons from '@/components/onboarding/StepButtons';
import { useOnboardingForm, dietSchema } from '@/hooks/useOnboardingForm';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea'; // Asumimos un componente Textarea
import { useOnboardingStore } from '@/store/onboarding';

const NEXT_PATH = '/onboarding/step-6-macros';
const PREV_PATH = '/onboarding/step-4-training-level';

const DietOptions = [
    { value: 'NONE', label: 'Ninguna' },
    { value: 'VEGETARIAN', label: 'Vegetariana' },
    { value: 'VEGAN', label: 'Vegana' },
    { value: 'PALEO', label: 'Paleo' },
    { value: 'KETO', label: 'Keto (Ceto)' },
];

export default function Step5DietPage() {
  const router = useRouter();
  const { calculateAndSaveMacros } = useOnboardingStore();

  const {
    register,
    handleSubmitStore,
    formState: { errors, isSubmitting },
    watch,
  } = useOnboardingForm(5, dietSchema, (data) => {
    // Aquí es donde calculamos y guardamos las macros finales antes de avanzar
    calculateAndSaveMacros(data); 
    router.push(NEXT_PATH);
  });
  
  const dietType = watch('dietType');

  return (
    <Card className="shadow-2xl">
      <StepHeader
        currentStep={5}
        totalSteps={6}
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
              className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-white"
            >
              {DietOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.dietType && <p className="text-red-500 text-xs mt-1">{errors.dietType.message}</p>}
          </div>

          {/* Alérgenos */}
          <div>
            <Label htmlFor="allergens" className="mb-2 block">Alérgenos (ej: nueces, lácteos)</Label>
            <Input
              id="allergens"
              type="text"
              placeholder="Separa con comas"
              {...register('allergens')}
              className="mt-1 block w-full"
            />
            {errors.allergens && <p className="text-red-500 text-xs mt-1">{errors.allergens.message}</p>}
          </div>

          {/* Restricciones */}
          <div>
            <Label htmlFor="restrictions" className="mb-2 block">Otras Restricciones (ej: no picante)</Label>
            <Input // Debería ser Textarea, pero usamos Input si no tenemos Textarea
              id="restrictions"
              type="text" 
              placeholder="Intolerancia al gluten, no comer cerdo, etc."
              {...register('restrictions')}
              className="mt-1 block w-full"
            />
            {errors.restrictions && <p className="text-red-500 text-xs mt-1">{errors.restrictions.message}</p>}
          </div>

          <StepButtons
            currentStep={5}
            nextPath={NEXT_PATH}
            prevPath={PREV_PATH}
            isSubmitting={isSubmitting}
            onNext={() => {}} 
            isLastStep={false}
          />
        </form>
      </CardContent>
    </Card>
  );
}
        