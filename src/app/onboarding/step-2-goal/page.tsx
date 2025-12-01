// src/app/onboarding/step-2-goal/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import StepButtons from '@/components/onboarding/StepButtons';
import { useOnboardingForm, goalSchema } from '@/hooks/useOnboardingForm';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { TrendingDown, TrendingUp, Minus, Zap } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboarding';   

const NEXT_PATH = '/onboarding/step-3-activity';
const PREV_PATH = '/onboarding/step-1-biometrics';

const GOAL_OPTIONS = [
  { value: 'LOSE', label: 'Perder Grasa', icon: TrendingDown, color: 'text-orange-400' },
  { value: 'GAIN', label: 'Ganar Músculo', icon: TrendingUp, color: 'text-blue-400' },
  { value: 'MAINTAIN', label: 'Mantener', icon: Minus, color: 'text-slate-400' },
  { value: 'RECOMP', label: 'Recomposición', icon: Zap, color: 'text-purple-400' },
];

export default function Step2GoalPage() {
  const router = useRouter();

  const { setGoal } = useOnboardingStore();   

  const {
    register,
    handleSubmitStore,
    formState: { errors, isSubmitting },
    watch,
  } = useOnboardingForm(2, goalSchema, (formData) => {
    // ✅ Callback corregido para guardar el objetivo en Zustand
    setGoal({
      goalType: formData.goalType,
      targetWeight: formData.targetWeight,
      goalSpeed: formData.goalSpeed,
    });
    router.push(NEXT_PATH);
  });

  const goalType = watch('goalType');
  const targetWeight = watch('targetWeight');

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-slate-800 bg-slate-900">
          <StepHeader
            currentStep={2}
            totalSteps={6}
            title="Tu Objetivo"
            description="¿Qué quieres lograr con Sporvit?"
          />
          
          <CardContent>
            <form onSubmit={handleSubmitStore} className="space-y-6">
              {/* Tipo de Objetivo */}
              <div>
                <Label className="mb-4 block text-lg">Objetivo Principal</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {GOAL_OPTIONS.map(option => {
                    const Icon = option.icon;
                    return (
                      <Label
                        key={option.value}
                        htmlFor={option.value}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                          goalType === option.value
                            ? 'border-emerald-500 bg-emerald-500/10 shadow-lg'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }`}
                      >
                        <input
                          type="radio"
                          id={option.value}
                          value={option.value}
                          {...register('goalType')}
                          className="sr-only"
                        />
                        <div className={`p-3 rounded-xl bg-slate-900 ${goalType === option.value ? 'bg-emerald-500/20' : ''}`}>
                          <Icon className={`w-6 h-6 ${option.color}`} />
                        </div>
                        <span className="text-lg font-semibold text-white">{option.label}</span>
                      </Label>
                    );
                  })}
                </div>
                {errors.goalType && (
                  <p className="text-red-500 text-xs mt-2">{errors.goalType.message?.toString()}</p>
                )}
              </div>

              {/* Peso Objetivo (solo si LOSE o GAIN) */}
              {(goalType === 'LOSE' || goalType === 'GAIN') && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Label htmlFor="targetWeight">Peso Objetivo (kg)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    step="0.1"
                    placeholder="65.0"
                    {...register('targetWeight', { valueAsNumber: true })}
                    className="mt-2"
                  />
                  {errors.targetWeight && (
                    <p className="text-red-500 text-xs mt-1">{errors.targetWeight.message?.toString()}</p>
                  )}
                </div>
              )}

              {/* Velocidad (solo si no es MAINTAIN) */}
              {goalType && goalType !== 'MAINTAIN' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Label className="mb-3 block">¿Qué tan rápido quieres progresar?</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'SLOW', label: 'Lento' },
                      { id: 'MODERATE', label: 'Moderado' },
                      { id: 'AGGRESSIVE', label: 'Agresivo' },
                    ].map(speed => (
                      <Label
                        key={speed.id}
                        htmlFor={speed.id}
                        className={`p-4 text-center rounded-xl text-sm font-medium cursor-pointer transition-all ${
                          watch('goalSpeed') === speed.id
                            ? 'bg-emerald-500 text-white shadow-lg'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          id={speed.id}
                          value={speed.id}
                          {...register('goalSpeed')}
                          className="sr-only"
                        />
                        {speed.label}
                      </Label>
                    ))}
                  </div>
                  {errors.goalSpeed && (
                    <p className="text-red-500 text-xs mt-2">{errors.goalSpeed.message?.toString()}</p>
                  )}
                </div>
              )}

              <StepButtons
                currentStep={2}
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
