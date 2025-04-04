/**
 * Résout les chemins relatifs en URLs absolues
 * à partir de l'URL du fichier appelant ($Import).
 */
export function resolvePaths(importMetaUrl: string, paths: string | string[]): URL[] {
    const base = new URL(importMetaUrl);
    const list = Array.isArray(paths) ? paths : [paths];
    return list.map((p) => new URL(p, base));
  }
  