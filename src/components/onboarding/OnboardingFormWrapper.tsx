// src/components/onboarding/OnboardingFormWrapper.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/Progress'; 
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/store/onboarding';

interface OnboardingFormWrapperProps {
  children: React.ReactNode;
  title: string;
  step: number;
}

const STEPS = [
  '/onboarding/step-1-biometrics', 
  '/onboarding/step-2-goal', 
  '/onboarding/step-3-diet'
];

const OnboardingFormWrapper: React.FC<OnboardingFormWrapperProps> = ({ children, title, step }) => {
  const router = useRouter();
  const totalSteps = STEPS.length;
  const progress = (step / totalSteps) * 100;

  // Usa Zustand para simular el paso, aunque el ruteo real es lo que manda aquí
  const { prevStep } = useOnboardingStore(); 

  const handlePrev = () => {
    if (step > 1) {
      prevStep();
      router.push(STEPS[step - 2]);
    } else {
      router.push('/login'); // Volver a login si es el primer paso
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white shadow-2xl rounded-xl">
        <h1 className="text-3xl font-extrabold text-blue-600 text-center">{title}</h1>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600 text-center">Paso {step} de {totalSteps}</p>
          <Progress value={progress} className="h-2" />
        </div>
        
        {children}

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={step === 0} // Nunca debe ser 0, pero por seguridad
          >
            {step === 1 ? 'Cancelar' : 'Anterior'}
          </Button>
          {/* El botón "Siguiente" debe estar dentro del componente de paso para manejar la validación y submit */}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFormWrapper;