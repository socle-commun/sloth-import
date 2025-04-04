import type { SlothImportConfiguration } from "./types.ts";

/**
 * Configuration centrale partagée par tous les process internes de $Import.
 * Elle est peuplée dynamiquement au moment de l’exécution par mod.ts.
 */
export const config: SlothImportConfiguration = {
  logging: false,
  entryFileName: undefined,
};
