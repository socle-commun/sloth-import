import type { SlothImportOptions } from "../../types.ts";
import { config } from "../../config.ts";
import { log } from "../log/main.ts";
import { importFile } from "../import-file/main.ts";

/**
 * Importe tous les fichiers .ts (ou autres extensions autorisées)
 * à la racine d’un dossier + fichier d’entrée (main.ts) dans les sous-dossiers.
 */
export async function importDirectory<T>(
  dirUrl: URL,
  options?: SlothImportOptions<T>,
): Promise<Record<string, T>> {
  const result: Record<string, T> = {};
  const entryFileName = options?.entryFileName ?? config.entryFileName ?? "mod.ts";

  for await (const entry of Deno.readDir(dirUrl)) {
    const entryUrl = new URL(entry.name, dirUrl);

    // 📄 Fichier simple
    if (entry.isFile) {
      try {
        const mod = await importFile<T>(entryUrl, options);
        if(mod) {
          result[entryUrl.href] = mod;
        }
      } catch (err) {
        if (isExtensionError(err)) {
          log(`Skipping file with disallowed extension: ${entryUrl}`);
        } else {
          throw err;
        }
      }
    }

    // 📁 Sous-dossier contenant potentiellement un main.ts
    if (entry.isDirectory) {
      const mainFile = new URL(`${entry.name}/${entryFileName}`, dirUrl);
      try {
        const stat = await Deno.stat(mainFile);
        if (stat.isFile) {
          const mod = await importFile<T>(mainFile, options);
          if(mod) {
            result[mainFile.href] = mod;
          }
        }
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          log(`No ${entryFileName} found in subdir: ${entryUrl}`);
        } else if (isExtensionError(err)) {
          log(`Subdir entry file has disallowed extension: ${mainFile}`);
        } else {
          throw err;
        }
      }
    }
  }

  return result;
}

function isExtensionError(err: unknown): boolean {
  return err instanceof Error && err.message?.startsWith("Extension non autorisée:");
}
