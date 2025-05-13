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
  const entryFileName = options?.entryFileName || config.entryFileName || "mod.ts";
  const tasks: Promise<void>[] = [];

  for await (const entry of Deno.readDir(dirUrl)) {
    const entryUrl = new URL(`./${entry.name}`, dirUrl);
    // 📄 Fichier simple
    if (entry.isFile) {
      const task = importFile<T>(entryUrl, options)
        .then((mod) => {
          if (mod) {
            result[entryUrl.href] = mod;
          }
        })
        .catch((err) => {
          if (isExtensionError(err)) {
            log(`Skipping file with disallowed extension: ${entryUrl}`);
          } else {
            throw err;
          }
        });
      tasks.push(task);
    }

    // 📁 Sous-dossier contenant potentiellement un mod.ts
    if (entry.isDirectory) {
      const mainFile = new URL(`./${entry.name}/${entryFileName}`, dirUrl);
      const task = Deno.stat(mainFile)
        .then((stat) => {
          if (stat.isFile) {
            return importFile<T>(mainFile, options).then((mod) => {
              if (mod) {
                result[mainFile.href] = mod;
              }
            });
          }
        })
        .catch((err) => {
          if (err instanceof Deno.errors.NotFound) {
            log(`No ${entryFileName} found in subdir: ${entryUrl}`);
          } else if (isExtensionError(err)) {
            log(`Subdir entry file has disallowed extension: ${mainFile}`);
          } else {
            log(`Error while importing subdir entry file: (${mainFile}) cwd: [${Deno.cwd()}]`, err.stack);
          }
        });
      tasks.push(task);
    }
  }

  await Promise.all(tasks);
  return result;
}

function isExtensionError(err: unknown): boolean {
  return err instanceof Error && err.message?.startsWith("Extension non autorisée:");
}
