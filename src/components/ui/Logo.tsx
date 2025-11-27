import React from 'react';
import { Dumbbell } from 'lucide-react';

interface LogoProps {
  className?: string;
  hideText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ 
  className = '', 
  hideText = false,
  size = 'md'
}: LogoProps) => {
  const sizeClasses = {
    sm: { container: 'w-6 h-6', icon: 'w-4 h-4', text: 'text-base' },
    md: { container: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-xl' },
    lg: { container: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-2xl' },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizes.container} bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20`}>
        <Dumbbell className={`${sizes.icon} text-white`} />
      </div>
      {!hideText && (
        <span className={`${sizes.text} font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent`}>
          Web App
        </span>
      )}
    </div>
  );
};
