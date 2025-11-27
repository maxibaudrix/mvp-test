// src/app/page.tsx
'use client';

import { useUserStore } from '@/store/user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AppShell from '@/components/shared/layout/AppShell';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { user, hasCompletedOnboarding } = useUserStore();
  const router = useRouter();

  // Redirección inicial (simulación de flujo de autenticación)
  useEffect(() => {
    // Si hay un usuario (simulado) y no ha completado el onboarding, redirigir
    if (user && !hasCompletedOnboarding) {
      router.push('/onboarding/step-1-biometrics');
    }
    // Nota: La lógica real de auth y user loading se haría en el Layout.
  }, [user, hasCompletedOnboarding, router]);

  // Si el usuario existe y completó el onboarding, mostrar el Dashboard.
  if (user && hasCompletedOnboarding) {
    return (
      <AppShell title="Dashboard">
        <div className="p-4 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">¡Bienvenido de vuelta, {user.name || 'Usuario'}!</h1>
          <p className="text-gray-600">Tu TDEE es de {user.goals?.tdee} kcal. Hora de revisar tu plan.</p>
          <div className="mt-8">
             {/* Aquí irían las métricas del dashboard */}
             <Button>Ver Plan Nutricional</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  // Si no hay usuario (o está cargando), mostrar Landing Page.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-4">Sporvit MVP</h1>
      <p className="text-xl text-gray-600 mb-8">Nutrición inteligente, resultados reales.</p>
      <div className="space-x-4">
        <Button onClick={() => router.push('/login')} size="lg" className="bg-blue-600 hover:bg-blue-700">
          Iniciar Sesión
        </Button>
      </div>
    </main>
  );
}