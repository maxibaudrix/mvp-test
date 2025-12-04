// src/app/onboarding/step-3-diet/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import StepButtons from '@/components/onboarding/StepButtons';
import { useOnboardingForm, dietSchema } from '@/hooks/useOnboardingForm';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';

const NEXT_PATH = '/onboarding/step-4-training-level';
const PREV_PATH = '/onboarding/step-2-goal';

const DIET_TYPES = [
  { value: 'OMNIVORE', label: 'Omnívora' },
  { value: 'VEGETARIAN', label: 'Vegetariana' },
  { value: 'VEGAN', label: 'Vegana' },
  { value: 'KETO', label: 'Cetogénica' },
  { value: 'PALEO', label: 'Paleo' },
];

const ALLERGIES = [
  'Gluten',
  'Lactosa',
  'Frutos Secos',
  'Mariscos',
  'Huevo',
  'Soja',
];

export default function Step3DietPage() {
  const router = useRouter();

  const {
    register,
    handleSubmitStore,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useOnboardingForm(3, dietSchema, () => {
    router.push(NEXT_PATH);
  });

  const allergies = watch('allergies') || [];

  const toggleAllergy = (allergy: string) => {
    const current = allergies;
    if (current.includes(allergy)) {
      setValue('allergies', current.filter((a: string) => a !== allergy));
    } else {
      setValue('allergies', [...current, allergy]);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-slate-800 bg-slate-900">
          <StepHeader
            currentStep={3}
            totalSteps={6}
            title="Preferencias Dietéticas"
            description="Personaliza tu plan según tu estilo de alimentación"
          />
          
          <CardContent>
            <form onSubmit={handleSubmitStore} className="space-y-6">
              {/* Tipo de Dieta */}
              <div>
                <Label htmlFor="dietType" className="mb-2 block">Tipo de Dieta</Label>
                <Select id="dietType" {...register('dietType')}>
                  <option value="">Selecciona tu dieta</option>
                  {DIET_TYPES.map(diet => (
                    <option key={diet.value} value={diet.value}>
                      {diet.label}
                    </option>
                  ))}
                </Select>
                {errors.dietType && (
                  <p className="text-red-500 text-xs mt-1">{errors.dietType.message?.toString()}</p>
                )}
              </div>

              {/* Alergias / Intolerancias */}
              <div>
                <Label className="mb-4 block">Alergias e Intolerancias</Label>
                <div className="grid grid-cols-2 gap-3">
                  {ALLERGIES.map(allergy => (
                    <Label
                      key={allergy}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        allergies.includes(allergy)
                          ? 'bg-red-500/20 border-2 border-red-500/50 text-red-400'
                          : 'bg-slate-800 border-2 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={allergies.includes(allergy)}
                        onChange={() => toggleAllergy(allergy)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        allergies.includes(allergy)
                          ? 'bg-red-500 border-red-500'
                          : 'border-slate-600'
                      }`}>
                        {allergies.includes(allergy) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium">{allergy}</span>
                    </Label>
                  ))}
                </div>
              </div>

              <StepButtons
                currentStep={3}
                nextPath={NEXT_PATH}
                prevPath={PREV_PATH}
                isSubmitting={isSubmitting}
                onNext={() => {}}
                isLastStep={false}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}