
// src/app/onboarding/step-6-macros/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import { Button } from '@/components/ui/button';
import IMCCalculator from '@/components/calculator/IMCCalculator';
import { TDEECalculator } from '@/components/calculator/TDEECalculator';
import { MacrosCalculator } from '@/components/calculator/MacrosCalculator';
import { useOnboardingStore } from '@/store/onboarding';
import { useState } from 'react';
import { Save } from 'lucide-react';

const PREV_PATH = '/onboarding/step-5-diet';

export default function Step6MacrosPage() {
  const router = useRouter();
  const { data } = useOnboardingStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Función para guardar el perfil en la API
  const handleFinalize = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el perfil en el servidor.');
      }

      // Redirigir al dashboard o página principal
      router.push('/dashboard'); 

    } catch (error: any) {
      setSaveError(error.message || 'Ocurrió un error desconocido al finalizar.');
      console.error('Error al finalizar el Onboarding:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-2xl">
      <StepHeader
        currentStep={6}
        totalSteps={6}
        title="Tu Plan Nutricional Base"
        description="Revisa tus cálculos, si estás de acuerdo, presiona 'Finalizar'."
      />
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IMCCalculator />
          <TDEECalculator />
        </div>
        <MacrosCalculator />
        
        {saveError && (
          <div className="p-3 bg-red-800/20 border border-red-500/50 rounded-lg text-red-300">
            Error: {saveError}
          </div>
        )}

      </CardContent>
      <CardFooter className="pt-6 justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.push(PREV_PATH)} 
          type="button" 
          disabled={isSaving}
        >
          &larr; Volver a Dieta
        </Button>
        <Button
          onClick={handleFinalize}
          isLoading={isSaving}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700"
        >
            <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Guardando Perfil...' : 'Finalizar Onboarding'}
        </Button>
      </CardFooter>
    </Card>
  );
}
        