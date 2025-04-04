import { config } from "../../config.ts";
import { IMPORT_LOG_PREFIX } from "../../constants.ts";


export function log(...args: unknown[]) {
  // Accès dynamique à $Import pour éviter les imports circulaires
  const logging = config?.logging;

  if (logging === true) {
    console.log(IMPORT_LOG_PREFIX, ...args);
  } else if (typeof logging === "function") {
    logging(IMPORT_LOG_PREFIX, ...args);
  }
}
