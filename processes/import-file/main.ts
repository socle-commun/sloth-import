import type { SlothImportAllowedExtension, SlothImportOptions } from "../../types.ts";
import { config } from "../../config.ts";
import { log } from "../log/main.ts";
import { globToRegExp } from "https://deno.land/std@0.55.0/path/glob.ts";

export async function importFile<T>(
  fileUrl: URL,
  options?: SlothImportOptions<T>,
): Promise<T | void> {
  const ext = fileUrl.pathname.split(".").pop();
  const allow = options?.allow ?? config.allow ?? ["ts", "js"];
  const ignore = options?.ignore ?? config.ignore ?? ["*.test.ts"];

  if (!ext || !allow.includes(ext as SlothImportAllowedExtension)) {
    log(`Ignore file (not allowed): ${fileUrl}`);
    return;
  }

  const relPath = fileUrl.pathname; // chemin relatif du fichier
  for (const pattern of ignore) {
    const regex = globToRegExp(pattern);
    
    if (regex.test(relPath)) {
      log(`Ignore file (pattern "${pattern}"): ${relPath}`);
      return;
    }
  }

  const mod = await import(fileUrl.href);
  log(`Imported file: ${fileUrl}`);

  if (options?.callback) await options.callback(mod as T);
  return mod as T;
}