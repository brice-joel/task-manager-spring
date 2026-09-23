import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ApiError } from '../types/apiError';
import type { ProblemDetail } from '../types/apiError';

/**
 * Couche Infrastructure - Client HTTP Axios
 * Configuré pour communiquer avec le backend Spring Boot.
 * En développement Vite, le proxy redirige automatiquement '/api' vers 'http://localhost:8080'.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

// Intercepteur de requêtes (prêt pour injecter un Bearer token ultérieurement)
apiClient.interceptors.request.use(
  (config) => {
    // Si besoin plus tard : config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Traduction des statuts HTTP usuels selon les principes REST
 */
const getTitleForStatus = (status?: number): string => {
  switch (status) {
    case 400:
      return 'Données invalides';
    case 401:
      return 'Authentification requise';
    case 403:
      return 'Accès refusé';
    case 404:
      return 'Ressource introuvable';
    case 409:
      return 'Conflit de données';
    case 500:
    case 502:
    case 503:
      return 'Erreur du serveur Spring Boot';
    default:
      return 'Erreur de communication';
  }
};

// Intercepteur de réponses pour un traitement standardisé des erreurs REST (RFC 7807)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // 1. Réponse reçue avec un code d'erreur HTTP (ex: 400, 404, 500)
    if (error.response?.data) {
      const data = error.response.data as ProblemDetail;
      const status = error.response.status;

      const problem: ProblemDetail = {
        status,
        title: data.title || getTitleForStatus(status),
        detail:
          data.detail ||
          (data as any).message ||
          error.message ||
          'Une erreur inattendue est survenue.',
        errors: data.errors,
        type: data.type,
        timestamp: data.timestamp,
      };

      return Promise.reject(new ApiError(problem));
    }

    // 2. Erreur réseau (Spring Boot éteint, CORS, déconnexion...)
    const isNetworkError = error.code === 'ERR_NETWORK' || !error.response;
    const networkProblem: ProblemDetail = {
      status: 0,
      title: isNetworkError ? 'Serveur injoignable' : 'Erreur réseau',
      detail: isNetworkError
        ? 'Impossible de communiquer avec le backend Spring Boot sur le port 8080. Vérifiez que votre serveur est allumé.'
        : error.message || 'Une erreur réseau est survenue.',
    };

    return Promise.reject(new ApiError(networkProblem));
  }
);

export default apiClient;
