import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`p-4 rounded-2xl bg-white border border-[#EAE7DF] shadow-xs ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
