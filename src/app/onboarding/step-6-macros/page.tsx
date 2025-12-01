// src/app/onboarding/step-6-summary/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/store/onboarding';
import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, Calculator, Flame, Apple } from 'lucide-react';

const PREV_PATH = '/onboarding/step-5-diet';

export default function Step6SummaryPage() {
  const router = useRouter();
  const { data } = useOnboardingStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [calculatedMacros, setCalculatedMacros] = useState<{
    bmr: number;
    tdee: number;
    targetCalories: number;
    protein: number;
    carbs: number;
    fats: number;
  } | null>(null);

  // Calcular macros al cargar la página
  useEffect(() => {
    if (data.biometrics && data.lifestyle) {
      const macros = calculateMacros();
      setCalculatedMacros(macros);
    }
  }, [data]);

  // Función simplificada de cálculo (replica lógica de tu flujo de onboarding)
  const calculateMacros = () => {
    const { age, gender, height, weight } = data.biometrics!;
    const { activityLevel, goal, weeklyTarget } = data.lifestyle!;

    // BMR (Mifflin-St Jeor)
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr += gender === 'MALE' ? 5 : -161;

    // PAL (Physical Activity Level)
    const palValues: Record<string, number> = {
      SEDENTARY: 1.2,
      LIGHTLY_ACTIVE: 1.375,
      MODERATELY_ACTIVE: 1.55,
      VERY_ACTIVE: 1.725,
      EXTREMELY_ACTIVE: 1.9,
    };
    const tdee = Math.round(bmr * palValues[activityLevel]);

    // Ajuste calórico según objetivo
    let targetCalories = tdee;
    if (goal === 'LOSE' && weeklyTarget) {
      targetCalories = tdee - (weeklyTarget * 7700 / 7); // Déficit
    } else if (goal === 'GAIN' && weeklyTarget) {
      targetCalories = tdee + (weeklyTarget * 7700 / 7); // Superávit
    }

    // Macros (Simplificado)
    const protein = Math.round(weight * 2.0); // 2g/kg
    const fats = Math.round((targetCalories * 0.25) / 9); // 25% calorías
    const remainingCals = targetCalories - (protein * 4) - (fats * 9);
    const carbs = Math.round(remainingCals / 4);

    return {
      bmr: Math.round(bmr),
      tdee,
      targetCalories: Math.round(targetCalories),
      protein,
      carbs: Math.max(0, carbs),
      fats,
    };
  };

  // Función para finalizar onboarding
  const handleFinalize = async () => {
    if (!calculatedMacros) {
      setSaveError('No se pudieron calcular los macros. Revisa tus datos.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Payload completo para la API
      const payload = {
        // Biometrics
        age: data.biometrics?.age,
        gender: data.biometrics?.gender,
        height: data.biometrics?.height,
        weight: data.biometrics?.weight,
        bodyFatPercentage: data.biometrics?.bodyFatPercentage,

        // Goal
        goalType: data.lifestyle?.goal,
        targetWeight: data.goal?.targetWeight,
        weeklyTarget: data.lifestyle?.weeklyTarget,

        // Lifestyle
        activityLevel: data.lifestyle?.activityLevel,

        // Diet
        dietType: data.diet?.dietType,
        allergies: data.diet?.allergies || [],
        excludedIngredients: data.diet?.excludedIngredients || [],

        // Calculated Macros
        bmr: calculatedMacros.bmr,
        tdee: calculatedMacros.tdee,
        targetCalories: calculatedMacros.targetCalories,
        targetProteinG: calculatedMacros.protein,
        targetCarbsG: calculatedMacros.carbs,
        targetFatG: calculatedMacros.fats,
      };

      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Error al guardar el perfil');
      }

      // Éxito - Redirigir al dashboard
      router.push('/dashboard');
    } catch (error: any) {
      setSaveError(error.message || 'Error desconocido al finalizar');
      console.error('Error al finalizar onboarding:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!calculatedMacros) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-3xl">
        <Card className="shadow-2xl border-slate-800 bg-slate-900">
          <StepHeader
            currentStep={6}
            totalSteps={6}
            title="Tu Plan Nutricional"
            description="Revisa tus macros calculados y finaliza tu perfil"
          />
          
          <CardContent className="space-y-6">
            {/* Cálculos Resumen */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* BMR */}
              <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">BMR</p>
                    <p className="text-2xl font-bold text-white">{calculatedMacros.bmr}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Metabolismo basal</p>
              </div>

              {/* TDEE */}
              <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">TDEE</p>
                    <p className="text-2xl font-bold text-white">{calculatedMacros.tdee}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Gasto diario total</p>
              </div>

              {/* Target Calories */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-2 border-emerald-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Apple className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-300">Objetivo</p>
                    <p className="text-2xl font-bold text-white">{calculatedMacros.targetCalories}</p>
                  </div>
                </div>
                <p className="text-xs text-emerald-200/70">Calorías diarias</p>
              </div>
            </div>

            {/* Macros Breakdown */}
            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Distribución de Macronutrientes</h3>
              
              <div className="space-y-4">
                {/* Proteína */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-medium">Proteína</span>
                    <span className="text-white font-bold">{calculatedMacros.protein}g</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '33%' }} />
                  </div>
                </div>

                {/* Carbohidratos */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-medium">Carbohidratos</span>
                    <span className="text-white font-bold">{calculatedMacros.carbs}g</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: '45%' }} />
                  </div>
                </div>

                {/* Grasas */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-medium">Grasas</span>
                    <span className="text-white font-bold">{calculatedMacros.fats}g</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: '22%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Preferencias */}
            <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-xl">
              <h4 className="text-sm font-bold text-white mb-3">Tus Preferencias</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Objetivo:</span>
                  <span className="text-white font-medium ml-2">
                    {data.lifestyle?.goal === 'LOSE' ? 'Perder Peso' : 
                     data.lifestyle?.goal === 'GAIN' ? 'Ganar Músculo' : 'Mantener'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Dieta:</span>
                  <span className="text-white font-medium ml-2">
                    {data.diet?.dietType || 'Omnívora'}
                  </span>
                </div>
                {data.diet?.allergies && data.diet.allergies.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-slate-400">Alergias:</span>
                    <span className="text-red-400 font-medium ml-2">
                      {data.diet.allergies.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {saveError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-300">Error al Guardar</p>
                  <p className="text-xs text-red-400 mt-1">{saveError}</p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => router.push(PREV_PATH)}
              disabled={isSaving}
            >
              ← Volver
            </Button>

            <Button
              onClick={handleFinalize}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Finalizar y Empezar
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}