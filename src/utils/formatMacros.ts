// src/utils/formatMacros.ts

/**
 * Formatea un valor numérico de macronutriente (ej: 50.5g)
 * @param value - Valor numérico del macronutriente en gramos.
 * @param decimals - Número de decimales a mostrar.
 */
export const formatMacros = (value: number, decimals: number = 0): string => {
    // Usar toFixed para controlar decimales, luego toLocaleString para formato de miles
    const formatted = value.toFixed(decimals).toLocaleString('es-ES');
    return `${formatted}g`;
};