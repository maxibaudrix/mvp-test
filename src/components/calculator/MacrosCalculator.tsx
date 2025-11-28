// src/components/calculator/MacrosCalculator.tsx
// Componente de demostración o visualización de cálculo de Macronutrientes

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useOnboardingStore } from '@/store/onboarding';
// 1. CORRECCIÓN: Importar solo la función consolidada `calculateMacros` y la necesaria `calculateTDEE`.
import { calculateMacros, calculateTDEE, calculateBMR } from '@/lib/calculations'; 
// También necesitamos los tipos de GoalData (que contienen el weeklyGoalKg)
import { GoalData } from '@/types/onboarding'; 

// Definición de Props para el sub-componente MacroItem (Para evitar errores de 'any')
interface MacroItemProps {
    label: string;
    grams: number;
    percentage: number;
}

export const MacrosCalculator = () => {
    const { data } = useOnboardingStore();
    
    // 2. CORRECCIÓN: Usar 'weeklyGoalKg' y 'weightKg'
    if (!data.goal || !data.weeklyGoalKg || !data.heightCm || !data.weightKg || !data.age || !data.gender || !data.activityLevel) {
        return <p className="text-slate-400">Faltan datos para calcular los macros.</p>;
    }
    
    // --- PASO 1: CALCULAR TDEE ---
    // NOTA: Asumimos que calculateBMR y calculateTDEE están disponibles e implementadas.
    
    const bmr = calculateBMR(
        data.weightKg, 
        data.heightCm, 
        data.age, 
        data.gender, 
        'mifflin-st-jeor' // O la fórmula que desees
    );

    const tdee = calculateTDEE(bmr, data.activityLevel);

    // --- PASO 2: CALCULAR MACROS OBJETIVO CON EL TDEE Y EL OBJETIVO SEMANAL ---
    // Usamos la función consolidada `calculateMacros` y pasamos `tdee` y `weeklyGoalKg`.
    
    // Convertimos 'data.goal' a un tipo conocido (aunque TypeScript debería inferir GoalData)
    const goalData = data as GoalData; 

    const macros = calculateMacros(
        tdee, 
        goalData.goal, 
        goalData.weeklyGoalKg 
    );
    
    // La meta calórica ya está calculada internamente en calculateMacros, pero
    // necesitamos extraer el valor para la visualización. Usaremos el TDEE ajustado.
    // Para simplificar, obtenemos la meta calórica ajustada sumando los gramos * kcal
    const targetCalories = (macros.protein * 4) + (macros.carbs * 4) + (macros.fat * 9);


    const MacroItem = ({ label, grams, percentage }: MacroItemProps) => (
        <div className="p-3 rounded-xl bg-slate-800 flex justify-between items-center">
            <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-slate-400">{percentage}% del total</p>
            </div>
            <p className="text-xl font-bold text-blue-300">{Math.round(grams)}g</p>
        </div>
    );

    return (
        <Card className="shadow-lg border-green-600/50">
            <CardHeader>
                <CardTitle className="text-xl">Objetivo de Macronutrientes</CardTitle>
                <CardDescription>Distribución para alcanzar tu meta de {data.goal.toLowerCase()}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="mb-4 flex items-center justify-center space-x-4 p-3 bg-slate-800 rounded-xl">
                    <p className="text-lg font-semibold text-slate-300">Meta Calórica:</p>
                    <p className="text-3xl font-extrabold text-green-400">{Math.round(targetCalories)}</p>
                    <p className="text-lg text-slate-300">kcal</p>
                </div>
                
                <MacroItem label="Proteínas" grams={macros.protein} percentage={Math.round((macros.protein * 4 / targetCalories) * 100)} />
                <MacroItem label="Carbohidratos" grams={macros.carbs} percentage={Math.round((macros.carbs * 4 / targetCalories) * 100)} />
                <MacroItem label="Grasas" grams={macros.fat} percentage={Math.round((macros.fat * 9 / targetCalories) * 100)} />
            </CardContent>
        </Card>
    );
};