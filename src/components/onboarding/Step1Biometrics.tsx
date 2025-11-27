// src/components/onboarding/Step1Biometrics.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Asumiendo la importación de tipos y esquemas
import { BiometricsSchema } from '@/lib/validations/onboarding';
import { useOnboardingStore } from '@/store/onboarding';

// Define el tipo del formulario inferido desde Zod (requiere instalar @hookform/resolvers)
type BiometricsFormData = {
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  heightCm: number;
  weightKg: number;
};

const Step1Biometrics: React.FC = () => {
  const router = useRouter();
  const setBiometrics = useOnboardingStore((state) => state.setBiometrics);
  const onboardingData = useOnboardingStore((state) => state.data);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BiometricsFormData>({
    resolver: zodResolver(BiometricsSchema),
    defaultValues: {
      gender: onboardingData.gender || 'MALE',
      dateOfBirth: onboardingData.dateOfBirth || '1990-01-01',
      heightCm: onboardingData.heightCm || 170,
      weightKg: onboardingData.weightKg || 70,
    },
  });

  const onSubmit = (data: BiometricsFormData) => {
    // 1. Guardar datos en Zustand
    setBiometrics({ 
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
    });
    
    // 2. Navegar al siguiente paso
    router.push('/onboarding/step-2-goal');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Género</label>
        <select 
          {...register('gender')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        >
          <option value="MALE">Masculino</option>
          <option value="FEMALE">Femenino</option>
          <option value="OTHER">Otro</option>
        </select>
        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
        <input 
          type="date" 
          {...register('dateOfBirth')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
        {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
        <input 
          type="number" 
          {...register('heightCm', { valueAsNumber: true })} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
        {errors.heightCm && <p className="text-red-500 text-xs mt-1">{errors.heightCm.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Peso Actual (kg)</label>
        <input 
          type="number" 
          step="0.1" 
          {...register('weightKg', { valueAsNumber: true })} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
        {errors.weightKg && <p className="text-red-500 text-xs mt-1">{errors.weightKg.message}</p>}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Siguiente'}
        </Button>
      </div>
    </form>
  );
};

export default Step1Biometrics;