import { importFile } from "./main.ts";
import {
  assertEquals,
  assertStrictEquals,
  assert,
} from "https://deno.land/std@0.220.1/assert/mod.ts";

Deno.test("importFile - autorise les extensions valides", async () => {
  const url = new URL("../../_fixtures/allowtest/valid.ts", import.meta.url);
  const mod = await importFile<{ ok: boolean }>(url, { allow: ["ts"] });
  assert(mod);
  assertEquals(mod?.ok, true);
});

Deno.test("importFile - retourne void si extension non autorisée", async () => {
  const url = new URL("../../_fixtures/allowtest/invalid.md", import.meta.url);
  const mod = await importFile(url, { allow: ["ts"] });
  assertStrictEquals(mod, undefined);
});

Deno.test("importFile - retourne void si aucune extension détectée", async () => {
  const url = new URL("../../_fixtures/allowtest/valid", import.meta.url);
  const mod = await importFile(url, { allow: ["ts"] });
  assertStrictEquals(mod, undefined);
});

Deno.test("importFile - utilise la config globale si options.absentes", async () => {
  const url = new URL("../../_fixtures/allowtest/valid.ts", import.meta.url);
  const mod = await importFile<{ ok: boolean }>(url); // fallback sur config.allow
  assert(mod);
  assertEquals(mod?.ok, true);
});

Deno.test("importFile - appelle le callback si fourni", async () => {
  const url = new URL("../../_fixtures/allowtest/valid.ts", import.meta.url);
  let called = false;

  await importFile<{ ok: boolean }>(url, {
    callback: async (mod) => {
      called = true;
      assertEquals(mod.ok, true);
    },
  });

  assertEquals(called, true);
});
