// apps/web/src/app/legal/layout

import React from 'react';
import { ChevronLeft, Dumbbell } from 'lucide-react';
import Link from 'next/link'; // Usar Link de Next.js para SPA navigation

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      {/* Header Específico para Legal */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Volver a Sporvit</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Sporvit<span className="text-slate-500">.legal</span></span>
          </div>
        </div>
      </header>

      {/* Aquí se renderizará page.tsx de terms, privacy o cookies */}
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
         {children}
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-slate-400">
            <Link href="/legal/terms" className="hover:text-emerald-400 transition-colors">Términos</Link>
            <Link href="/legal/privacy" className="hover:text-emerald-400 transition-colors">Privacidad</Link>
            <Link href="/legal/cookies" className="hover:text-emerald-400 transition-colors">Cookies</Link>
          </div>
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Sporvit Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}