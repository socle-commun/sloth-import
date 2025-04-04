
export interface SlothImportOptions<T> {
  callback?: (module: T) => Promise<void>
  /** Nom de fichier à rechercher dans les sous-dossiers (par défaut : "main.ts") */
  entryFileName?: string;
  /** Extensions autorisées lors de l'importation de fichiers */
  allow?: SlothImportAllowedExtension[];
}

export type SlothImport = {
  <T>(importMetaUrl: string, path: string | string[], options?: SlothImportOptions<T>): Promise<T>;

  config: SlothImportConfiguration
};

/**
 * Structure de configuration partagée utilisée par les process internes.
 */
export interface SlothImportConfiguration {
  logging: boolean | ((...args: unknown[]) => void);
  fallback?: <T>(path: string, error: unknown) => T;
  /** Nom de fichier à rechercher dans les sous-dossiers (par défaut : "main.ts") */
  entryFileName?: string;
  /** Extensions autorisées lors de l'importation de fichiers */
  allow?: SlothImportAllowedExtension[]
}

export type SlothImportAllowedExtension = "ts" | "mts" | "js" | "jsx" | "tsx";