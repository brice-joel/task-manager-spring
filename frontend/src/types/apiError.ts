/**
 * Structure normalisée pour les erreurs API suivant la spécification RFC 7807 (Problem Details).
 * C'est le format standard produit par Spring Boot 3+ (@RestControllerAdvice / ProblemDetail).
 */
export interface ProblemDetail {
  type?: string;
  title?: string;
  status: number;
  detail?: string;
  instance?: string;
  timestamp?: string;
  /** Dictionnaire des erreurs de validation par champ (@Valid Spring Boot) */
  errors?: Record<string, string>;
  [key: string]: unknown;
}

/**
 * Classe d'erreur personnalisée pour encapsuler les retours d'erreurs HTTP REST.
 */
export class ApiError extends Error {
  status: number;
  title?: string;
  detail?: string;
  validationErrors?: Record<string, string>;

  constructor(problem: ProblemDetail) {
    const fallbackMessage = problem.title || `Erreur HTTP ${problem.status}`;
    super(problem.detail || fallbackMessage);

    this.name = 'ApiError';
    this.status = problem.status;
    this.title = problem.title;
    this.detail = problem.detail;
    this.validationErrors = problem.errors;

    // Maintient la pile d'exécution intacte en JS
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Indique si l'erreur provient d'une validation de formulaire (HTTP 400 Bad Request)
   */
  isValidationError(): boolean {
    return this.status === 400 && Boolean(this.validationErrors && Object.keys(this.validationErrors).length > 0);
  }

  /**
   * Retourne la liste des messages de validation s'il y en a.
   */
  getValidationMessages(): string[] {
    if (!this.validationErrors) return [];
    return Object.entries(this.validationErrors).map(
      ([field, msg]) => `${field} : ${msg}`
    );
  }
}
