
// src/components/calculator/MacrosCalculator.tsx
// Componente de demostración o visualización de cálculo de Macronutrientes

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useOnboardingStore } from '@/store/onboarding';
// 1. CORRECCIÓN: Debes importar las funciones de cálculo. 
// Asumiré que están en una carpeta de utilidades. Si no las tienes, ver abajo.
import { calculateGoalCalories, calculateMaintenanceMacros } from '@/lib/calculations'; 

// 2. CORRECCIÓN: Definir interfaz para las props del sub-componente
interface MacroItemProps {
    label: string;
    grams: number;
    percentage: number;
}

export const MacrosCalculator = () => {
    const { data } = useOnboardingStore();
    
    // Nota: Asegúrate de que 'weeklyTarget' exista en tu store (ver paso extra abajo)
    if (!data.goal || !data.weightKg || !data.heightCm) {
        return <p className="text-slate-400">Faltan datos para calcular los macros.</p>;
    }

    // Nota: Añadí validación para evitar errores si las funciones retornan null o undefined
    const goalCalories = calculateGoalCalories({
        tdee: 2000, 
        goal: data.goal,
        weeklyTarget: data.weeklyTarget || 0, // Fallback si es undefined
    });
    
    const macros = calculateMaintenanceMacros({
        calories: goalCalories.targetCalories,
        dietType: data.dietType || 'balanced', // Fallback por defecto
    });

    // 3. CORRECCIÓN: Añadir el tipo a las props (: MacroItemProps)
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
                    <p className="text-3xl font-extrabold text-green-400">{Math.round(goalCalories.targetCalories)}</p>
                    <p className="text-lg text-slate-300">kcal</p>
                </div>
                
                <MacroItem label="Proteínas" grams={macros.proteinGrams} percentage={macros.proteinPercentage} />
                <MacroItem label="Carbohidratos" grams={macros.carbGrams} percentage={macros.carbPercentage} />
                <MacroItem label="Grasas" grams={macros.fatGrams} percentage={macros.fatPercentage} />
            </CardContent>
        </Card>
    );
};