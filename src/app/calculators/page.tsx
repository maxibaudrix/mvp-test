import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, Activity, Scale, Dumbbell, 
  ChefHat, HeartPulse, ChevronRight, Lock 
} from 'lucide-react';
import { Header } from '@/components/ui/layout/public/Header';
import { Footer } from '@/components/ui/layout/public/Footer';

export const metadata: Metadata = {
  title: 'Calculadoras Fitness y Nutrición | Sporvit',
  description: 'Herramientas gratuitas de precisión: FFMI, IMC, TDEE, 1RM y más. Optimiza tu entrenamiento con datos reales.',
};

export default function CalculatorsHubPage() {
  const calculators = [
    {
      title: "Indice de Masa Libre de Grasa (FFMI)",
      description: "Más preciso que el IMC. Determina cuánto músculo real tienes y tu potencial genético natural.",
      icon: <Dumbbell className="w-8 h-8 text-emerald-400" />,
      href: "/calculators/ffmi",
      status: "active",
      badge: "Nuevo"
    },
    {
      title: "Gasto Calórico Diario (TDEE)",
      description: "Calcula cuántas calorías necesitas exactamente para definir, mantener o ganar volumen.",
      icon: <FlameIcon className="w-8 h-8 text-orange-400" />,
      href: "/calculators/tdee", // En el futuro
      status: "coming_soon"
    },
    {
      title: "Calculadora de 1RM (Fuerza)",
      description: "Estima tu repetición máxima en básicos (Squat, Bench, Deadlift) sin riesgo de fallo.",
      icon: <Activity className="w-8 h-8 text-blue-400" />,
      href: "/calculators/1rm",
      status: "coming_soon"
    },
    {
      title: "Calculadora de Macros Keto",
      description: "Distribución exacta de grasas y proteínas para entrar y mantenerte en cetosis.",
      icon: <ChefHat className="w-8 h-8 text-purple-400" />,
      href: "/calculators/keto",
      status: "coming_soon"
    },
    {
      title: "Índice de Masa Corporal (IMC)",
      description: "El estándar básico de salud. Evaluación rápida de tu peso en relación a tu altura.",
      icon: <Scale className="w-8 h-8 text-teal-400" />,
      href: "/calculators/imc",
      status: "coming_soon"
    },
    {
      title: "Potencial Muscular Genético",
      description: "Modelo de Casey Butt para estimar cuánto músculo puedes ganar naturalmente.",
      icon: <HeartPulse className="w-8 h-8 text-pink-400" />,
      href: "/calculators/genetic",
      status: "pro_only"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      <Header />

      <main className="pt-16 pb-16 container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <Calculator className="w-3 h-3" />
            Herramientas Gratuitas
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Calculadoras Fitness de Precisión
          </h1>
          <p className="text-xl text-slate-400">
            Deja de adivinar. Utiliza la ciencia y las matemáticas para planificar tu transformación física con datos reales.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc) => (
            <div 
              key={calc.title}
              className={`group relative flex flex-col p-6 rounded-3xl border transition-all duration-300 ${
                calc.status === 'active' 
                  ? 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-900/20 cursor-pointer' 
                  : 'bg-slate-900/20 border-slate-800/50 opacity-75'
              }`}
            >
              {/* Enlace envolvente solo si está activo */}
              {calc.status === 'active' && (
                <Link href={calc.href} className="absolute inset-0 z-10" aria-label={`Ir a ${calc.title}`} />
              )}

              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform duration-300`}>
                  {calc.icon}
                </div>
                {calc.badge && (
                  <span className="px-2 py-1 bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase rounded-full">
                    {calc.badge}
                  </span>
                )}
                {calc.status === 'coming_soon' && (
                  <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase rounded-full border border-slate-700">
                    Pronto
                  </span>
                )}
                {calc.status === 'pro_only' && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase rounded-full border border-purple-500/20">
                    <Lock className="w-3 h-3" /> Pro
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {calc.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-grow">
                {calc.description}
              </p>

              <div className="flex items-center text-sm font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                Usar Calculadora <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}

// Icono helper
const FlameIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
);