//register/page.tsx
'use client';
import React, { useState } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, Dumbbell, AlertCircle, 
  Loader, ArrowRight, Chrome, User, CheckCircle
} from 'lucide-react';

const SporvitRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  // FIX 1: Tipificación de 'password' como string
  const passwordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' }; // Asegurar que 'color' existe
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const labels = ['', 'Débil', 'Media', 'Buena', 'Fuerte'];
    const colors = ['', 'red', 'orange', 'yellow', 'emerald'];
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const strength = passwordStrength(formData.password);

  // FIX 2: Tipificación de 'e' como React.FormEvent (para formularios) o React.MouseEvent (si es solo un botón)
  // Dado que previene el comportamiento por defecto, se usa React.FormEvent<HTMLFormElement> o React.MouseEvent<HTMLButtonElement>
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
        setError('Debes aceptar los términos y condiciones.');
        setIsLoading(false);
        return;
    }

    try {
        // Lógica de registro real:
        // const response = await fetch('/api/auth/register', { ... });
        // const data = await response.json();
        
        // Simulación de éxito
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        console.log('Registro exitoso para:', formData.email);
        // Redirigir o mostrar mensaje de éxito
        
    } catch (err: any) {
        setError(err.message || 'Error desconocido al registrar.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // FIX 3: Tipificación de 'provider' como string
  const handleSocialLogin = (provider: string) => {
    // Aquí iría la lógica para iniciar sesión con Google, Chrome, etc.
    // Ej: window.location.href = `/api/auth/social?provider=${provider}`;
    console.log(`Iniciando sesión con ${provider}...`);
    setError('');
    setIsLoading(true);
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="text-center mb-8">
          <Dumbbell className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Únete a Sporvit
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Tu camino hacia un estilo de vida más saludable comienza aquí.
          </p>
        </div>

        {/* Social Login Section */}
        <div className="space-y-4 mb-8">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
              disabled={isLoading}
            >
              <Chrome className="w-5 h-5 mr-3 text-red-500" />
              Continuar con Google
            </button>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                o usa tu email
              </span>
            </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="sr-only">Nombre</label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Tu Nombre"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors pl-12"
                disabled={isLoading}
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors pl-12"
                disabled={isLoading}
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="sr-only">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors pl-12 pr-12"
                disabled={isLoading}
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2 flex justify-between items-center text-xs">
                <span className={`font-semibold text-${strength.color}-500`}>
                  {strength.label}
                </span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 w-8 rounded-full ${i <= strength.strength ? `bg-${strength.color}-500` : 'bg-gray-200 dark:bg-gray-600'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="sr-only">Confirmar Contraseña</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors pl-12 pr-12"
                disabled={isLoading}
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password && formData.confirmPassword && (
                <p className={`mt-2 text-xs font-medium flex items-center gap-1 ${formData.password === formData.confirmPassword ? 'text-emerald-500' : 'text-red-500'}`}>
                    {formData.password === formData.confirmPassword ? 
                        <>
                            <CheckCircle className="w-3 h-3"/>
                            Contraseñas coinciden
                        </>
                        : 
                        <>
                            <AlertCircle className="w-3 h-3"/>
                            Contraseñas no coinciden
                        </>
                    }
                </p>
            )}
          </div>

          <div className="space-y-6">
            {/* Terms Checkbox */}
            <div className="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                disabled={isLoading}
              />
              <label htmlFor="acceptTerms" className="ml-3 block text-sm text-gray-700 dark:text-gray-400">
                Acepto los{' '}
                <span className="font-medium text-emerald-500 hover:text-emerald-400 cursor-pointer">
                  Términos y Condiciones
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear cuenta gratis
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Inicia sesión
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <a href="/" className="text-sm text-slate-500 hover:text-slate-400 transition-colors">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default SporvitRegister;