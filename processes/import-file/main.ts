import type { SlothImportAllowedExtension, SlothImportOptions } from "../../types.ts";
import { config } from "../../config.ts";
import { log } from "../log/main.ts";


/**
 * Importe un fichier compatible (TS, JS, JSON...) si son extension est autorisée.
 */
export async function importFile<T>(
  fileUrl: URL,
  options?: SlothImportOptions<T>,
): Promise<T | void> {
  const ext = fileUrl.pathname.split(".").pop();
  const allow = options?.allow ?? config.allow ?? ["ts", "js"];

  if (!ext || !allow.includes(ext as SlothImportAllowedExtension)) {
    log(`Ignore file: ${fileUrl}`);
    return;
  }

  let mod: unknown;
  mod = await import(fileUrl.href);
  log(`Imported file: ${fileUrl}`);

  if (options?.callback) await options.callback(mod as T);
  return mod as T;
}
