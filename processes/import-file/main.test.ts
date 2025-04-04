import { importFile } from "./main.ts";
import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";

Deno.test("importFile - importe un module .ts et retourne son contenu", async () => {
  const url = new URL("../../_fixtures/simple.ts", import.meta.url);
  const mod = await importFile<{ value: string }>(url);
  assertEquals(mod.value, "simple");
});

Deno.test("importFile - appelle le callback si fourni", async () => {
  const url = new URL("../../_fixtures/simple.ts", import.meta.url);
  let called = false;

  await importFile<{ value: string }>(url, {
    callback: async (mod) => {
      if (mod.value === "simple") called = true;
    },
  });

  assertEquals(called, true);
});
