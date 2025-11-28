// src/app/onboarding/step-5-diet/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import StepButtons from '@/components/onboarding/StepButtons';
// Asegúrate de que useOnboardingForm exporte el tipo DietFormValues si cambiaste el esquema
import { useOnboardingForm, dietSchema } from '@/hooks/useOnboardingForm'; 
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea'; 
import { useOnboardingStore } from '@/store/onboarding';
import { DietData } from '@/types/onboarding'; // Importar DietData

const NEXT_PATH = '/onboarding/step-6-macros';
const PREV_PATH = '/onboarding/step-4-training-level';
const CURRENT_STEP = 5; // Constante para el paso actual

const DietOptions = [
    { value: 'NONE', label: 'Ninguna' },
    { value: 'VEGETARIAN', label: 'Vegetariana' },
    { value: 'VEGAN', label: 'Vegana' },
    { value: 'PALEO', label: 'Paleo' },
    { value: 'KETO', label: 'Keto (Ceto)' },
];

// Helper para convertir la cadena separada por comas a un array limpio
const stringToArray = (str: string | undefined): string[] => {
    if (!str || str.trim() === '') {
        return [];
    }
    // Divide por coma, limpia espacios y filtra entradas vacías
    return str.split(',').map(s => s.trim()).filter(s => s.length > 0);
};

export default function Step5DietPage() {
  const router = useRouter();
  const { setDiet, calculateAndSaveMacros } = useOnboardingStore();

  const {
    register,
    handleSubmitStore,
    formState: { errors, isSubmitting },
    watch,
  } = useOnboardingForm(CURRENT_STEP, dietSchema, async (formData) => {

    // 1. Mapeo y transformación de tipos para que coincida con DietData
    const dietDataForStore: DietData = {
        // El tipo de dieta es un string, lo dejamos pasar.
        dietType: formData.dietType, 
        // Mapear 'allergens' a 'allergies' y convertir la cadena a string[]
        allergies: stringToArray(formData.allergens), 
        // Mapear 'restrictions' a 'excludedIngredients' y convertir la cadena a string[]
        excludedIngredients: stringToArray(formData.restrictions), 
    };

    // Primero guardamos los datos de la dieta (ya con el tipo DietData correcto)
    setDiet(dietDataForStore);
    
    // Luego calculamos y guardamos las macros (usa los datos del store)
    await calculateAndSaveMacros();
    
    // Finalmente navegamos a la siguiente página
    router.push(NEXT_PATH);
  });
  
  const dietType = watch('dietType');


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-lg shadow-xl">
                <StepHeader 
                    // FIX: Cambiado 'step' por 'currentStep'
                    currentStep={CURRENT_STEP} 
                    title="Preferencias Dietéticas" 
                    description="Personaliza tu plan indicando tu tipo de dieta y restricciones." 
                />
                <CardContent>
                    <form onSubmit={handleSubmitStore} className="space-y-6">
                        {/* Campo de Tipo de Dieta */}
                        <div>
                            <Label htmlFor="dietType" className="mb-2 block">Tipo de Dieta</Label>
                            <select
                                id="dietType"
                                {...register('dietType')}
                                className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                {DietOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.dietType && <p className="text-red-500 text-sm mt-1">{errors.dietType.message}</p>}
                        </div>

                        {/* Campo de Alérgenos */}
                        <div>
                            <Label htmlFor="allergens" className="mb-2 block">Alérgenos (Separados por coma)</Label>
                            <Textarea
                                id="allergens"
                                {...register('allergens')}
                                placeholder="Ej: gluten, nueces, lactosa"
                                className="w-full p-3 border rounded-lg"
                            />
                            {errors.allergens && <p className="text-red-500 text-sm mt-1">{errors.allergens.message}</p>}
                        </div>

                        {/* Campo de Restricciones */}
                        <div>
                            <Label htmlFor="restrictions" className="mb-2 block">Ingredientes Excluidos / Restricciones (Separados por coma)</Label>
                            <Textarea
                                id="restrictions"
                                {...register('restrictions')}
                                placeholder="Ej: carne roja, azúcar refinada, cebolla"
                                className="w-full p-3 border rounded-lg"
                            />
                            {errors.restrictions && <p className="text-red-500 text-sm mt-1">{errors.restrictions.message}</p>}
                        </div>

                        <StepButtons 
                            prevPath={PREV_PATH} 
                            isSubmitting={isSubmitting} 
                            // FIX: Añadidas las propiedades requeridas por StepButtons
                            currentStep={CURRENT_STEP}
                            nextPath={NEXT_PATH}
                            onNext={() => {}} // Se pasa una función vacía, ya que el formulario maneja el submit
                            isLastStep={false} // El paso 6 es el siguiente, por lo tanto, no es el último.
                        />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}