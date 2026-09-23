import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Champ de saisie texte réutilisable avec support de label, icônes et message d'erreur.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-stone-700">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`w-full text-xs rounded-xl bg-white border border-[#E5E2D8] text-stone-900 placeholder:text-stone-400 shadow-2xs transition focus:outline-none focus:border-[#2D5A3C] focus:ring-1 focus:ring-[#2D5A3C]/20 disabled:bg-[#F5F3ED] disabled:cursor-not-allowed ${
              leftIcon ? 'pl-9' : 'px-3.5'
            } ${rightIcon ? 'pr-9' : 'px-3.5'} py-2.5 ${
              error ? 'border-[#F7D2D4] focus:border-[#8C282F]' : ''
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-[11px] text-[#8C282F]">{error}</p>}
        {!error && helperText && (
          <p className="text-[11px] text-stone-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
