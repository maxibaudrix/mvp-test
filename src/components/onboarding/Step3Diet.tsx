// src/components/onboarding/Step3Diet.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { DietSchema } from '@/lib/validations/onboarding';
import { useOnboardingStore } from '@/store/onboarding';
import { useUserStore } from '@/store/user';
// Importamos la función de cálculo, aunque la implementación puede ser dummy para el MVP
import { calculateMacros } from '@/lib/calculations/macros'; 

type DietFormData = {
  dietaryPreference: 'OMNIVORE' | 'VEGETARIAN' | 'VEGAN';
  macroSplit: 'BALANCED' | 'HIGH_PROTEIN' | 'LOW_CARB';
  restrictions: string;
};

const dietOptions = [
    { value: 'OMNIVORE', label: 'Omnívoro (Todo tipo de alimentos)' },
    { value: 'VEGETARIAN', label: 'Vegetariano (Sin carne, sí lácteos/huevos)' },
    { value: 'VEGAN', label: 'Vegano (Solo vegetales)' },
];

const macroOptions = [
    { value: 'BALANCED', label: 'Balanceado (Clásico 40C/30P/30F)' },
    { value: 'HIGH_PROTEIN', label: 'Alto en Proteínas (Para músculo/saciedad)' },
    { value: 'LOW_CARB', label: 'Bajo en Carbohidratos (Keto/Low Carb)' },
];


const Step3Diet: React.FC = () => {
  const router = useRouter();
  const setDiet = useOnboardingStore((state) => state.setDiet);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  const onboardingData = useOnboardingStore((state) => state.data);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DietFormData>({
    resolver: zodResolver(DietSchema),
    defaultValues: {
      dietaryPreference: onboardingData.dietaryPreference || 'OMNIVORE',
      macroSplit: onboardingData.macroSplit || 'BALANCED',
      restrictions: onboardingData.restrictions || '',
    },
  });

  const onSubmit = (data: DietFormData) => {
    // 1. Guardar preferencias de dieta en Zustand
    setDiet({ 
        dietaryPreference: data.dietaryPreference,
        macroSplit: data.macroSplit,
        restrictions: data.restrictions,
    });
    
    // 2. SIMULAR CÁLCULOS FINALES y transición a Dashboard
    
    // Suponemos que TDEE ya fue calculado en el paso anterior o en el backend
    const tdee = 2500; // Valor dummy o llamado a calculateTDEE(...)
    // Usamos el split de macros guardado en el store
    const macros = calculateMacros(tdee, data.macroSplit);

    // 3. Marcar Onboarding como completado y actualizar perfil de usuario
    completeOnboarding({ 
        // Datos de Perfil (Profile)
        tdee: tdee,
        targetCalories: macros.calories,
        targetMacros: {
            protein: macros.protein,
            carbs: macros.carbs,
            fat: macros.fat,
        },
        // Preferencias (Preferences)
        dietaryPreference: data.dietaryPreference,
        macroSplit: data.macroSplit,
        restrictions: data.restrictions,
        activityLevel: onboardingData.activityLevel,
        goal: onboardingData.goal,
    });

    // 4. Navegar al Dashboard
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Preferencia Dietética</label>
        <select 
          {...register('dietaryPreference')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        >
          {dietOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.dietaryPreference && <p className="text-red-500 text-xs mt-1">{errors.dietaryPreference.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Distribución de Macros (Proteína, Carb, Grasa)</label>
        <select 
          {...register('macroSplit')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        >
          {macroOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.macroSplit && <p className="text-red-500 text-xs mt-1">{errors.macroSplit.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Restricciones/Alergias (Opcional)</label>
        <textarea 
          {...register('restrictions')} 
          rows={3}
          placeholder="Ej: Alergia a frutos secos, intolerancia al gluten."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
        {errors.restrictions && <p className="text-red-500 text-xs mt-1">{errors.restrictions.message}</p>}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
          {isSubmitting ? 'Finalizando...' : 'Finalizar Onboarding'}
        </Button>
      </div>
    </form>
  );
};

export default Step3Diet;