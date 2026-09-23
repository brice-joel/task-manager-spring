import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#2D5A3C] hover:bg-[#234730] text-white shadow-xs focus-visible:ring-[#2D5A3C]/30',
  secondary:
    'bg-white border border-[#E0DCD1] text-stone-700 hover:bg-[#F2EFE8] shadow-2xs focus-visible:ring-stone-400/30',
  outline:
    'border border-[#E6E2D7] bg-white text-stone-600 hover:bg-[#F5F3ED] hover:text-stone-900 shadow-xs focus-visible:ring-stone-400/30',
  ghost:
    'bg-transparent text-stone-500 hover:text-stone-800 hover:bg-[#F2EFE8] focus-visible:ring-stone-400/30',
  danger:
    'text-stone-400 hover:text-rose-600 hover:bg-rose-50 focus-visible:ring-rose-500/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-4 py-2.5 text-xs rounded-xl gap-2',
  lg: 'px-5 py-3 text-sm rounded-2xl gap-2.5',
  icon: 'p-2 rounded-xl',
  'icon-sm': 'p-1.5 rounded-lg',
};

/**
 * Bouton d'action réutilisable avec support des variantes, tailles, états de chargement et icônes.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center font-medium transition cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
