// src/app/onboarding/step-4-training-level/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import StepButtons from '@/components/onboarding/StepButtons';
import { useOnboardingForm, lifestyleSchema } from '@/hooks/useOnboardingForm';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { AlertCircle } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboarding';  

const NEXT_PATH = '/onboarding/step-5-diet';
const PREV_PATH = '/onboarding/step-3-lifestyle';

const ActivityOptions = [
  { value: 'SEDENTARY', label: 'Sedentario (Poco o nada de ejercicio)' },
  { value: 'LIGHTLY_ACTIVE', label: 'Ligeramente Activo (Ejercicio 1-3 días/sem)' },
  { value: 'MODERATELY_ACTIVE', label: 'Moderadamente Activo (Ejercicio 3-5 días/sem)' },
  { value: 'VERY_ACTIVE', label: 'Muy Activo (Ejercicio 6-7 días/sem)' },
  { value: 'EXTREMELY_ACTIVE', label: 'Extremadamente Activo (Doble sesión/trabajo físico)' },
];

export default function Step4TrainingLevelPage() {
  const router = useRouter();

  const { setLifestyle } = useOnboardingStore();   

  const FieldErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-red-500 text-xs mt-1">{message}</p>;
  };

  const {
    register,
    handleSubmitStore,
    formState: { errors, isSubmitting },
    watch,
  } = useOnboardingForm(4, lifestyleSchema, (formData) => {
    // ✅ NUEVO CALLBACK — guarda en Zustand
    setLifestyle({
      activityLevel: formData.activityLevel,
      goal: formData.goal,
      weeklyTarget: formData.weeklyTarget,
    });
    router.push(NEXT_PATH);
  });

  const goal = watch('goal');

  return (
    <Card className="shadow-2xl">
      <StepHeader
        currentStep={4}
        totalSteps={6}
        title="Tu Estilo de Vida y Objetivos"
        description="Dinos qué tan activo eres y cuál es tu meta principal."
      />

      <CardContent>
        <form onSubmit={handleSubmitStore} className="space-y-6">

          {/* Nivel de Actividad */}
          <div>
            <Label htmlFor="activityLevel" className="mb-2 block">Nivel de Actividad Física</Label>
            <select
              id="activityLevel"
              {...register('activityLevel')}
              className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-white"
            >
              <option value="">Selecciona tu nivel</option>
              {ActivityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldErrorMessage message={errors.activityLevel?.message?.toString()} />
          </div>

          {/* Objetivo */}
          <div>
            <Label className="mb-2 block">Objetivo Principal</Label>
            <div className="flex space-x-4">
              {['MAINTAIN', 'LOSE', 'GAIN'].map(g => (
                <Label
                  key={g}
                  htmlFor={g}
                  className={`flex-1 p-3 text-center rounded-lg border cursor-pointer transition-all ${
                    goal === g 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    id={g}
                    value={g}
                    {...register('goal')}
                    className="sr-only"
                  />
                  {g === 'MAINTAIN'
                    ? 'Mantener Peso'
                    : g === 'LOSE'
                    ? 'Perder Peso'
                    : 'Ganar Músculo'}
                </Label>
              ))}
            </div>
            <FieldErrorMessage message={errors.goal?.message?.toString()} />
          </div>

          {/* Meta Semanal */}
          {goal !== 'MAINTAIN' && goal && (
            <div>
              <Label htmlFor="weeklyTarget" className="mb-2 block">Meta Semanal (Kg)</Label>
              <Input
                id="weeklyTarget"
                type="number"
                step="0.25"
                min="0.25"
                max="1.5"
                placeholder={goal === 'LOSE' ? '0.5' : '0.25'}
                {...register('weeklyTarget', { valueAsNumber: true })}
                className="mt-1 block w-full"
              />

              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-yellow-500" />
                Recomendado entre 0.25 kg y 1.5 kg por semana.
              </p>

              <FieldErrorMessage message={errors.weeklyTarget?.message?.toString()} />
            </div>
          )}

          <StepButtons
            currentStep={4}
            nextPath={NEXT_PATH}
            prevPath={PREV_PATH}
            isSubmitting={isSubmitting}
            onNext={() => {}} // La navegación ocurre dentro de handleSubmit
            isLastStep={false}
          />
        </form>
      </CardContent>
    </Card>
  );
}
