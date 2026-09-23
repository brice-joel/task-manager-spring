import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'neutral' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-[#EAF3EB] text-[#2D5A3C] border-[#D5E6D8]',
  warning: 'bg-[#FAF3E8] text-[#8C5E24] border-[#F2DEBF]',
  neutral: 'bg-[#F4F2EC] text-stone-700 border-[#E6E2D7]',
  danger: 'bg-[#FDF2F2] text-[#8C282F] border-[#F7D2D4]',
  info: 'bg-[#EDF4F9] text-[#1E5680] border-[#D0E2EE]',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-2 py-0.5 rounded-md',
  md: 'text-[11px] px-2.5 py-1 rounded-lg',
};

/**
 * Badge de statut réutilisable pour afficher les états, compteurs ou catégories.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  icon,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border uppercase tracking-wider ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
