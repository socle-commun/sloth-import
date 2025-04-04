import { SlothImport, SlothImportOptions } from "./types.ts";
import { config } from "./config.ts";
import { resolvePaths } from "./processes/resolve-path/main.ts";
import { importFile } from "./processes/import-file/main.ts";
import { importDirectory } from "./processes/import-directory/main.ts";
import { handleImportError } from "./processes/handle-error/main.ts";

/**
 * $Import 🦥 – Importation dynamique avancée pour Deno
 *
 * ➕ Fonctions actuelles :
 * ─────────────────────────────
 * 📄 Import d’un fichier unique `.ts`
 * 📁 Import d’un dossier (non récursif) de fichiers `.ts`
 * 🧩 Support des tableaux de chemins (mixte fichiers + dossiers)
 * 🔍 Logging configurable :
 *     - `$Import.logging = true` (console.log)
 *     - `$Import.logging = fn(...args)`
 * 🔧 Callback post-import pour chaque module (`options.callback`)
 * 🧯 Fallback sur erreur (`$Import.fallback(path, error)`)
 * 📦 Retour : un module (T) ou un dictionnaire de modules `{ href: T }`
 */
export const $Import: SlothImport = async function <T>(
  importMetaUrl: string,
  path: string | string[],
  options: SlothImportOptions<T> = {},
): Promise<T> {
  const urls = resolvePaths(importMetaUrl, path);
  const imports: Record<string, T> = {};

  for (const url of urls) {
    try {
      const fileInfo = await Deno.stat(url);

      if (fileInfo.isFile) {
        const mod = await importFile<T>(url, options);
        if(mod) {
          imports[url.href] = mod;
        }
      }

      if (fileInfo.isDirectory) {
        const mods = await importDirectory<T>(url, options);
        Object.assign(imports, mods);
      }
    } catch (err) {
      const fallbackResult = handleImportError<T>(
        url.href,
        err,
        config.fallback,
      );
      if (fallbackResult) {
        imports[url.href] = fallbackResult;
      }
    }
  }

  // Si un seul élément demandé et un seul résultat
  if (!Array.isArray(path) && Object.keys(imports).length === 1) {
    return imports[Object.keys(imports)[0]];
  }

  return imports as unknown as T;
} as SlothImport;

// Alimente la config centrale
$Import.config = config;
