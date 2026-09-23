import { toast } from 'sonner';
import { ApiError } from '../types/apiError';

/**
 * Service de notifications Toaster structuré pour les applications REST.
 * Traduit automatiquement les erreurs RFC 7807 (ProblemDetail) en messages lisibles.
 */
export const notify = {
  /**
   * Notification de succès
   */
  success(message: string, description?: string) {
    toast.success(message, {
      description,
      duration: 3500,
    });
  },

  /**
   * Notification d'information
   */
  info(message: string, description?: string) {
    toast.info(message, {
      description,
      duration: 3500,
    });
  },

  /**
   * Notification d'avertissement
   */
  warning(message: string, description?: string) {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Notification d'erreur intelligente.
   * Gère les ApiError (validation 400, 404, 500, etc.) ainsi que les erreurs réseau.
   */
  error(err: unknown, fallbackTitle = 'Une erreur est survenue') {
    if (err instanceof ApiError) {
      // 1. Cas d'erreur de validation (HTTP 400 avec champs invalides)
      if (err.isValidationError() && err.validationErrors) {
        const errorList = Object.entries(err.validationErrors);

        toast.error(err.title || 'Erreur de validation', {
          description: (
            <div className="mt-1 space-y-1 text-xs">
              <p className="font-medium text-stone-700">{err.detail}</p>
              <ul className="list-disc pl-4 space-y-0.5 text-stone-600">
                {errorList.map(([field, msg]) => (
                  <li key={field}>
                    <span className="font-semibold text-stone-800 capitalize">{field}</span> : {msg}
                  </li>
                ))}
              </ul>
            </div>
          ),
          duration: 6000,
        });
        return;
      }

      // 2. Erreur HTTP classique avec ProblemDetail (404, 403, 500...)
      toast.error(err.title || fallbackTitle, {
        description: err.detail || err.message,
        duration: 5000,
      });
      return;
    }

    // 3. Erreur JavaScript classique ou message texte
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
        ? err
        : fallbackTitle;

    toast.error(fallbackTitle, {
      description: message,
      duration: 4000,
    });
  },
};
