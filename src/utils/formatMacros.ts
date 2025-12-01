// src/utils/formatMacros.ts

/**
 * Formatea un valor numérico de macronutriente (ej: 50.5g)
 * @param value - Valor numérico del macronutriente en gramos.
 * @param decimals - Número de decimales a mostrar.
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
    // FIX: Usar Intl.NumberFormat para formatear el número con localización y decimales fijos.
    const formatted = new Intl.NumberFormat('es-ES', { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
    }).format(value);

    return formatted;
};