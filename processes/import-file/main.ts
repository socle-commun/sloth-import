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
    log(`Ignore file (not allowed): ${fileUrl.href}`);
    return;
  }

  const relPath = fileUrl.pathname;
  for (const pattern of ignore) {
    const regex = globToRegExp(pattern);

    if (regex.test(relPath)) {
      log(`Ignore file (pattern "${pattern}"): ${fileUrl.href}`);
      return;
    }
  }

  // Cas Deno deploy
  // @see https://docs.deno.com/deploy/api/dynamic-import/#one-exception---dynamic-specifiers-work-for-same-project-files
  const root = Deno.cwd().replaceAll(/\\/g, "/");
  let specifier = fileUrl.pathname.replace(root, "");
  specifier = specifier.slice(1);
  log(`Import file: ${`../../${specifier}`}`, '-', fileUrl.pathname);
  const mod = await import(`../../${specifier}`)

  if (options?.callback) await options.callback(mod as T);
  return mod as T;
}