import { $Import } from "./mod.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.220.1/assert/mod.ts";

const metaUrl = import.meta.url;

Deno.test("[Comportement par défaut] - import simple fichier", async () => {
  const mod = await $Import<{ value: string }>(metaUrl, "./_fixtures/simple.ts");
  assertEquals(mod.value, "simple");
});

Deno.test("[Comportement par défaut] - import dossier", async () => {
  const mods = await $Import<Record<string, { id: number }>>(metaUrl, "./_fixtures/folder/");
  
  const aKey = Object.keys(mods).find((k) => /_fixtures\/folder\/a\.ts$/.test(k));
  const bKey = Object.keys(mods).find((k) => /_fixtures\/folder\/b\.ts$/.test(k));

  assertExists(aKey);
  assertExists(bKey);
  assertEquals(mods[aKey!].id, 1);
  assertEquals(mods[bKey!].id, 2);
});

Deno.test("[Comportement par défaut] - callback est appelé", async () => {
  const calls: unknown[] = [];
  await $Import(metaUrl, "./_fixtures/simple.ts", {
    callback: async (mod: { value: string }) => { calls.push(mod) },
  });
  assertEquals(calls.length, 1);
  assertEquals((calls[0] as { value: string }).value, "simple");
});

Deno.test("[Comportement par défaut] - fallback est utilisé sur erreur", async () => {
  $Import.config.fallback = <T>() => {
    return { fallback: true } as T;
  };

  const mod = await $Import<{ fallback: boolean }>(metaUrl, "./_fixtures/inexistant.ts");
  assertEquals(mod.fallback, true);

  $Import.config.fallback = undefined; // reset
});

Deno.test("[Comportement par défaut] - multiple fichiers + dossiers", async () => {
  const mods = await $Import<any>(metaUrl, [
    "./_fixtures/simple.ts",
    "./_fixtures/folder/",
  ]);

  const keys = Object.keys(mods);
  const hasSimple = keys.some((k) => /_fixtures\/simple\.ts$/.test(k));
  const hasA = keys.some((k) => /_fixtures\/folder\/a\.ts$/.test(k));
  const hasB = keys.some((k) => /_fixtures\/folder\/b\.ts$/.test(k));

  assertEquals(hasSimple, true);
  assertEquals(hasA, true);
  assertEquals(hasB, true);
});

Deno.test("[Comportement par défaut] - ne doit pas logger par défaut", async () => {
  let logged = false;
  const originalConsoleLog = console.log;
  console.log = () => {
    logged = true;
  };

  try {
    await $Import(metaUrl, "./_fixtures/simple.ts");
    assertEquals(logged, false);
  } finally {
    console.log = originalConsoleLog;
  }
});
