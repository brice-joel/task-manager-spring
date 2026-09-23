import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

/**
 * Composant Toaster stylisé pour s'intégrer à la palette lin/naturelle de l'application.
 */
export const Toaster: React.FC = () => {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        className:
          '!rounded-2xl !border !border-[#E6E2D7] !bg-[#FAF9F6] !shadow-lg !font-sans !p-4',
        style: {
          color: '#292524',
        },
      }}
    />
  );
};
