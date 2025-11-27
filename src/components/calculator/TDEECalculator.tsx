
// src/components/calculator/TDEECalculator.tsx
// Componente de demostración o visualización de cálculo de TDEE

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useOnboardingStore } from '@/store/onboarding';
import { calculateTDEE } from '@/lib/calculations'; // Asumimos esta función existe en Fase 5

export const TDEECalculator = () => {
    const { data } = useOnboardingStore();
    
    if (!data.heightCm || !data.weightKg || !data.activityLevel) {
        return <p className="text-slate-400">Faltan datos para calcular TDEE.</p>;
    }

    const tdeeResult = calculateTDEE({
        gender: data.gender,
        age: data.age, // Asumimos 'age' es calculado en el store o lib/calculations
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        activityLevel: data.activityLevel,
    });
    
    return (
        <Card className="shadow-lg border-blue-600/50">
            <CardHeader>
                <CardTitle className="text-xl">Gasto Calórico Diario Total (TDEE)</CardTitle>
                <CardDescription>Esta es la energía que quemas diariamente.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-5xl font-extrabold text-blue-400">
                        {Math.round(tdeeResult.tdee)}
                    </p>
                    <p className="text-lg text-slate-300">Calorías / día</p>
                </div>
                <div className="mt-4 text-sm text-slate-400">
                    <p>• Tasa Metabólica Basal (BMR): {Math.round(tdeeResult.bmr)} kcal</p>
                    <p>• Nivel de Actividad: {data.activityLevel}</p>
                </div>
            </CardContent>
        </Card>
    );
};
        