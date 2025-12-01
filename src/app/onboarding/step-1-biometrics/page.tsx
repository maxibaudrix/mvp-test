// src/app/onboarding/step-1-biometrics/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import StepButtons from '@/components/onboarding/StepButtons';
import { useOnboardingForm, biometricsSchema } from '@/hooks/useOnboardingForm';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

const NEXT_PATH = '/onboarding/step-2-goal';
const PREV_PATH = '/login';

export default function Step1BiometricsPage() {
  const router = useRouter();

  const {
    register,
    handleSubmitStore,
    formState: { errors, isSubmitting },
    watch,
  } = useOnboardingForm(1, biometricsSchema, () => {
    router.push(NEXT_PATH);
  });

  const gender = watch('gender');

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-slate-800 bg-slate-900">
          <StepHeader
            currentStep={1}
            totalSteps={6}
            title="Datos Biométricos"
            description="Cuéntanos sobre tu cuerpo para personalizar tu plan"
          />
          
          <CardContent>
            <form onSubmit={handleSubmitStore} className="space-y-6">
              {/* Edad */}
              <div>
                <Label htmlFor="age">Edad (años)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  {...register('age', { valueAsNumber: true })}
                  className="mt-2"
                />
                {errors.age && (
                  <p className="text-red-500 text-xs mt-1">{errors.age.message?.toString()}</p>
                )}
              </div>

              {/* Género */}
              <div>
                <Label className="mb-3 block">Género</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['MALE', 'FEMALE', 'OTHER'].map(g => (
                    <Label
                      key={g}
                      htmlFor={g}
                      className={`flex-1 p-4 text-center rounded-xl border cursor-pointer transition-all ${
                        gender === g 
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        id={g}
                        value={g}
                        {...register('gender')}
                        className="sr-only"
                      />
                      {g === 'MALE' ? 'Hombre' : g === 'FEMALE' ? 'Mujer' : 'Otro'}
                    </Label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender.message?.toString()}</p>
                )}
              </div>

              {/* Altura */}
              <div>
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  {...register('height', { valueAsNumber: true })}
                  className="mt-2"
                />
                {errors.height && (
                  <p className="text-red-500 text-xs mt-1">{errors.height.message?.toString()}</p>
                )}
              </div>

              {/* Peso */}
              <div>
                <Label htmlFor="weight">Peso Actual (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  {...register('weight', { valueAsNumber: true })}
                  className="mt-2"
                />
                {errors.weight && (
                  <p className="text-red-500 text-xs mt-1">{errors.weight.message?.toString()}</p>
                )}
              </div>

              {/* % Grasa (Opcional) */}
              <div>
                <Label htmlFor="bodyFatPercentage">
                  Porcentaje de Grasa Corporal 
                  <span className="text-slate-500 text-xs ml-2">(Opcional)</span>
                </Label>
                <Input
                  id="bodyFatPercentage"
                  type="number"
                  step="0.1"
                  placeholder="20.0"
                  {...register('bodyFatPercentage', { valueAsNumber: true })}
                  className="mt-2"
                />
              </div>

              <StepButtons
                currentStep={1}
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