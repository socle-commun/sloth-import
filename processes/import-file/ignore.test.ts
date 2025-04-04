import { config } from "../../config.ts";
import { importFile } from "./main.ts";
import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.220.1/assert/mod.ts";

config.logging = true; // Activer les logs pour les tests

Deno.test("importFile - ignore les fichiers via option ignore", async () => {
  const url = new URL("../../_fixtures/allowtest/valid.ts", import.meta.url);
  const mod = await importFile<{ ok: boolean }>(url, {
    allow: ["ts"],
    ignore: ["**/*.ts"],
  });

  assertStrictEquals(mod, undefined); // car ignoré
});

Deno.test("importFile - ne pas ignorer si le fichier ne matche pas", async () => {
  const url = new URL("../../_fixtures/allowtest/valid.ts", import.meta.url);
  const mod = await importFile<{ ok: boolean }>(url, {
    allow: ["ts"],
    ignore: ["**/*.test.ts"],
  });

  assertEquals(mod?.ok, true);
});
