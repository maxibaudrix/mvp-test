// src/app/(auth)/login/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function LoginPage() {
  // Simulación simple de formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Nota: Reemplazamos alert() por un console.log o un modal custom en producción
    console.log('Simulación de inicio de sesión o registro. Redireccionando a Onboarding...'); 
    // En una aplicación real, aquí iría la lógica de NextAuth o Supabase
    window.location.href = '/onboarding/step-1-biometrics';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" placeholder="Correo electrónico" required />
          <Input type="password" placeholder="Contraseña" required />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Entrar o Registrarse
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Al continuar, aceptas nuestros términos de servicio.
        </p>
      </div>
    </div>
  );
}