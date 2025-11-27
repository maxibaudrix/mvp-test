// src/lib/calculations/macros.ts

/**
 * Calcula la distribución de macronutrientes (en gramos) basada en el TDEE y el objetivo.
 * @param tdee - Gasto Energético Diario Total.
 * @param goal - Objetivo: LOSE_WEIGHT, MAINTAIN, GAIN_MUSCLE.
 * @returns { protein, fat, carbs } en gramos.
 */
export const calculateMacros = (tdee: number, goal: 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE'): { protein: number; fat: number; carbs: number } => {
    let caloriesTarget = tdee;

    // Ajuste de calorías por objetivo
    if (goal === 'LOSE_WEIGHT') {
        caloriesTarget -= 500;
    } else if (goal === 'GAIN_MUSCLE') {
        caloriesTarget += 300;
    }
    
    // Asegurar que las calorías objetivo no caigan por debajo de un mínimo seguro (ej. 1200 kcal)
    caloriesTarget = Math.max(1200, caloriesTarget);

    // Ratios de Macronutrientes (Calorías)
    let proteinRatio = 0.25; // 25%
    let fatRatio = 0.30;     // 30%
    let carbsRatio = 0.45;   // 45%

    if (goal === 'GAIN_MUSCLE') {
        proteinRatio = 0.35; 
        carbsRatio = 0.35; // Ajustar para que sumen 1.00 (0.35 + 0.30 + 0.35)
    }

    // Calorías por macronutriente
    const proteinCal = caloriesTarget * proteinRatio;
    const fatCal = caloriesTarget * fatRatio;
    const carbsCal = caloriesTarget * carbsRatio;

    // Conversión a gramos (Proteínas/Carbs: 4 kcal/g, Grasas: 9 kcal/g, se redondea)
    return {
        protein: Math.round(proteinCal / 4),
        fat: Math.round(fatCal / 9),
        carbs: Math.round(carbsCal / 4),
    };
};