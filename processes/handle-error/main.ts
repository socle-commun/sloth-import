import { config } from "../../config.ts";
import { IMPORT_LOG_PREFIX } from "../../constants.ts";
import { log } from "../log/main.ts";

/**
 * Gère les erreurs d'import : log + fallback.
 * Retourne un module de secours si le fallback est défini, sinon lève une erreur.
 */
export function handleImportError<T>(
  path: string,
  error: unknown,
  fallback?: ((path: string, error: unknown) => T),
): T {
  const message = `Failed to import ${path}`;
  if(config?.logging) {
    log(IMPORT_LOG_PREFIX, message, (error as Error).stack);
  }

  if (typeof fallback === "function") {
    return fallback(path, error);
  }

  throw new Error(message, { cause: error });
}
