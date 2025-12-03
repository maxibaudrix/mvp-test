// src/app/contact/page.tsx
'use client';

import React, { useState } from 'react';
// CORRECCIÓN: Eliminamos next/link para evitar errores en el preview
// import Link from 'next/link'; 
import { 
  Mail, MessageSquare, Send, HelpCircle, ChevronDown, 
  ArrowLeft, CheckCircle, AlertCircle, Loader2, Star 
} from 'lucide-react';
import { ContactFormData } from '@/lib/validations/contact'; // Importamos el tipo

// --- Componente FAQ Item ---
const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-slate-900 border-emerald-500/50' : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
        type="button"
      >
        <span className={`font-medium transition-colors ${isOpen ? 'text-emerald-400' : 'text-slate-200'}`}>
          {question}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
      </button>
      
      <div className={`px-5 text-slate-400 text-sm overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        {answer}
      </div>
    </div>
  );
};

// --- Componente Principal ---
export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Estado del formulario
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: 'Soporte Técnico', // Default válido
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: 'Soporte Técnico', message: '' }); // Reset
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-12">
      
      {/* --- Header --- */}
      <header className="sticky top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* CORRECCIÓN: Usamos <a> en lugar de <Link> */}
          <a href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <div className="p-2 rounded-full group-hover:bg-slate-800 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline font-medium">Volver</span>
          </a>
          
          <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Soporte en línea</span>
          </div>
        </div>
      </header>

      <main className="pt-10 px-4 container mx-auto max-w-6xl">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Ayuda y Soporte</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            ¿Tienes problemas con tu plan? Estamos aquí para ayudarte a optimizar tu experiencia en Sporvit.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* --- COLUMNA IZQUIERDA: INFO & SOCIAL PROOF --- */}
          <div className="space-y-6 lg:col-span-1 h-fit sticky top-24">
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold mb-6 text-white border-b border-slate-800 pb-4">Métodos de contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">Email Directo</p>
                    <a href="mailto:support@sporvit.com" className="text-white hover:text-emerald-400 transition-colors font-semibold">
                      support@sporvit.com
                    </a>
                    <p className="text-xs text-slate-500 mt-1">Respuesta &lt; 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0 text-purple-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">Chat en Vivo</p>
                    <button className="text-white hover:text-emerald-400 transition-colors text-left font-semibold underline decoration-slate-700 underline-offset-4">
                      Iniciar conversación
                    </button>
                    <p className="text-xs text-slate-500 mt-1">Lun-Vie: 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-1 text-yellow-400 mb-2">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <span className="text-white font-bold ml-2 text-sm">4.8/5</span>
              </div>
              <p className="text-sm text-slate-300 italic mb-3">
                "El equipo de soporte resolvió mi duda sobre la integración con Apple Health en minutos."
              </p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">- Carlos M., Usuario Pro</p>
            </div>
          </div>

          {/* --- COLUMNA DERECHA: FORMULARIO --- */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Envíanos un mensaje</h3>
              
              {status === 'success' ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">¡Mensaje enviado!</h4>
                  <p className="text-slate-400 mb-6">Hemos recibido tu consulta. Nuestro equipo te contactará a la brevedad.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="text-emerald-400 font-bold hover:text-emerald-300 text-sm"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Nombre</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        disabled={isLoading}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600 disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tucorreo@ejemplo.com"
                        disabled={isLoading}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Asunto</label>
                    <div className="relative">
                      <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="Soporte Técnico">Soporte Técnico</option>
                        <option value="Duda Nutrición">Duda sobre Nutrición</option>
                        <option value="Facturación">Facturación y Pagos</option>
                        <option value="Otros">Otros</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Mensaje</label>
                    <textarea 
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="Describe tu problema o duda con el mayor detalle posible..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none placeholder:text-slate-600 disabled:opacity-50"
                    ></textarea>
                  </div>

                  {status === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {errorMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Mensaje
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3 text-white">
            <HelpCircle className="w-8 h-8 text-slate-500" />
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-4">
            <FaqItem 
              question="¿Cómo cancelo mi suscripción Pro?" 
              answer="Puedes cancelar en cualquier momento desde Configuración > Suscripción. Mantendrás el acceso a las funciones Pro hasta el final del ciclo de facturación actual." 
            />
            <FaqItem 
              question="¿La IA tiene en cuenta mis alergias?" 
              answer="¡Absolutamente! Durante el onboarding registramos todas tus intolerancias y la IA las bloquea automáticamente en cualquier receta sugerida. Puedes actualizar esto en tu perfil." 
            />
            <FaqItem 
              question="¿Puedo exportar mis datos para un médico?" 
              answer="Sí, cumplimos con el GDPR. Puedes descargar un informe completo de tu nutrición y progreso en formato PDF o CSV desde la sección de Configuración." 
            />
            <FaqItem 
              question="¿Con qué apps se sincroniza Sporvit?" 
              answer="Actualmente nos integramos con Apple Health y Google Fit para leer tus pasos, calorías activas y peso automáticamente." 
            />
          </div>
        </div>

      </main>
    </div>
  );
}