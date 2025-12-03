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

  // Tipificación de 'password' como string
  const passwordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
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

  // Tipificación de 'e' como React.MouseEvent<HTMLButtonElement>
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
        // Simulación de registro exitoso
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        console.log('Registro exitoso para:', formData.email);
        
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

  // Tipificación de 'provider' como string
  const handleSocialLogin = (provider: string) => {
    console.log(`Iniciando sesión con ${provider}...`);
    setError('');
    setIsLoading(true);
  };


  return (
    // MODIFICACIÓN 1: Eliminar bg-gray-50 para usar el fondo del layout.
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* MODIFICACIÓN 2: Usar bg-slate-800 y border-slate-700 para la tarjeta */}
      <div className="w-full max-w-md bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-700">
        <div className="text-center mb-8">
          {/* MODIFICACIÓN 3: Usar text-primary para el ícono de acento */}
          <Dumbbell className="w-12 h-12 text-primary mx-auto mb-3" /> 
          {/* MODIFICACIÓN 4: Usar text-white/text-foreground para el título principal */}
          <h2 className="text-3xl font-extrabold text-white">
            Únete a Sporvit
          </h2>
          {/* MODIFICACIÓN 5: Usar text-slate-400 para el subtítulo */}
          <p className="mt-2 text-sm text-slate-400">
            Tu camino hacia un estilo de vida más saludable comienza aquí.
          </p>
        </div>

        {/* Social Login Section */}
        <div className="space-y-4 mb-8">
            <button
              onClick={() => handleSocialLogin('google')}
              // MODIFICACIÓN 6: Adaptar el botón social al dark mode
              className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-700 rounded-xl shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 transition-colors"
              disabled={isLoading}
            >
              <Chrome className="w-5 h-5 mr-3 text-red-500" />
              Continuar con Google
            </button>
            <div className="relative flex justify-center text-xs">
              {/* MODIFICACIÓN 7: Adaptar el divisor al dark mode */}
              <span className="px-2 bg-slate-800 text-slate-500">
                o usa tu email
              </span>
            </div>
        </div>

        {/* Error Message (Mantenido, ya es contrastante) */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl relative mb-6" role="alert">
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
                // MODIFICACIÓN 8: Inputs con bg-slate-900, border-slate-700 y focus:ring-primary
                className="w-full px-5 py-3 border border-slate-700 rounded-xl focus:ring-primary focus:border-primary bg-slate-900 text-white placeholder-slate-500 transition-colors pl-12"
                disabled={isLoading}
              />
              {/* MODIFICACIÓN 9: Icono con text-slate-500 */}
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
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
                // MODIFICACIÓN 8: Inputs con bg-slate-900, border-slate-700 y focus:ring-primary
                className="w-full px-5 py-3 border border-slate-700 rounded-xl focus:ring-primary focus:border-primary bg-slate-900 text-white placeholder-slate-500 transition-colors pl-12"
                disabled={isLoading}
              />
              {/* MODIFICACIÓN 9: Icono con text-slate-500 */}
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
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
                // MODIFICACIÓN 8: Inputs con bg-slate-900, border-slate-700 y focus:ring-primary
                className="w-full px-5 py-3 border border-slate-700 rounded-xl focus:ring-primary focus:border-primary bg-slate-900 text-white placeholder-slate-500 transition-colors pl-12 pr-12"
                disabled={isLoading}
              />
              {/* MODIFICACIÓN 9: Icono con text-slate-500 */}
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                // MODIFICACIÓN 10: Botón de ojo con text-slate-500
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2 flex justify-between items-center text-xs">
                {/* La clase de color dinámica se mantiene, pero actualizamos el fallback oscuro para las barras vacías */}
                <span className={`font-semibold text-${strength.color}-500`}>
                  {strength.label}
                </span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      // MODIFICACIÓN 11: Barras vacías con bg-slate-700
                      className={`h-1 w-8 rounded-full ${i <= strength.strength ? `bg-${strength.color}-500` : 'bg-slate-700'}`}
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
                // MODIFICACIÓN 8: Inputs con bg-slate-900, border-slate-700 y focus:ring-primary
                className="w-full px-5 py-3 border border-slate-700 rounded-xl focus:ring-primary focus:border-primary bg-slate-900 text-white placeholder-slate-500 transition-colors pl-12 pr-12"
                disabled={isLoading}
              />
              {/* MODIFICACIÓN 9: Icono con text-slate-500 */}
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                // MODIFICACIÓN 10: Botón de ojo con text-slate-500
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password && formData.confirmPassword && (
                <p className={`mt-2 text-xs font-medium flex items-center gap-1 ${formData.password === formData.confirmPassword ? 'text-primary' : 'text-red-500'}`}>
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
                // MODIFICACIÓN 12: Checkbox con text-primary y focus:ring-primary
                className="h-4 w-4 text-primary border-slate-700 rounded focus:ring-primary bg-slate-900"
                disabled={isLoading}
              />
              <label htmlFor="acceptTerms" className="ml-3 block text-sm text-slate-400">
                Acepto los{' '}
                {/* MODIFICACIÓN 13: Link de términos con text-primary */}
                <span className="font-medium text-primary hover:text-primary/80 cursor-pointer">
                  Términos y Condiciones
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              // MODIFICACIÓN 14: Botón con gradiente usando primary y shadow-primary
              className="w-full py-3 bg-gradient-to-r from-primary to-teal-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
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
            {/* MODIFICACIÓN 15: Link de iniciar sesión con text-primary */}
            <a href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Inicia sesión
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          {/* MODIFICACIÓN 16: Link de volver al inicio con text-slate-400 */}
          <a href="/" className="text-sm text-slate-400 hover:text-slate-300 transition-colors">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default SporvitRegister;