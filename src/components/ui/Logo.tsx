import React from 'react';
import { Dumbbell } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'header'; // 'header' usa degradado esmeralda/teal para el texto
  showText?: boolean;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  variant = 'default',
  showText = true, 
  href = "/"
}) => {

  const textClasses = variant === 'header'
    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent';

  const logoContent = (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Icon */}
      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
        <Dumbbell className="w-6 h-6 text-white" />
      </div>
      {/* Text */}
      {showText && (
        <span className={`text-2xl font-bold ${textClasses}`}>
          Sporvit
        </span>
      )}
    </div>
  );

  return href ? <Link href={href}>{logoContent}</Link> : logoContent;
};