import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Web App',
    default: 'Web App - Tu Nutricionista y Entrenador IA',
  },
  description: 'Logra tus objetivos físicos con planes de alimentación y entrenamiento generados por Inteligencia Artificial.',
  keywords: ['nutrición', 'ia', 'fitness', 'entrenamiento', 'dieta', 'salud'],
  authors: [{ name: 'Web App Team' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://webapp.com',
    siteName: 'Web App',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-white antialiased min-h-screen selection:bg-emerald-500/30 selection:text-emerald-200`}>
        {children}
      </body>
    </html>
  );
}
