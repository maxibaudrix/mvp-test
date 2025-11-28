// src/components/calculator/MacrosCalculator.tsx

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useOnboardingStore } from '@/store/onboarding';
import { calculateTDEE } from '@/lib/calculations/tdee';
import { calculateMacros } from '@/lib/calculations/macros';
import type { OnboardingData } from '@/types/onboarding';

// Mapeo perfecto de tus valores del formulario → valores que espera calculateTDEE
const ACTIVITY_LEVEL_MAP = {
  sedentary: 'SEDENTARY',
  light: 'LIGHTLY_ACTIVE',
  moderate: 'MODERATELY_ACTIVE',
  very_active: 'VERY_ACTIVE',
  extra_active: 'EXTREMELY_ACTIVE',
} as const;

interface MacroItemProps {
  label: string;
  grams: number;
  percentage: number;
}

const MacroItem = ({ label, grams, percentage }: MacroItemProps) => (
  <div className="p-3 rounded-xl bg-slate-800 flex justify-between items-center">
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-slate-400">{percentage}% del total</p>
    </div>
    <p className="text-xl font-bold text-blue-300">{Math.round(grams)}g</p>
  </div>
);

export const MacrosCalculator = () => {
  const { data } = useOnboardingStore();
  const fullData = data as OnboardingData;

  // Validación completa
  if (
    !fullData?.goal ||
    fullData.weeklyGoalKg === undefined ||
    !fullData.heightCm ||
    !fullData.weightKg ||
    !fullData.age ||
    !fullData.gender ||
    !fullData.activityLevel ||
    !fullData.dateOfBirth
  ) {
    return <p className="text-slate-400">Faltan datos para calcular los macros.</p>;
  }

  // Normalización del activityLevel
  const normalizedActivityLevel = ACTIVITY_LEVEL_MAP[fullData.activityLevel];
  
  // Fallback seguro (nunca debería pasar)
  const safeActivityLevel = normalizedActivityLevel || 'SEDENTARY';

  // Normalización del goal
  const goalMap: Record<string, 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE'> = {
    lose_weight: 'LOSE_WEIGHT',
    maintain: 'MAINTAIN',
    gain_muscle: 'GAIN_MUSCLE',
  };
  const safeGoal = goalMap[fullData.goal] || 'MAINTAIN';

  // Cálculo del TDEE con datos normalizados
  const tdee = calculateTDEE({
    ...fullData,
    activityLevel: safeActivityLevel,
  });

  // Macros
  const macros = calculateMacros(tdee, safeGoal, fullData.weeklyGoalKg);
  const targetCalories = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;

  const goalText =
    safeGoal === 'LOSE_WEIGHT' ? 'pérdida de grasa' :
    safeGoal === 'GAIN_MUSCLE' ? 'ganancia muscular' :
    'mantenimiento';

  return (
    <Card className="shadow-lg border-green-600/50">
      <CardHeader>
        <CardTitle className="text-xl">Objetivo de Macronutrientes</CardTitle>
        <CardDescription>
          Distribución óptima para {goalText} • {Math.abs(fullData.weeklyGoalKg)} kg/semana
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-4 p-4 bg-slate-800 rounded-xl">
          <span className="text-lg font-semibold text-slate-300">Meta calórica diaria:</span>
          <span className="text-4xl font-extrabold text-green-400">
            {Math.round(targetCalories)}
          </span>
          <span className="text-lg text-slate-300">kcal</span>
        </div>

        <div className="space-y-3">
          <MacroItem
            label="Proteínas"
            grams={macros.protein}
            percentage={Math.round((macros.protein * 4 / targetCalories) * 100)}
          />
          <MacroItem
            label="Carbohidratos"
            grams={macros.carbs}
            percentage={Math.round((macros.carbs * 4 / targetCalories) * 100)}
          />
          <MacroItem
            label="Grasas"
            grams={macros.fat}
            percentage={Math.round((macros.fat * 9 / targetCalories) * 100)}
          />
        </div>
      </CardContent>
    </Card>
  );
};