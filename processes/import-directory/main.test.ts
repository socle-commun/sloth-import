import { config } from "../../config.ts";
import { importDirectory } from "./main.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.220.1/assert/mod.ts";

Deno.test("importDirectory - importe tous les fichiers .ts d’un dossier", async () => {
  const dir = new URL("../../_fixtures/folder/", import.meta.url);
  const result = await importDirectory<{ id: number }>(dir);

  const keys = Object.keys(result);
  assertEquals(keys.length, 2);

  const a = keys.find((k) => k.endsWith("/a.ts"));
  const b = keys.find((k) => k.endsWith("/b.ts"));

  assertExists(a);
  assertExists(b);
  assertEquals(result[a!].id, 1);
  assertEquals(result[b!].id, 2);
});

Deno.test("importDirectory - appelle le callback pour chaque fichier", async () => {
  const dir = new URL("../../_fixtures/folder/", import.meta.url);
  const calls: unknown[] = [];

  await importDirectory(dir, {
    callback: (mod) => {calls.push(mod); return Promise.resolve();},
  });

  assertEquals(calls.length, 2);
});

Deno.test("resolvePaths - Gère les chemins ambigus", async () => {
  const dir = new URL("../../_fixtures/folder/", import.meta.url); 
  config.logging = true;
  console.log(dir.href)
  
  await importDirectory(dir);

  // ne doit pas planter
});